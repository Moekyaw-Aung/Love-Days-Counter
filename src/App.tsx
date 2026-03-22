/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { differenceInDays, intervalToDuration, format, startOfDay, addDays, addMonths, addYears, isBefore, isSameDay } from 'date-fns';
import { Heart, Calendar, Settings, Edit2, RotateCcw, Star, CheckCircle2, Clock, PartyPopper, Share2, Moon, Sun, Flower2, Coffee, ImagePlus, User, Gift, Palette, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';

const translations = {
  en: {
    ourStory: "Our Story",
    whenDidJourneyBegin: "When did your journey begin?",
    yourName: "Your Name",
    partnerName: "Partner's Name",
    yourAvatar: "Your Avatar",
    partnerAvatar: "Partner's Avatar",
    anniversaryDate: "Anniversary Date",
    saveChanges: "Save Changes",
    startCounting: "Start Counting",
    cancel: "Cancel",
    daysTogether: "Days Together",
    since: "Since",
    years: "Years",
    months: "Months",
    days: "Days",
    journeyMilestones: "Journey Milestones",
    today: "Today!",
    giftIdeaFor: "Gift Idea for",
    shareTitle: "Our Love Story",
    shareText: "We've been together for {days} days!",
    resetConfirm: "Are you sure you want to reset your counter?",
    theme: "Theme",
    language: "Language",
    themes: {
      classic: "Classic Romance",
      modern: "Modern Love",
      whimsical: "Whimsical"
    },
    photoGallery: "Shared Memories",
    addPhoto: "Add Photo",
    photoLimitReached: "Maximum 10 photos allowed",
    milestones: {
      '1m': '1 Month',
      '100d': '100 Days',
      '6m': '6 Months',
      '1y': '1 Year',
      '500d': '500 Days',
      '2y': '2 Years',
      '1000d': '1000 Days',
      '3y': '3 Years',
      '5y': '5 Years',
      '10y': '10 Years',
    },
    giftIdeas: {
      '1m': 'A sweet handwritten letter or a box of their favorite chocolates.',
      '100d': 'A framed photo of your favorite memory together so far.',
      '6m': 'A fun date night experience, like a cooking class or concert tickets.',
      '1y': 'A personalized photo album or a custom piece of jewelry.',
      '500d': 'A cozy weekend getaway or a customized star map of the night you met.',
      '2y': 'High-quality cotton gifts, like matching robes or personalized bedding.',
      '1000d': 'A beautiful watch or a timeless piece of art for your home.',
      '3y': 'Leather goods, such as a custom wallet, bag, or a bound journal.',
      '5y': 'Wood-based gifts, like a custom engraved cutting board or a wooden keepsake box.',
      '10y': 'Aluminum or tin gifts, or perhaps a major trip to celebrate a decade of love!',
    }
  },
  my: {
    ourStory: "ကျွန်ုပ်တို့၏ ဇာတ်လမ်း",
    whenDidJourneyBegin: "သင်တို့၏ ခရီးလမ်း ဘယ်အချိန်က စတင်ခဲ့သလဲ?",
    yourName: "သင့်နာမည်",
    partnerName: "ချစ်သူ၏ နာမည်",
    yourAvatar: "သင့်ကိုယ်ပွား",
    partnerAvatar: "ချစ်သူ၏ ကိုယ်ပွား",
    anniversaryDate: "နှစ်ပတ်လည်နေ့",
    saveChanges: "ပြောင်းလဲမှုများကို သိမ်းဆည်းရန်",
    startCounting: "စတင်ရေတွက်ရန်",
    cancel: "ပယ်ဖျက်ရန်",
    daysTogether: "အတူရှိခဲ့သော နေ့ရက်များ",
    since: "စတင်ခဲ့သောနေ့",
    years: "နှစ်",
    months: "လ",
    days: "ရက်",
    journeyMilestones: "ခရီးလမ်း မှတ်တိုင်များ",
    today: "ယနေ့!",
    giftIdeaFor: "အတွက် လက်ဆောင် အကြံပြုချက်",
    shareTitle: "ကျွန်ုပ်တို့၏ အချစ်ဇာတ်လမ်း",
    shareText: "ကျွန်ုပ်တို့ အတူရှိခဲ့တာ {days} ရက်ရှိပါပြီ!",
    resetConfirm: "သင်၏ ရေတွက်မှုကို ပြန်လည်စတင်ရန် သေချာပါသလား?",
    theme: "အပြင်အဆင်",
    language: "ဘာသာစကား",
    themes: {
      classic: "ဂန္ထဝင် အချစ်",
      modern: "ခေတ်သစ် အချစ်",
      whimsical: "စိတ်ကူးယဉ်"
    },
    photoGallery: "မျှဝေထားသော အမှတ်တရများ",
    addPhoto: "ဓာတ်ပုံထည့်ရန်",
    photoLimitReached: "အများဆုံး ဓာတ်ပုံ ၁၀ ပုံသာ ခွင့်ပြုသည်",
    milestones: {
      '1m': '၁ လ',
      '100d': 'ရက် ၁၀၀',
      '6m': '၆ လ',
      '1y': '၁ နှစ်',
      '500d': 'ရက် ၅၀၀',
      '2y': '၂ နှစ်',
      '1000d': 'ရက် ၁၀၀၀',
      '3y': '၃ နှစ်',
      '5y': '၅ နှစ်',
      '10y': '၁၀ နှစ်',
    },
    giftIdeas: {
      '1m': 'ချိုမြိန်သော လက်ရေးစာ သို့မဟုတ် သူတို့အကြိုက်ဆုံး ချောကလက်ဘူး။',
      '100d': 'ယခုအချိန်အထိ အတူရှိခဲ့သော အကြိုက်ဆုံး အမှတ်တရ ဓာတ်ပုံဘောင်။',
      '6m': 'ဟင်းချက်သင်တန်း သို့မဟုတ် ဖျော်ဖြေပွဲ လက်မှတ်များကဲ့သို့ ပျော်စရာ ညချိန်းတွေ့ခြင်း။',
      '1y': 'ကိုယ်ပိုင် ဓာတ်ပုံအယ်လ်ဘမ် သို့မဟုတ် စိတ်ကြိုက် လက်ဝတ်ရတနာ။',
      '500d': 'သက်တောင့်သက်သာရှိသော စနေ၊ တနင်္ဂနွေ ခရီးစဉ် သို့မဟုတ် သင်တို့စတွေ့ခဲ့သော ည၏ ကြယ်ပြမြေပုံ။',
      '2y': 'အရည်အသွေးမြင့် ချည်ထည်လက်ဆောင်များ၊ ဥပမာ - ဆင်တူ ဝတ်ရုံများ သို့မဟုတ် စိတ်ကြိုက် အိပ်ရာခင်းများ။',
      '1000d': 'လှပသော နာရီ သို့မဟုတ် အိမ်အတွက် အနုပညာလက်ရာ။',
      '3y': 'သားရေပစ္စည်းများ၊ ဥပမာ - စိတ်ကြိုက် ပိုက်ဆံအိတ်၊ အိတ် သို့မဟုတ် မှတ်စုစာအုပ်။',
      '5y': 'သစ်သားလက်ဆောင်များ၊ ဥပမာ - စိတ်ကြိုက် ထွင်းထုထားသော စဉ်းတီတုံး သို့မဟုတ် သစ်သား အမှတ်တရသေတ္တာ။',
      '10y': 'အလူမီနီယမ် သို့မဟုတ် သံဖြူ လက်ဆောင်များ၊ သို့မဟုတ် ဆယ်စုနှစ်တစ်ခုကြာ အချစ်ကို ကျင်းပရန် ခရီးစဉ်ကြီးတစ်ခု!',
    }
  }
};

type Language = 'en' | 'my';
type Theme = 'classic' | 'modern' | 'whimsical';

const iconMap: Record<string, any> = { Heart, Star, Moon, Sun, Flower2, Coffee, User };

function Icon({ name, className }: { name: string, className?: string }) {
  const IconComponent = iconMap[name] || User;
  return <IconComponent className={className} />;
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [name1, setName1] = useState<string>('');
  const [name2, setName2] = useState<string>('');
  const [avatar1, setAvatar1] = useState<string>('Heart');
  const [avatar2, setAvatar2] = useState<string>('Star');
  const [theme, setTheme] = useState<Theme>('classic');
  const [language, setLanguage] = useState<Language>('en');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedDate = localStorage.getItem('love_startDate');
    const savedName1 = localStorage.getItem('love_name1');
    const savedName2 = localStorage.getItem('love_name2');
    const savedAvatar1 = localStorage.getItem('love_avatar1');
    const savedAvatar2 = localStorage.getItem('love_avatar2');
    const savedTheme = localStorage.getItem('love_theme') as Theme;
    const savedLanguage = localStorage.getItem('love_language') as Language;

    if (savedDate) setStartDate(savedDate);
    if (savedName1) setName1(savedName1);
    if (savedName2) setName2(savedName2);
    if (savedAvatar1) setAvatar1(savedAvatar1);
    if (savedAvatar2) setAvatar2(savedAvatar2);
    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguage(savedLanguage);
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    document.documentElement.className = theme === 'classic' ? '' : `theme-${theme}`;
  }, [theme]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('love_startDate', startDate);
    localStorage.setItem('love_name1', name1);
    localStorage.setItem('love_name2', name2);
    localStorage.setItem('love_avatar1', avatar1);
    localStorage.setItem('love_avatar2', avatar2);
    localStorage.setItem('love_theme', theme);
    localStorage.setItem('love_language', language);
    setIsEditing(false);
  };

  const handleReset = () => {
    if (window.confirm(translations[language].resetConfirm)) {
      localStorage.removeItem('love_startDate');
      localStorage.removeItem('love_name1');
      localStorage.removeItem('love_name2');
      localStorage.removeItem('love_avatar1');
      localStorage.removeItem('love_avatar2');
      localStorage.removeItem('love_theme');
      localStorage.removeItem('love_language');
      setStartDate('');
      setName1('');
      setName2('');
      setAvatar1('Heart');
      setAvatar2('Star');
      setTheme('classic');
      setLanguage('en');
      setIsEditing(true);
    }
  };

  if (!isLoaded) return null;

  const showSetup = !startDate || isEditing;
  const t = translations[language];

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-8 font-sans transition-colors duration-500"
      style={{ 
        backgroundImage: `var(--bg-pattern), linear-gradient(to bottom right, var(--color-primary-50), var(--color-secondary-50), var(--color-primary-100))` 
      }}
    >
      <AnimatePresence mode="wait">
        {showSetup ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-primary-900/5 p-8 border border-white"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-500 mb-4">
                <Heart className="w-8 h-8 fill-current" />
              </div>
              <h1 className="text-3xl font-serif font-semibold text-primary-950">{t.ourStory}</h1>
              <p className="text-primary-600/80 mt-2 text-sm">{t.whenDidJourneyBegin}</p>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-primary-900/70 uppercase tracking-wider">{t.yourName}</label>
                    <input
                      type="text"
                      required
                      value={name1}
                      onChange={(e) => setName1(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-primary-100 focus:border-primary-300 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-primary-950 placeholder-primary-300"
                      placeholder="e.g. Alex"
                    />
                  </div>
                  <AvatarSelector value={avatar1} onChange={setAvatar1} label={t.yourAvatar} />
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-primary-900/70 uppercase tracking-wider">{t.partnerName}</label>
                    <input
                      type="text"
                      required
                      value={name2}
                      onChange={(e) => setName2(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-primary-100 focus:border-primary-300 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-primary-950 placeholder-primary-300"
                      placeholder="e.g. Sam"
                    />
                  </div>
                  <AvatarSelector value={avatar2} onChange={setAvatar2} label={t.partnerAvatar} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-primary-900/70 uppercase tracking-wider">{t.anniversaryDate}</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400 pointer-events-none" />
                  <input
                    type="date"
                    required
                    max={new Date().toISOString().split('T')[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-primary-100 focus:border-primary-300 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-primary-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-primary-900/70 uppercase tracking-wider flex items-center gap-1"><Palette className="w-3 h-3" /> {t.theme}</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as Theme)}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-primary-100 focus:border-primary-300 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-primary-950 appearance-none"
                  >
                    <option value="classic">{t.themes.classic}</option>
                    <option value="modern">{t.themes.modern}</option>
                    <option value="whimsical">{t.themes.whimsical}</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-primary-900/70 uppercase tracking-wider flex items-center gap-1"><Globe className="w-3 h-3" /> {t.language}</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-primary-100 focus:border-primary-300 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-primary-950 appearance-none"
                  >
                    <option value="en">English</option>
                    <option value="my">မြန်မာ</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 mt-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium shadow-lg shadow-primary-500/30 transition-all active:scale-[0.98]"
              >
                {isEditing && startDate ? t.saveChanges : t.startCounting}
              </button>

              {isEditing && startDate && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full py-3 text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-all"
                >
                  {t.cancel}
                </button>
              )}
            </form>
          </motion.div>
        ) : (
          <CounterDisplay 
            startDate={startDate} 
            name1={name1} 
            name2={name2} 
            avatar1={avatar1}
            avatar2={avatar2}
            language={language}
            onEdit={() => setIsEditing(true)} 
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CounterDisplay({ 
  startDate, 
  name1, 
  name2, 
  avatar1,
  avatar2,
  language,
  onEdit,
  onReset
}: { 
  startDate: string; 
  name1: string; 
  name2: string; 
  avatar1: string;
  avatar2: string;
  language: Language;
  onEdit: () => void;
  onReset: () => void;
}) {
  const t = translations[language];
  const [now, setNow] = useState(new Date());
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedPhotos = localStorage.getItem('love_photos');
    if (savedPhotos) {
      try {
        setPhotos(JSON.parse(savedPhotos));
      } catch (e) {}
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 10 - photos.length;
    if (remainingSlots <= 0) {
      alert(t.photoLimitReached);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    
    Promise.all(filesToProcess.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const max = 800;
            if (width > height) {
              if (width > max) {
                height *= max / width;
                width = max;
              }
            } else {
              if (height > max) {
                width *= max / height;
                height = max;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          };
          img.onerror = reject;
          img.src = event.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })).then(newPhotos => {
      const updatedPhotos = [...photos, ...newPhotos];
      setPhotos(updatedPhotos);
      localStorage.setItem('love_photos', JSON.stringify(updatedPhotos));
    }).catch(err => console.error("Error processing photos", err));
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    localStorage.setItem('love_photos', JSON.stringify(updatedPhotos));
  };

  useEffect(() => {
    // Update the current time every minute to keep it fresh if left open
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const start = startOfDay(new Date(startDate));
  const current = startOfDay(now);
  
  const totalDays = Math.max(0, differenceInDays(current, start));
  const duration = intervalToDuration({ start, end: current });

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      setIsSharing(true);
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#fff1f2',
        useCORS: true,
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'our-story.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'Our Love Story',
            text: `We've been together for ${totalDays.toLocaleString()} days!`,
            files: [file]
          });
          return;
        } catch (err) {
          console.log("Share failed or cancelled", err);
        }
      }
      
      // Fallback to download
      const link = document.createElement('a');
      link.download = 'our-story.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to generate image', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const allMilestones = useMemo(() => [
    { id: '1m', label: '1 Month', date: addMonths(start, 1), giftIdea: 'A sweet handwritten letter or a box of their favorite chocolates.' },
    { id: '100d', label: '100 Days', date: addDays(start, 100), giftIdea: 'A framed photo of your favorite memory together so far.' },
    { id: '6m', label: '6 Months', date: addMonths(start, 6), giftIdea: 'A fun date night experience, like a cooking class or concert tickets.' },
    { id: '1y', label: '1 Year', date: addYears(start, 1), giftIdea: 'A personalized photo album or a custom piece of jewelry.' },
    { id: '500d', label: '500 Days', date: addDays(start, 500), giftIdea: 'A cozy weekend getaway or a customized star map of the night you met.' },
    { id: '2y', label: '2 Years', date: addYears(start, 2), giftIdea: 'High-quality cotton gifts, like matching robes or personalized bedding.' },
    { id: '1000d', label: '1000 Days', date: addDays(start, 1000), giftIdea: 'A beautiful watch or a timeless piece of art for your home.' },
    { id: '3y', label: '3 Years', date: addYears(start, 3), giftIdea: 'Leather goods, such as a custom wallet, bag, or a bound journal.' },
    { id: '5y', label: '5 Years', date: addYears(start, 5), giftIdea: 'Wood-based gifts, like a custom engraved cutting board or a wooden keepsake box.' },
    { id: '10y', label: '10 Years', date: addYears(start, 10), giftIdea: 'Aluminum or tin gifts, or perhaps a major trip to celebrate a decade of love!' },
  ].sort((a, b) => a.date.getTime() - b.date.getTime()), [start]);

  const hasTriggeredConfetti = useRef(false);

  useEffect(() => {
    const hasMilestoneToday = allMilestones.some(m => isSameDay(m.date, current));
    if (hasMilestoneToday && !hasTriggeredConfetti.current) {
      hasTriggeredConfetti.current = true;
      
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [current, allMilestones]);

  return (
    <motion.div
      key="counter"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="w-full max-w-2xl"
    >
      <div 
        ref={cardRef}
        className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-primary-900/10 p-8 sm:p-12 border border-white/80 relative overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-200/40 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-200/40 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          {/* Header & Controls */}
          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex flex-col items-center gap-2">
                <AvatarDisplay avatar={avatar1} className="w-12 h-12 sm:w-16 sm:h-16 shadow-sm border-2 border-white" />
                <span className="text-lg sm:text-2xl font-serif font-medium text-primary-950">{name1}</span>
              </div>
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="px-2"
              >
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500 fill-primary-500" />
              </motion.div>
              <div className="flex flex-col items-center gap-2">
                <AvatarDisplay avatar={avatar2} className="w-12 h-12 sm:w-16 sm:h-16 shadow-sm border-2 border-white" />
                <span className="text-lg sm:text-2xl font-serif font-medium text-primary-950">{name2}</span>
              </div>
            </div>
            
            <div className="flex space-x-2" data-html2canvas-ignore>
              <button 
                onClick={handleShare}
                disabled={isSharing}
                className="p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-100/50 rounded-full transition-colors disabled:opacity-50"
                title="Share or Download"
              >
                {isSharing ? <Clock className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
              </button>
              <button 
                onClick={onEdit}
                className="p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-100/50 rounded-full transition-colors"
                title="Edit Details"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button 
                onClick={onReset}
                className="p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-100/50 rounded-full transition-colors"
                title="Reset Counter"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Counter */}
          <div className="text-center mb-16">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block"
            >
              <span className="text-7xl sm:text-9xl font-serif font-semibold text-primary-950 tracking-tight">
                {totalDays.toLocaleString()}
              </span>
              <span className="block text-2xl sm:text-3xl font-serif text-primary-500/80 mt-2 italic">
                Days Together
              </span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-100/50 text-primary-700 text-sm font-medium"
            >
              <Calendar className="w-4 h-4" />
              <span>Since {format(start, 'MMMM do, yyyy')}</span>
            </motion.div>
          </div>

          {/* Breakdown */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-4 sm:gap-6"
          >
            <BreakdownCard value={duration.years || 0} label="Years" />
            <BreakdownCard value={duration.months || 0} label="Months" />
            <BreakdownCard value={duration.days || 0} label="Days" />
          </motion.div>

          {/* Milestones Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 pt-8 border-t border-primary-100/50"
          >
            <h3 className="text-lg font-serif font-medium text-primary-900 mb-6 text-center flex items-center justify-center gap-2">
              <Star className="w-4 h-4 text-primary-400 fill-primary-400/20" />
              Journey Milestones
              <Star className="w-4 h-4 text-primary-400 fill-primary-400/20" />
            </h3>
            
            {/* Horizontal scrollable milestone list */}
            <div className="flex overflow-x-auto pb-6 -mx-8 px-8 sm:-mx-12 sm:px-12 space-x-4 snap-x scrollbar-hide">
              {allMilestones.map((milestone) => {
                const isPast = isBefore(milestone.date, current);
                const isToday = isSameDay(milestone.date, current);
                const isSelected = selectedMilestoneId === milestone.id;
                
                return (
                  <div 
                    key={milestone.id} 
                    onClick={() => setSelectedMilestoneId(isSelected ? null : milestone.id)}
                    className={`flex-none w-36 p-4 rounded-2xl border snap-center transition-all cursor-pointer ${
                      isToday ? 'bg-primary-500 text-white border-primary-500 shadow-xl shadow-primary-500/30 -translate-y-1' :
                      isPast ? 'bg-white/60 border-primary-200 text-primary-900 shadow-sm hover:bg-white/80' :
                      'bg-white/30 border-white/40 text-primary-900/40 hover:bg-white/50'
                    } ${isSelected ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-primary-50' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      {isToday ? <PartyPopper className="w-5 h-5 text-primary-200" /> :
                       isPast ? <CheckCircle2 className="w-5 h-5 text-primary-400" /> :
                       <Clock className="w-5 h-5 text-primary-300/50" />}
                    </div>
                    <div className={`font-serif font-semibold text-lg leading-tight ${isToday ? 'text-white' : isPast ? 'text-primary-900' : 'text-primary-900/50'}`}>
                      {milestone.label}
                    </div>
                    <div className={`text-xs mt-1.5 ${isToday ? 'text-primary-100' : isPast ? 'text-primary-500' : 'text-primary-400/50'}`}>
                      {format(milestone.date, 'MMM d, yyyy')}
                    </div>
                    {isToday && (
                      <div className="mt-3 text-[10px] font-medium uppercase tracking-wider bg-white/20 py-1 px-2 rounded inline-block">
                        Today!
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Gift Idea Section */}
            <AnimatePresence mode="wait">
              {selectedMilestoneId && (
                <motion.div
                  key={selectedMilestoneId}
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="overflow-hidden"
                >
                  <div className="mb-2 p-4 sm:p-5 bg-white/60 backdrop-blur-md rounded-2xl border border-primary-100 shadow-sm flex items-start gap-4">
                    <div className="p-2 bg-primary-100 text-primary-500 rounded-xl shrink-0">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-semibold text-primary-900 mb-1">
                        Gift Idea for {allMilestones.find(m => m.id === selectedMilestoneId)?.label}
                      </h4>
                      <p className="text-sm text-primary-700/80 leading-relaxed">
                        {allMilestones.find(m => m.id === selectedMilestoneId)?.giftIdea}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Photo Gallery Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 pt-8 border-t border-primary-100/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-serif font-medium text-primary-900 flex items-center gap-2">
                <ImagePlus className="w-5 h-5 text-primary-400" />
                {t.photoGallery}
              </h3>
              <span className="text-xs text-primary-500 font-medium bg-primary-50 px-2 py-1 rounded-full">
                {photos.length} / 10
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((photo, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm border border-primary-100/50"
                >
                  <img src={photo} alt={`Memory ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => removePhoto(idx)}
                      className="p-2 bg-white/20 hover:bg-red-500/80 text-white rounded-full backdrop-blur-sm transition-colors"
                      title="Remove photo"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
              
              {photos.length < 10 && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-primary-200 hover:border-primary-400 hover:bg-primary-50/50 flex flex-col items-center justify-center gap-2 text-primary-400 hover:text-primary-600 transition-all"
                >
                  <ImagePlus className="w-6 h-6" />
                  <span className="text-xs font-medium">{t.addPhoto}</span>
                </button>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
              accept="image/*" 
              multiple 
              className="hidden" 
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function BreakdownCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl p-4 sm:p-6 text-center shadow-sm">
      <div className="text-3xl sm:text-4xl font-serif font-semibold text-primary-900 mb-1">
        {value}
      </div>
      <div className="text-xs sm:text-sm font-medium text-primary-600/70 uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
}

function AvatarSelector({ value, onChange, label }: { value: string, onChange: (val: string) => void, label: string }) {
  const predefined = ['Heart', 'Star', 'Moon', 'Sun', 'Flower2', 'Coffee'];
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] sm:text-xs font-medium text-primary-900/70 uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {predefined.map(icon => (
          <button
            key={icon}
            type="button"
            onClick={() => onChange(icon)}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all ${value === icon ? 'bg-primary-100 border-primary-400 text-primary-600 shadow-inner' : 'bg-white/50 border-primary-100 text-primary-400 hover:bg-primary-50'}`}
          >
            <Icon name={icon} className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        ))}
        <label className={`cursor-pointer p-1.5 sm:p-2 rounded-xl border transition-all flex items-center justify-center ${value.startsWith('data:image') ? 'bg-primary-100 border-primary-400 text-primary-600 shadow-inner' : 'bg-white/50 border-primary-100 text-primary-400 hover:bg-primary-50'}`}>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          {value.startsWith('data:image') ? (
            <img src={value} alt="Custom" className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <ImagePlus className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </label>
      </div>
    </div>
  );
}

function AvatarDisplay({ avatar, className }: { avatar: string, className?: string }) {
  if (avatar.startsWith('data:image')) {
    return <img src={avatar} alt="Avatar" className={`object-cover rounded-full ${className}`} referrerPolicy="no-referrer" />;
  }
  return (
    <div className={`flex items-center justify-center rounded-full bg-primary-100 text-primary-500 ${className}`}>
      <Icon name={avatar} className="w-1/2 h-1/2" />
    </div>
  );
}
