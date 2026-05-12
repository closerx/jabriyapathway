import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

import { Language } from './types';
import { translations, initialPatients, initialGoalsData, goalsColorsMap } from './data';
import { GlobalFooter } from './components/GlobalFooter';
import { AuthScreen } from './components/AuthScreen';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { PatientsScreen } from './components/PatientsScreen';
import { PatientDetailsScreen } from './components/PatientDetailsScreen';
import { IndicatorDetailsScreen } from './components/IndicatorDetailsScreen';
import { StatisticsScreen } from './components/StatisticsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { PatientFormModal } from './components/PatientFormModal';
import { AddTestModal } from './components/AddTestModal';
import { EditGoalModal } from './components/EditGoalModal';

import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  getUserProfile, 
  subscribeToPatients, 
  subscribeToGoals, 
  addPatient, 
  updatePatient, 
  updateGoal 
} from './lib/firestoreService';

function App() {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('app_lang') as Language) || 'ar';
  });

  const t = translations[lang] as any;
  const isAr = lang === 'ar';

  const toggleLanguage = () => {
    const newLang = isAr ? 'en' : 'ar';
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isAr]);

  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [authState, setAuthState] = useState<'login_phone' | 'login_code' | 'profile_setup' | 'authenticated'>(auth.currentUser ? 'authenticated' : 'login_phone');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authCode, setAuthCode] = useState(['', '', '', '', '', '']);
  const [authProfile, setAuthProfile] = useState({ 
    nameAr: '', 
    nameEn: '', 
    staffId: '', 
    specialization: 'general',
    phone: '',
    email: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let profile = null;
        try {
          profile = await getUserProfile(user.uid);
          
          // Handle race condition right after signup
          if (!profile) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            profile = await getUserProfile(user.uid);
          }
        } catch (error) {
          console.error("Error fetching profile, defaulting to empty profile", error);
        }

        if (profile) {
          // Backward compatibility for profiles that saved email in phone field
          if (profile.phone && profile.phone.includes('@') && !profile.email) {
            profile.email = profile.phone;
            profile.phone = '';
          }
          setAuthProfile(profile as any);
          setAuthState(prevState => {
            if (prevState === 'login_code') return 'login_code';
            if (prevState === 'profile_setup' && !profile.isEmailVerified) {
              return 'login_code';
            }
            if (prevState === 'login_phone' && profile.isEmailVerified) {
              return 'authenticated';
            }
            if (prevState === 'login_phone' && !profile.isEmailVerified) {
               return 'authenticated';
            }
            return 'authenticated';
          });
        } else {
          setAuthState('profile_setup');
        }
      } else {
        setAuthState('login_phone');
        setAuthProfile({ nameAr: '', nameEn: '', staffId: '', specialization: 'general', phone: '', email: '' });
      }
      setIsInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setAuthProfile(prev => ({ ...prev, email: authPhone }));
  }, [authPhone]);

  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string | null>(null);
  const [isAddTestModalOpen, setIsAddTestModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNurseName, setShowNurseName] = useState(false);

  const handleNurseClick = () => {
    if (window.innerWidth < 1024) {
      setShowNurseName(!showNurseName);
    }
    setActiveTab('profile');
    setSelectedPatientId(null);
    setSelectedIndicatorId(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setAuthState('login_phone');
    setAuthProfile({ 
      nameAr: '', 
      nameEn: '', 
      staffId: '', 
      specialization: 'general',
      phone: '',
      email: ''
    });
    setAuthPhone('');
    setAuthCode(['', '', '', '', '', '']);
    setActiveTab('patients');
  };
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const [patients, setPatients] = useState<any[]>([]);
  const [monthlyGoals, setMonthlyGoals] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('patients');
  const [authCodeInputs] = useState(useRef<HTMLInputElement[]>([]));
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [newTargetValue, setNewTargetValue] = useState('');
  
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const [patientForm, setPatientForm] = useState({ name: '', civilId: '', age: '', phone: '', birthDate: '', lastVisit: '', gender: 'male' });
  const [testForm, setTestForm] = useState({ name: '', result: '', date: '', status: 'normal', notes: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (authState !== 'authenticated') return;
    
    const unsubPatients = subscribeToPatients((data) => {
      setPatients(data.length > 0 ? data : initialPatients);
    });
    
    const unsubGoals = subscribeToGoals((data) => {
      if (data.length > 0) {
        const mapped = data.map((g: any) => {
          const initial = initialGoalsData.find(i => i.id === g.id);
          return {
            ...g,
            name: initial ? initial.name : g.name,
            icon: initial ? initial.icon : null,
            colorGroup: initial ? initial.colorGroup : g.colorGroup
          };
        });
        const orderIds = initialGoalsData.map(ig => ig.id);
        const sorted = mapped.sort((a: any, b: any) => orderIds.indexOf(a.id) - orderIds.indexOf(b.id));
        setMonthlyGoals(sorted);
      } else {
        setMonthlyGoals(initialGoalsData);
      }
    });

    return () => {
      unsubPatients();
      unsubGoals();
    };
  }, [authState]);

  const handleExport = (format: 'xlsx' | 'csv' = 'xlsx') => {
    const data = patients.map((p: any) => ({
      'Civil ID': p.idNumber || '',
      'Name (AR)': p.ar?.name || '',
      'Name (EN)': p.en?.name || '',
      'Age': p.ar?.age || '',
      'BP Checks': p.indicators?.bp?.count || 0,
      'Sugar Checks': p.indicators?.sugar?.count || 0,
      'Status': p.ar?.statusText || ''
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Patients");
    
    if (format === 'csv') {
      XLSX.writeFile(wb, `Patients_Export_${new Date().toISOString().split('T')[0]}.csv`);
    } else {
      XLSX.writeFile(wb, `Patients_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    }
    
    setIsExportMenuOpen(false);
    showToast(isAr ? 'تم تصدير البيانات بنجاح' : 'Data exported successfully');
  };

  const handleEditGoal = (goal: any) => {
    setEditingGoal({ id: goal.id, name: goal.name, target: goal.target, colorGroup: goal.colorGroup });
    setNewTargetValue(goal.target.toString());
    setIsGoalModalOpen(true);
  };

  const saveGoalUpdate = async () => {
    if (!editingGoal) return;
    const val = parseInt(newTargetValue);
    if (isNaN(val) || val <= 0) {
      showToast(lang === 'ar' ? 'يرجى إدخال رقم صحيح' : 'Please enter a valid number', 'error');
      return;
    }

    const goal = monthlyGoals.find(g => g.id === editingGoal.id);
    if (goal) {
      const diff = val - goal.target;
      await updateGoal(goal.id, {
        ...goal,
        target: val,
        remaining: Math.max(0, goal.remaining + diff)
      });
    }

    showToast(lang === 'ar' ? 'تم تحديث المستهدف بنجاح' : 'Target updated successfully', 'success');
    setIsGoalModalOpen(false);
    setEditingGoal(null);
  };

  const handlePatientSave = async () => {
    const errors: Record<string, string> = {};
    if (!patientForm.name.trim()) errors.name = 'مطلوب';
    if (!patientForm.civilId.trim()) {
      errors.civilId = 'مطلوب';
    } else if (patientForm.civilId.length !== 10) {
      errors.civilId = lang === 'ar' ? 'رقم الهوية يجب أن يتكون من 10 أرقام' : 'Civil ID must be 10 digits';
    }
    
    if (patientForm.phone && patientForm.phone.length !== 10) {
      showToast(lang === 'ar' ? 'رقم الجوال يجب أن يتكون من 10 أرقام' : 'Phone number must be 10 digits', 'error');
      return;
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast(lang === 'ar' ? 'يرجى تصحيح الأخطاء' : 'Please fix the errors', 'error');
      return;
    }
    
    const newPatientData = {
      idNumber: patientForm.civilId,
      gender: patientForm.gender || 'male',
      indicators: {
        bp: { count: 0, lastDateAr: '', lastDateEn: '' },
        sugar: { count: 0, lastDateAr: '', lastDateEn: '' },
        obesity: { count: 0, lastDateAr: '', lastDateEn: '' },
        fat: { count: 0, lastDateAr: '', lastDateEn: '' },
        breastCancer: { count: 0, lastDateAr: '', lastDateEn: '' },
        colon: { count: 0, lastDateAr: '', lastDateEn: '' },
      },
      ar: {
        name: patientForm.name,
        initial: patientForm.name.charAt(0),
        age: patientForm.age ? `${patientForm.age} سنة` : '٣٠ سنة',
        phone: patientForm.phone || '0500000000',
        birthDate: patientForm.birthDate || '١ يناير ١٩٩٠',
        visit: patientForm.lastVisit || 'لم يزر بعد',
        statusText: 'مستقر'
      },
      en: {
        name: patientForm.name,
        initial: patientForm.name.charAt(0),
        age: patientForm.age ? `${patientForm.age} years` : '30 years',
        phone: patientForm.phone || '0500000000',
        birthDate: patientForm.birthDate || '1 Jan 1990',
        visit: patientForm.lastVisit || 'Not visited yet',
        statusText: 'Stable'
      }
    };

    await addPatient(newPatientData);
    showToast(lang === 'ar' ? 'تمت إضافة المريض بنجاح' : 'Patient added successfully', 'success');
    setIsModalOpen(false);
    setPatientForm({ name: '', civilId: '', age: '', phone: '', birthDate: '', lastVisit: '', gender: 'male' });
    setFormErrors({});
  };

  const handleEditPatientSave = async () => {
    const errors: Record<string, string> = {};
    if (!patientForm.name.trim()) errors.name = 'مطلوب';
    if (!patientForm.civilId.trim()) {
      errors.civilId = 'مطلوب';
    } else if (patientForm.civilId.length !== 10) {
      errors.civilId = lang === 'ar' ? 'رقم الهوية يجب أن يتكون من 10 أرقام' : 'Civil ID must be 10 digits';
    }

    if (patientForm.phone && patientForm.phone.length !== 10) {
      showToast(lang === 'ar' ? 'رقم الجوال يجب أن يتكون من 10 أرقام' : 'Phone number must be 10 digits', 'error');
      return;
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast(lang === 'ar' ? 'يرجى تصحيح الأخطاء' : 'Please fix the errors', 'error');
      return;
    }
    
    if (selectedPatientId) {
      const p = patients.find(pat => pat.id === selectedPatientId);
      if (p) {
        await updatePatient(p.id, {
          ...p,
          idNumber: patientForm.civilId,
          gender: patientForm.gender || p.gender,
          ar: { ...p.ar, name: patientForm.name, phone: patientForm.phone, birthDate: patientForm.birthDate || p.ar.birthDate },
          en: { ...p.en, name: patientForm.name, phone: patientForm.phone, birthDate: patientForm.birthDate || p.en.birthDate }
        });
      }
    }

    showToast(lang === 'ar' ? 'تم تحديث بيانات المريض بنجاح' : 'Patient data updated successfully', 'success');
    setIsEditModalOpen(false);
    setPatientForm({ name: '', civilId: '', age: '', phone: '', birthDate: '', lastVisit: '', gender: 'male' });
    setFormErrors({});
  };

  const handleTestSave = async () => {
    const errors: Record<string, string> = {};
    if (!testForm.name.trim()) errors.name = 'مطلوب';
    if (!testForm.result.trim()) errors.result = 'مطلوب';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast(lang === 'ar' ? 'يرجى تعبئة الحقول المطلوبة' : 'Please fill required fields', 'error');
      return;
    }
    
    if (selectedPatientId && selectedIndicatorId) {
      const p = patients.find(pat => pat.id === selectedPatientId);
      if (!p) return;

      const newCount = p.indicators[selectedIndicatorId].count + 1;
      const timestamp = Date.now();
      const updatedPatientData = {
        ...p,
        indicators: {
          ...p.indicators,
          [selectedIndicatorId]: {
            ...p.indicators[selectedIndicatorId],
            count: newCount,
            lastDateAr: testForm.date || 'اليوم',
            lastDateEn: testForm.date || 'Today',
            records: [
              {
                id: timestamp,
                timestamp: timestamp,
                titleAr: `قياس ${testForm.name}`,
                titleEn: `Measurement ${testForm.name}`,
                result: testForm.result,
                dateAr: testForm.date || 'اليوم',
                dateEn: testForm.date || 'Today',
                status: testForm.status,
                statusTextAr: testForm.status === 'critical' ? 'حرج' : 'طبيعي',
                statusTextEn: testForm.status === 'critical' ? 'Critical' : 'Normal',
                notesAr: testForm.notes,
                notesEn: testForm.notes,
                isLatest: true
              },
              ...(p.indicators[selectedIndicatorId].records || []).map((r: any) => ({...r, isLatest: false}))
            ]
          }
        }
      };

      await updatePatient(p.id, updatedPatientData);

      const goal = monthlyGoals.find(g => g.id === selectedIndicatorId || (selectedIndicatorId === 'breastCancer' && g.id === 'cancer'));
      if (goal) {
        await updateGoal(goal.id, {
          ...goal,
          remaining: Math.max(0, goal.remaining - 1)
        });
      }
    }

    showToast(lang === 'ar' ? 'تم حفظ الفحص بنجاح' : 'Test saved successfully', 'success');
    setIsAddTestModalOpen(false);
    setTestForm({ name: '', result: '', date: '', status: 'normal', notes: '' });
    setFormErrors({});
  };

  const selectedPatient = selectedPatientId !== null ? patients.find((p: any) => p.id === selectedPatientId) || null : null;
  const spData = selectedPatient ? (isAr ? selectedPatient.ar : selectedPatient.en) : null;

  const chartGoalsOrder = ['bp', 'sugar', 'obesity', 'fat', 'breastCancer', 'colon'];
  const totalTestsCount = patients.reduce((acc, p) => {
    if (!p.indicators) return acc;
    return acc + Object.values(p.indicators).reduce((sum, ind: any) => sum + (ind.count || 0), 0);
  }, 0);

  const barData = chartGoalsOrder.map(id => {
    const goal = monthlyGoals.find(g => g.id === id || (id === 'breastCancer' && g.id === 'cancer'));
    if (!goal) return null;
    let color = '#ef4444'; // bp
    if (id === 'sugar') color = '#3b82f6';
    if (id === 'obesity') color = '#eab308';
    if (id === 'fat') color = '#a855f7';
    if (id === 'breastCancer') color = '#ec4899';
    if (id === 'colon') color = '#10b981';
    
    return {
      name: t[id] || id,
      value: goal.target - (goal.remaining || 0),
      color: color
    };
  }).filter(Boolean) as any[];

  const lineData = (() => {
    const datesMap: Record<string, any> = {};
    
    patients.forEach(patient => {
      if (!patient.indicators) return;
      Object.entries(patient.indicators).forEach(([indicatorId, data]: [string, any]) => {
        if (data.records && Array.isArray(data.records)) {
          data.records.forEach(record => {
            const date = record.dateEn || record.dateAr || (isAr ? 'اليوم' : 'Today');
            if (!datesMap[date]) {
              datesMap[date] = { 
                name: date, 
                timestamp: record.timestamp || record.id || 0,
                bp: 0, 
                sugar: 0, 
                obesity: 0, 
                fat: 0, 
                breastCancer: 0, 
                colon: 0 
              };
            }
            const key = indicatorId === 'cancer' ? 'breastCancer' : indicatorId;
            if (datesMap[date].hasOwnProperty(key)) {
              datesMap[date][key]++;
            }
            // Keep the earliest timestamp for the date group if multiple exist
            if (record.timestamp && record.timestamp < datesMap[date].timestamp) {
              datesMap[date].timestamp = record.timestamp;
            }
          });
        }
      });
    });

    return Object.values(datesMap).sort((a, b) => a.timestamp - b.timestamp);
  })();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-[#0d7d73] animate-spin mb-4" />
        <h2 className="text-[#0d7d73] text-lg md:text-xl font-bold">جاري تحميل النظام...</h2>
      </div>
    );
  }

  if (authState !== 'authenticated') {
    return (
      <>
        <AuthScreen 
          authState={authState}
          setAuthState={setAuthState}
          authPhone={authPhone}
          setAuthPhone={setAuthPhone}
          authCode={authCode}
          setAuthCode={setAuthCode}
          authCodeInputs={authCodeInputs}
          authProfile={authProfile}
          setAuthProfile={setAuthProfile}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          passwordError={passwordError}
          setPasswordError={setPasswordError}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showToast={showToast}
        />
        <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%", transition: { type: 'spring', damping: 25, stiffness: 300 } }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-[100]"
          >
            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-[16px] shadow-xl ${toast.type === 'success' ? 'bg-[#004e92] text-white' : 'bg-white dark:bg-slate-800 border-2 border-red-500 text-red-600'}`}>
              {toast.type === 'success' ? <CheckCircle2 size={22} className="text-[#00a89d] dark:text-teal-400" /> : <AlertCircle size={22} />}
              <span className="font-bold text-[15px]">{toast.message}</span>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto min-h-screen flex flex-col relative selection:bg-teal-500/20 selection:text-teal-900">
        
        <Header 
          isAr={isAr}
          t={t}
          authProfile={authProfile}
          handleNurseClick={handleNurseClick}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          toggleLanguage={toggleLanguage}
          showNurseName={showNurseName}
        />

        <div className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-100/50 dark:border-slate-800/50 transition-all">
          <NavigationTabs 
            t={t}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedPatientId={selectedPatientId}
            setSelectedPatientId={setSelectedPatientId}
            setSelectedIndicatorId={setSelectedIndicatorId}
          />
        </div>

        <main className="flex-1 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPatientId ? `patient-${selectedPatientId}-${selectedIndicatorId}` : activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              {selectedPatientId !== null && selectedPatient && spData ? (
                selectedIndicatorId ? (
                  <IndicatorDetailsScreen 
                    t={t}
                    isAr={isAr}
                    selectedPatient={selectedPatient}
                    spData={spData}
                    selectedIndicatorId={selectedIndicatorId}
                    setSelectedIndicatorId={setSelectedIndicatorId}
                    setIsAddTestModalOpen={setIsAddTestModalOpen}
                  />
                ) : (
                  <PatientDetailsScreen 
                    t={t}
                    isAr={isAr}
                    selectedPatient={selectedPatient}
                    spData={spData}
                    setSelectedPatientId={setSelectedPatientId}
                    setSelectedIndicatorId={setSelectedIndicatorId}
                    setPatientForm={setPatientForm}
                    setIsEditModalOpen={setIsEditModalOpen}
                  />
                )
              ) : activeTab === 'patients' ? (
                <PatientsScreen 
                  t={t}
                  isAr={isAr}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  genderFilter={genderFilter}
                  setGenderFilter={setGenderFilter}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  initialPatients={patients}
                  setSelectedPatientId={setSelectedPatientId}
                  setIsModalOpen={setIsModalOpen}
                />
              ) : activeTab === 'statistics' ? (
                 <StatisticsScreen 
                   t={t}
                   isAr={isAr}
                   timeFilter={timeFilter}
                   setTimeFilter={setTimeFilter}
                   isExportMenuOpen={isExportMenuOpen}
                   setIsExportMenuOpen={setIsExportMenuOpen}
                   exportMenuRef={exportMenuRef}
                   handleExport={handleExport}
                   monthlyGoals={monthlyGoals}
                   barData={barData}
                   lineData={lineData}
                   goalsColorsMap={goalsColorsMap}
                   handleEditGoal={handleEditGoal}
                   patientCount={patients.length}
                   totalTestsCount={totalTestsCount}
                 />
              ) : (
                 <ProfileScreen 
                   t={t}
                   isAr={isAr}
                   authProfile={authProfile}
                   setAuthProfile={setAuthProfile}
                   handleLogout={handleLogout}
                   showToast={showToast}
                 />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <PatientFormModal 
          t={t}
          isAr={isAr}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          form={patientForm}
          setForm={setPatientForm}
          errors={formErrors}
          handleSave={handlePatientSave}
          title={t.addNewPatientTitle}
          subtitle={t.editPatientSubtitle}
          saveText={t.savePatient}
        />

        <PatientFormModal 
          t={t}
          isAr={isAr}
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          form={patientForm}
          setForm={setPatientForm}
          errors={formErrors}
          handleSave={handleEditPatientSave}
          title={t.editPatientTitle}
          subtitle={t.editPatientSubtitle}
          saveText={t.saveChanges}
        />

        <AddTestModal 
          t={t}
          isAr={isAr}
          isOpen={isAddTestModalOpen}
          setIsOpen={setIsAddTestModalOpen}
          form={testForm}
          setForm={setTestForm}
          errors={formErrors}
          handleSave={handleTestSave}
          selectedIndicatorTitle={selectedIndicatorId ? (initialGoalsData.find(g => selectedIndicatorId === g.id)?.name) : undefined}
        />

        <EditGoalModal 
          t={t}
          isOpen={isGoalModalOpen}
          setIsOpen={setIsGoalModalOpen}
          editingGoal={editingGoal}
          newTargetValue={newTargetValue}
          setNewTargetValue={setNewTargetValue}
          saveGoalUpdate={saveGoalUpdate}
          goalsColorsMap={goalsColorsMap}
        />

        <GlobalFooter />
        
        <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%", transition: { type: 'spring', damping: 25, stiffness: 300 } }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-[100]"
          >
            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-[16px] shadow-xl ${toast.type === 'success' ? 'bg-[#004e92] text-white' : 'bg-white dark:bg-slate-800 border-2 border-red-500 text-red-600'}`}>
              {toast.type === 'success' ? <CheckCircle2 size={22} className="text-[#00a89d] dark:text-teal-400" /> : <AlertCircle size={22} />}
              <span className="font-bold text-[15px]">{toast.message}</span>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
