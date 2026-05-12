import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

export const GlobalFooter = () => {
  return (
    <footer className="mt-auto bg-transparent py-8 sm:py-10 px-4 sm:px-6">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center gap-3 sm:gap-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[15px] sm:text-[18px] font-bold text-[#4B5E6B] dark:text-slate-300">
          <span>تم التطوير بكل</span>
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF1F53] fill-current" strokeWidth={0} />
          <span>بواسطة</span>
          <span className="text-[#0D7D73] font-extrabold">Hadi Hakami</span>
        </div>
        <a 
          href="https://wa.me/966502698272" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-[13px] sm:text-[15px] font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>للتواصل عبر الواتساب</span>
        </a>
        <p className="text-[#8B9AA2] dark:text-slate-500 text-[13px] sm:text-[15px] font-medium leading-relaxed">
          © 2026 جميع الحقوق محفوظة للنظام الموحد
        </p>
      </div>
    </footer>
  );
};

