import React, { useState } from 'react';
import { Stethoscope, User as UserIcon, IdCard, Lock, EyeOff, Eye, ArrowLeft, Mail, Loader2 } from 'lucide-react';
import { GlobalFooter } from './GlobalFooter';
import { auth } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { saveUserProfile, updateUserVerification, getUserProfile } from '../lib/firestoreService';

interface AuthScreenProps {
  authState: 'login_phone' | 'login_code' | 'profile_setup' | 'authenticated';
  setAuthState: (state: 'login_phone' | 'login_code' | 'profile_setup' | 'authenticated') => void;
  authPhone: string;
  setAuthPhone: (phone: string) => void;
  authPassword: string;
  setAuthPassword: (pwd: string) => void;
  passwordError: string;
  setPasswordError: (err: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  authCode: string[];
  setAuthCode: (code: string[]) => void;
  authProfile: any;
  setAuthProfile: (profile: any) => void;
  authCodeInputs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  authState, setAuthState, authPhone, setAuthPhone, authPassword, setAuthPassword, 
  passwordError, setPasswordError, showPassword, setShowPassword, authCode, setAuthCode, 
  authProfile, setAuthProfile, authCodeInputs, showToast
}) => {
  const [loading, setLoading] = useState(false);
  const [isSignupFlow, setIsSignupFlow] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const pwdRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?\/-]).{8,}$/;
    if (!auth.currentUser && !pwdRegex.test(authPassword)) {
      setPasswordError('كلمة المرور يجب أن تحتوي على الأقل على 8 أحرف، حرف كبير، رقم، ورمز');
      return;
    }
    
    setLoading(true);
    setPasswordError('');
    
    // If user is already authenticated but missing a profile, just create the profile
    if (auth.currentUser) {
      try {
        await saveUserProfile(auth.currentUser.uid, {
          ...authProfile,
          isEmailVerified: true
        });
        showToast('تم استكمال إعداد الحساب بنجاح', 'success');
        setAuthState('authenticated');
      } catch (error) {
        showToast('حدث خطأ أثناء حفظ البيانات', 'error');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const methods = await fetchSignInMethodsForEmail(auth, authPhone);
      if (methods.length > 0) {
        showToast('هذا الإيميل مسجل مسبقاً، يرجى تسجيل الدخول', 'error');
        setLoading(false);
        return;
      }
    } catch (error: any) {
      console.warn("Could not check email existence:", error);
    }

    try {
      setIsSignupFlow(true);
      
      try {
        const res = await fetch('/api/sendOTP', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: authPhone })
        });
        const data = await res.json();
        if (!res.ok) {
           console.error("Failed to send verification email:", data);
           let errorMsg = typeof (data.message || data.error?.message || data.error) === 'string' 
             ? (data.message || data.error?.message || data.error) 
             : 'خطأ غير معروف';
           if (errorMsg.includes('operationType') || errorMsg.includes('databases/') || errorMsg.includes('Firestore')) {
              errorMsg = 'حدث خطأ فني أثناء الإرسال';
           }
           setPasswordError('يتعذر إرسال الإيميل: ' + errorMsg);
           setLoading(false);
           return;
        } else {
           console.log("Email sent successfully:", data);
           if (data.message && data.message.includes('وهمياً')) {
             showToast('حالة التطوير: رمز التحقق سيظهر في سطر الأوامر (Terminal)', 'success');
           }
        }
      } catch (err) {
        console.error('Email send err', err);
        setPasswordError('حدث خطأ أثناء إرسال الرمز');
        showToast('حدث خطأ أثناء إرسال الرمز', 'error');
        setLoading(false);
        return;
      }

      showToast('تم إرسال رمز التحقق، تفقد بريدك الإلكتروني', 'success');
      setAuthState('login_code');
    } catch (error: any) {
      console.error('Sign up error:', error);
      setPasswordError('حدث خطأ أثناء إرسال الرمز، يرجى المحاولة لاحقاً');
      showToast('حدث خطأ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = authCode.join('');
    if (enteredCode.length < 6) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/verifyOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authPhone || auth.currentUser?.email, code: enteredCode })
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        let verifyErr = typeof data.error === 'string' ? data.error : 'رمز التحقق غير صحيح';
        if (verifyErr.includes('operationType') || verifyErr.includes('databases/') || verifyErr.includes('Firestore')) {
          verifyErr = 'حدث خطأ فني أثناء التحقق';
        }
        showToast(verifyErr, 'error');
        setLoading(false);
        return;
      }

      // If we are in the signup flow
      if (isSignupFlow) {
        // Now create the actual Firebase user account
        const userCredential = await createUserWithEmailAndPassword(auth, authPhone, authPassword);
        const newProfile = {
          ...authProfile,
          verificationCode: enteredCode,
          isEmailVerified: true
        };
        await saveUserProfile(userCredential.user.uid, newProfile);
        showToast('تم إنشاء الحساب والتحقق بنجاح', 'success');
        setAuthState('authenticated');
      } 
      // Fallback for an existing unverified user (if they somehow exist)
      else if (auth.currentUser) {
        await updateUserVerification(auth.currentUser.uid, true);
        showToast('تم التحقق بنجاح', 'success');
        setAuthState('authenticated');
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        showToast('هذا الايميل مستخدم بالفعل، يرجى تسجيل الدخول', 'error');
        setPasswordError('هذا الايميل مستخدم بالفعل');
        setAuthState('login_phone');
      } else {
        console.error('Verification error:', error);
        showToast('حدث خطأ أثناء إنشاء الحساب', 'error');
      }
      setIsSignupFlow(false);
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setLoading(true);
    try {
      try {
        const res = await fetch('/api/sendOTP', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: authPhone || auth?.currentUser?.email })
        });
        const data = await res.json();
        if (!res.ok) {
           console.error("Failed to send verification email:", data);
           let errorMsg = typeof (data.message || data.error?.message || data.error) === 'string' 
             ? (data.message || data.error?.message || data.error) 
             : 'خطأ غير معروف';
           if (errorMsg.includes('operationType') || errorMsg.includes('databases/') || errorMsg.includes('Firestore')) {
              errorMsg = 'حدث خطأ فني أثناء الإرسال';
           }
           setPasswordError('يتعذر إرسال الإيميل: ' + errorMsg);
           showToast('تعذر إرسال الرمز', 'error');
           setLoading(false);
           return;
        } else {
           if (data.message && data.message.includes('وهمياً')) {
             showToast('حالة التطوير: رمز التحقق سيظهر في سطر الأوامر (Terminal)', 'success');
           }
        }
      } catch (err) {
        console.error('Email send err', err);
        showToast('تعذر إرسال الرمز', 'error');
        setLoading(false);
        return;
      }

      showToast('تم إرسال رمز جديد إلى بريدك', 'success');
    } catch (error) {
      showToast('تعذر إرسال الرمز', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError('');
    try {
      await signInWithEmailAndPassword(auth, authPhone, authPassword);
      showToast('تم تسجيل الدخول بنجاح', 'success');
    } catch (error: any) {
      const errorCode = error.code || '';
      let msg = 'حدث خطأ فني أثناء تسجيل الدخول، يرجى المحاولة لاحقاً';
      
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode.includes('invalid-credential') || errorCode === 'auth/invalid-login-credentials') {
        msg = 'البريد الإلكتروني غير مسجل أو كلمة المرور خاطئة.';
      } else if (errorCode === 'auth/invalid-email') {
        msg = 'صيغة البريد الإلكتروني غير صحيحة.';
      } else if (errorCode === 'auth/too-many-requests') {
        msg = 'تم حظر الدخول مؤقتاً لمحاولات كثيرة خاطئة، حاول لاحقاً.';
      } else if (errorCode === 'auth/network-request-failed') {
        msg = 'يوجد مشكلة في الاتصال بالإنترنت.';
      } else {
        console.error('Technical Login error:', error);
        let errorMsg = typeof error.message === 'string' ? error.message : '';
        if (errorMsg.includes('operationType') || errorMsg.includes('databases/') || errorMsg.includes('Firestore')) {
          msg = 'حدث خطأ فني أثناء تسجيل الدخول، يرجى المحاولة لاحقاً';
        } else {
          msg = errorMsg ? `خطأ: ${errorMsg}` : msg;
        }
      }
      
      setPasswordError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!authPhone) {
      setPasswordError('يرجى إدخال الايميل أولاً');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, authPhone);
      showToast('تم إرسال رابط استعادة كلمة المرور إلى بريدك', 'success');
    } catch (error: any) {
      showToast('حدث خطأ أثناء إرسال الرابط', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-[#eff3f3] to-[#e4eeee] font-sans text-slate-800 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#0d7d73]/5 blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#62b9a7]/5 blur-[80px]" />
      </div>
      
      <div className="w-full max-w-[440px] bg-white/90 backdrop-blur-xl rounded-[36px] overflow-hidden shadow-[0_20px_60px_rgba(13,125,115,0.08)] border border-white/50 flex flex-col relative z-10 transition-all duration-500 hover:shadow-[0_25px_65px_rgba(13,125,115,0.12)]">
        {/* Top Header Section */}
        <div className="w-full bg-[#0d7d73] pt-14 pb-[3.5rem] px-6 flex flex-col items-center justify-center relative">
          <div className="w-[88px] h-[88px] bg-[#62b9a7]/20 rounded-[28px] flex items-center justify-center mb-5 border border-white/10">
            <Stethoscope className="text-white w-10 h-10" strokeWidth={1.8} />
          </div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-white mb-1 tracking-wide">
            نظام متابعة المرضى
          </h1>
          <h2 className="text-[#a4d4ce] text-[16px] md:text-[18px] mt-1 font-medium tracking-wide">
            {authState === 'profile_setup' ? 'لوحة الممرضة — إنشاء حساب' : authState === 'login_code' ? 'لوحة الممرضة — التحقق من البريد' : 'لوحة الممرضة — تسجيل الدخول'}
          </h2>
        </div>

        {/* Content Section */}
        <div className="w-full px-6 md:px-8 pt-10 pb-10 flex flex-col items-center">
          <p className="text-center text-gray-500 text-[17px] mb-8 font-medium">
            {authState === 'profile_setup' ? 'أدخل بياناتك لإنشاء حساب جديد' : authState === 'login_code' ? 'أدخل الرمز المرسل إلى بريدك الإلكتروني' : 'أدخل بياناتك للوصول إلى لوحة التحكم'}
          </p>

          {authState === 'profile_setup' ? (
            <form className="flex flex-col gap-5 w-full" onSubmit={handleSignUp}>
              {/* Full Name */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-[15px] font-bold text-gray-800 px-1">الاسم الكامل باللغة العربية</label>
                <div className="relative flex items-center">
                  <UserIcon className="absolute right-4 text-[#0d7d73] w-5 h-5" strokeWidth={2} />
                  <input 
                    type="text" 
                    value={authProfile.nameAr} 
                    onChange={(e) => setAuthProfile({...authProfile, nameAr: e.target.value})}
                    placeholder="أدخل الاسم الكامل باللغة العربية"
                    className="w-full h-[56px] bg-transparent border border-gray-300 rounded-[20px] px-4 pr-[3rem] text-[15px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0d7d73] focus:ring-1 focus:ring-[#0d7d73] transition-all"
                    required
                  />
                </div>
              </div>

              {/* English Name */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-[15px] font-bold text-gray-800 px-1">الاسم الكامل باللغة الإنجليزية</label>
                <div className="relative flex items-center">
                  <UserIcon className="absolute right-4 text-[#0d7d73] w-5 h-5" strokeWidth={2} />
                  <input 
                    type="text" 
                    value={authProfile.nameEn} 
                    onChange={(e) => setAuthProfile({...authProfile, nameEn: e.target.value})}
                    placeholder="Enter Full Name"
                    className="w-full h-[56px] bg-transparent border border-gray-300 rounded-[20px] px-4 pr-[3rem] text-[15px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0d7d73] focus:ring-1 focus:ring-[#0d7d73] transition-all"
                    required
                  />
                </div>
              </div>

              {/* Staff ID */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-[15px] font-bold text-gray-800 px-1">الرقم الوظيفي</label>
                <div className="relative flex items-center">
                  <IdCard className="absolute right-4 text-[#0d7d73] w-5 h-5" strokeWidth={2} />
                  <input 
                    type="text" 
                    value={authProfile.staffId} 
                    onChange={(e) => setAuthProfile({...authProfile, staffId: e.target.value.replace(/[^0-9]/g, '')})}
                    placeholder="أدخل الرقم الوظيفي"
                    className="w-full h-[56px] bg-transparent border border-gray-300 rounded-[20px] px-4 pr-[3rem] text-[15px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0d7d73] focus:ring-1 focus:ring-[#0d7d73] transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className={`flex flex-col gap-2 relative ${auth.currentUser ? 'hidden' : ''}`}>
                <label className="text-[15px] font-bold text-gray-800 px-1">الايميل</label>
                <div className="relative flex items-center">
                  <svg className="absolute right-4 text-[#0d7d73] w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <input 
                    type="email" 
                    value={authPhone} 
                    onChange={(e) => setAuthPhone(e.target.value.trim())}
                    placeholder="أدخل الايميل"
                    className="w-full h-[56px] bg-transparent border border-gray-300 rounded-[20px] px-4 pr-[3rem] text-[15px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0d7d73] focus:ring-1 focus:ring-[#0d7d73] transition-all"
                    required={!auth.currentUser}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className={`flex flex-col gap-2 relative ${auth.currentUser ? 'hidden' : ''}`}>
                <label className="text-[15px] font-bold text-gray-800 px-1">كلمة المرور</label>
                <div className="relative flex items-center">
                  <Lock className="absolute right-4 text-[#0d7d73] w-5 h-5" strokeWidth={2} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={authPassword}
                    onChange={(e) => { setAuthPassword(e.target.value); setPasswordError(''); }}
                    placeholder="أدخل كلمة المرور"
                    className={`w-full h-[56px] bg-transparent border ${passwordError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:border-[#0d7d73] focus:ring-[#0d7d73]'} rounded-[20px] px-4 pr-[3rem] pl-[3rem] text-[15px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all`}
                    required={!auth.currentUser}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={2} /> : <Eye className="w-5 h-5" strokeWidth={2} />}
                  </button>
                </div>
                {/* Password Strength */}
                <div className="mt-2 px-1">
                  <div className="flex gap-1.5 h-1.5 w-full">
                    {[1, 2, 3, 4].map((num) => {
                      let score = 0;
                      if (authPassword.length >= 8) score++;
                      if (/[A-Z]/.test(authPassword)) score++;
                      if (/[0-9]/.test(authPassword)) score++;
                      if (/[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?\/-]/.test(authPassword)) score++;
                      
                      let color = 'bg-gray-200';
                      if (score > 0 && num <= score) {
                        if (score === 1) color = 'bg-red-500';
                        else if (score === 2) color = 'bg-orange-500';
                        else if (score === 3) color = 'bg-yellow-500';
                        else color = 'bg-green-500';
                      }
                      return <div key={num} className={`flex-1 rounded-full transition-colors duration-300 ${color}`} />;
                    })}
                  </div>
                  {authPassword.length > 0 && (
                    <p className="text-[12px] font-medium text-gray-500 mt-1.5">
                      {(() => {
                        let score = 0;
                        if (authPassword.length >= 8) score++;
                        if (/[A-Z]/.test(authPassword)) score++;
                        if (/[0-9]/.test(authPassword)) score++;
                        if (/[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?\/-]/.test(authPassword)) score++;
                        
                        if (score === 1) return 'قوة كلمة المرور: ضعيفة جداً';
                        if (score === 2) return 'قوة كلمة المرور: ضعيفة';
                        if (score === 3) return 'قوة كلمة المرور: متوسطة';
                        if (score === 4) return 'قوة كلمة المرور: قوية';
                        return '';
                      })()}
                    </p>
                  )}
                </div>
                {passwordError && <p className="text-red-500 text-[13px] font-medium mt-1 px-1">{passwordError}</p>}
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="mt-6 w-full h-[64px] bg-[#0d7d73] hover:bg-[#0b635c] active:scale-[0.98] text-white rounded-[22px] font-bold text-[18px] flex items-center justify-center gap-3 transition-all shadow-[0_8px_20px_rgba(13,125,115,0.25)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                  <>
                    <span>إنشاء حساب</span>
                    <ArrowLeft className="w-[22px] h-[22px]" strokeWidth={2.5} />
                  </>
                )}
              </button>

              <div className="text-center mt-2">
                <button type="button" onClick={() => setAuthState('login_phone')} className="text-[#0d7d73] hover:text-[#0b635c] text-[15px] font-semibold underline-offset-4 hover:underline transition-all bg-transparent border-none outline-none">
                  لدي حساب بالفعل؟ تسجيل الدخول
                </button>
              </div>
            </form>
          ) : authState === 'login_code' ? (
            <form className="flex flex-col gap-6 w-full" onSubmit={handleVerifyCode}>
              <div className="flex flex-col gap-2 relative mt-4">
                <div className="flex justify-center gap-2 md:gap-3" dir="ltr">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      ref={(el) => authCodeInputs.current[index] = el}
                      type="text"
                      maxLength={1}
                      value={authCode[index]}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        const newCode = [...authCode];
                        newCode[index] = val;
                        setAuthCode(newCode);
                        if (val && index < 5) {
                          authCodeInputs.current[index + 1]?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !authCode[index] && index > 0) {
                          authCodeInputs.current[index - 1]?.focus();
                        }
                      }}
                      className="w-10 h-12 sm:w-12 sm:h-14 bg-transparent border-2 border-gray-300 rounded-xl text-center text-xl font-bold text-gray-800 focus:outline-none focus:border-[#0d7d73] focus:ring-1 focus:ring-[#0d7d73] transition-all"
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-center w-full mt-2">
                <button type="button" onClick={resendCode} className="text-gray-500 hover:text-[#0d7d73] text-[14px] font-medium transition-colors bg-transparent border-none outline-none">
                  إعادة إرسال الرمز
                </button>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="mt-4 w-full h-[64px] bg-[#0d7d73] hover:bg-[#0b635c] active:scale-[0.98] text-white rounded-[22px] font-bold text-[18px] flex items-center justify-center gap-3 transition-all shadow-[0_8px_20px_rgba(13,125,115,0.25)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                  <>
                    <span>التحقق والدخول</span>
                    <ArrowLeft className="w-[22px] h-[22px]" strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form className="flex flex-col gap-6 w-full" onSubmit={handleLogin}>
              
              {/* Username / Email Field */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-[16px] font-bold text-gray-800 px-1">
                  الايميل
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute right-5 text-[#0d7d73] w-[22px] h-[22px]" strokeWidth={2} />
                  <input 
                    type="email" 
                    value={authPhone} 
                    onChange={(e) => setAuthPhone(e.target.value.trim())}
                    placeholder="أدخل الايميل"
                    className="w-full h-[64px] bg-transparent border border-gray-300 rounded-[22px] px-5 pr-[3.5rem] text-[16px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0d7d73] focus:ring-1 focus:ring-[#0d7d73] transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password / Verification Code Field */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-[16px] font-bold text-gray-800 px-1">
                  كلمة المرور
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute right-5 text-[#0d7d73] w-[22px] h-[22px]" strokeWidth={2} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={authPassword}
                    onChange={(e) => { setAuthPassword(e.target.value); setPasswordError(''); }}
                    placeholder="أدخل كلمة المرور"
                    className={`w-full h-[64px] bg-transparent border ${passwordError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:border-[#0d7d73] focus:ring-[#0d7d73]'} rounded-[22px] px-5 pr-[3.5rem] pl-[3.5rem] text-[16px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all`}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-5 text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none outline-none"
                  >
                    {showPassword ? <EyeOff className="w-[22px] h-[22px]" strokeWidth={2} /> : <Eye className="w-[22px] h-[22px]" strokeWidth={2} />}
                  </button>
                </div>
                {passwordError && <p className="text-red-500 text-[13px] font-medium mt-1 px-1">{passwordError}</p>}
              </div>

              {/* Forgot Password and Sign Up */}
              <div className="flex justify-between items-center w-full mt-[-8px]">
                <button type="button" onClick={handleForgotPassword} className="text-[#0d7d73] hover:text-[#0b635c] text-[15px] font-semibold transition-colors bg-transparent border-none outline-none">
                  نسيت كلمة المرور؟
                </button>
                <button type="button" onClick={() => setAuthState('profile_setup')} className="text-[#0d7d73] hover:text-[#0b635c] text-[15px] font-semibold underline-offset-4 hover:underline transition-all bg-transparent border-none outline-none">إنشاء حساب</button>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="mt-4 w-full h-[64px] bg-[#0d7d73] hover:bg-[#0b635c] active:scale-[0.98] text-white rounded-[22px] font-bold text-[18px] flex items-center justify-center gap-3 transition-all shadow-[0_8px_20px_rgba(13,125,115,0.25)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                  <>
                    <span>تسجيل الدخول</span>
                    <ArrowLeft className="w-[22px] h-[22px]" strokeWidth={2.5} />
                  </>
                )}
              </button>

            </form>
          )}
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
};
