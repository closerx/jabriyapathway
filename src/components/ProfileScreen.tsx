import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { UserIcon, Phone, FileText, CheckCircle2, ChevronRight, LogOut, ChevronLeft, Edit3, Save, X, Mail } from 'lucide-react';
import { saveUserProfile } from '../lib/firestoreService';
import { auth } from '../lib/firebase';

interface ProfileScreenProps {
  t: any;
  isAr: boolean;
  authProfile: any;
  setAuthProfile: (profile: any) => void;
  handleLogout: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  t, isAr, authProfile, setAuthProfile, handleLogout, showToast
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...authProfile });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditedProfile({ ...authProfile });
  }, [authProfile]);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      await saveUserProfile(auth.currentUser.uid, editedProfile);
      setAuthProfile(editedProfile);
      setIsEditing(false);
      showToast(isAr ? 'تم تحديث البيانات بنجاح' : 'Profile updated successfully', 'success');
    } catch (error) {
      console.error('Update profile error:', error);
      showToast(isAr ? 'حدث خطأ أثناء التحديث' : 'Error updating profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile({ ...authProfile });
    setIsEditing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-5 md:px-10 py-6 md:py-10 max-w-4xl mx-auto w-full"
    >
      <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 sm:p-10 shadow-sm border border-slate-100 dark:border-slate-700/80 transition-colors">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-10">
          <div className="relative group">
            <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-[32px] bg-gradient-to-br from-[#00a89d] to-[#004e92] shadow-xl shadow-teal-900/20 flex items-center justify-center text-white shrink-0">
              <UserIcon size={50} strokeWidth={2} />
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-700 p-2.5 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-600 text-[#00a89d] hover:scale-110 active:scale-95 transition-all"
              >
                <Edit3 size={18} />
              </button>
            )}
          </div>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-start pt-2">
            <h2 className="text-[28px] sm:text-[32px] font-black text-slate-800 dark:text-slate-100 mb-2">
              {isAr ? authProfile.nameAr : authProfile.nameEn}
            </h2>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 dark:bg-slate-700/50 rounded-full text-slate-600 dark:text-slate-300 font-bold text-[15px]">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              {t.authSpecOptions[authProfile.specialization as keyof typeof t.authSpecOptions] || t.authSpecOptions.general}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {[
            { key: 'staffId', label: t.authStaffId, value: editedProfile.staffId, icon: FileText, disabled: true },
            { key: 'email', label: t.authPhoneLabel, value: editedProfile.email, icon: Mail, disabled: true },
            { key: 'phone', label: t.authPhoneFieldLabel, value: editedProfile.phone, icon: Phone },
            { key: 'nameAr', label: t.authNameAr, value: editedProfile.nameAr, icon: UserIcon },
            { key: 'nameEn', label: t.authNameEn, value: editedProfile.nameEn, icon: UserIcon }
          ].map((item) => (
            <div key={item.key} className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[20px] border border-slate-100 dark:border-slate-700/50 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <item.icon size={18} />
                <span className="text-[14px] font-bold">{item.label}</span>
              </div>
              {isEditing && !item.disabled ? (
                <input
                  type="text"
                  value={item.value || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile, [item.key]: e.target.value })}
                  className="bg-white dark:bg-slate-800 border-2 border-[#00a89d]/20 focus:border-[#00a89d] rounded-xl px-3 py-2 text-[18px] font-black text-slate-800 dark:text-slate-100 outline-none transition-all"
                />
              ) : (
                <span className="text-[18px] font-black text-slate-800 dark:text-slate-100">{item.value || '—'}</span>
              )}
            </div>
          ))}
          
          {isEditing && (
            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[20px] border border-slate-100 dark:border-slate-700/50 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <FileText size={18} />
                <span className="text-[14px] font-bold">{isAr ? 'التخصص' : 'Specialization'}</span>
              </div>
              <select
                value={editedProfile.specialization || 'general'}
                onChange={(e) => setEditedProfile({ ...editedProfile, specialization: e.target.value })}
                className="bg-white dark:bg-slate-800 border-2 border-[#00a89d]/20 focus:border-[#00a89d] rounded-xl px-3 py-2 text-[18px] font-black text-slate-800 dark:text-slate-100 outline-none transition-all"
              >
                {Object.entries(t.authSpecOptions).map(([key, label]) => (
                  <option key={key} value={key}>{label as string}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100 dark:border-slate-700/50">
          {isEditing ? (
            <>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#00a89d] to-[#008f85] text-white py-4 rounded-[20px] font-bold text-[17px] flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-teal-900/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                {t.saveChanges}
              </button>
              <button 
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 py-4 rounded-[20px] font-bold text-[17px] flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-600 active:scale-95 transition-all"
              >
                <X size={20} />
                {t.cancel}
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-gradient-to-r from-[#00a89d] to-[#008f85] text-white py-4 rounded-[20px] font-bold text-[17px] flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-teal-900/20 active:scale-95 transition-all"
              >
                <Edit3 size={20} />
                {isAr ? 'تعديل البيانات' : 'Edit Profile'}
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex-1 bg-white dark:bg-slate-800 text-rose-500 border-2 border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-500/10 py-4 rounded-[20px] font-bold text-[17px] flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                {t.logout}
                {isAr ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
