export type Language = 'ar' | 'en';

export interface Patient {
  id: string | number;
  gender: string;
  ar: { initial: string; name: string; age: string; visit: string; birthDate: string; phone: string };
  en: { initial: string; name: string; age: string; visit: string; birthDate: string; phone: string };
  idNumber: string;
  indicators: any;
}
