import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import foodVideoExample from "../assets/video/hero_3.mp4";
import jaguarLogo from "../assets/img/jaguar_logo.svg";


const translateText = async (text, targetLang) => {
  
  if (!text) return "";
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await response.json();
    // Google Translate cavab strukturundan tərcümə edilmiş mətni birləşdiririk
    return data[0].map((item) => item[0]).join("");
  } catch (error) {
    console.error("Tərcümə xətası:", error);
    return text; // Xəta olarsa orijinal mətni qaytarır
  }
};



// Hardcoded mətnlər üçün tərcümə obyekti
const translations = {
  az: {
    watchVideo: "Videoya bax",
    ingredients: "Tərkibi",
    allergens: "Allergenlər",
    romaineLettuce: "Romana kahısı",
    parmesan: "Parmesan pendiri",
    croutons: "Ev üsulu krutonlar",
    caesarSauce: "Cypriani sousu",
    chickenShrimp: "Toyuq/Krevetka",
    dairy: "Süd məhsulları",
    gluten: "Qlüten",
    egg: "Yumurta",
    kcal: "320 kkal",
    prepTime: "15 dəq",
    weight: "350 q",
    waiterInfo: "Məhsul haqqında sualınız varsa, ofisianta müraciət edin."
  },
  en: {
    watchVideo: "Watch video",
    ingredients: "Ingredients",
    allergens: "Allergens",
    romaineLettuce: "Romaine lettuce",
    parmesan: "Parmesan cheese",
    croutons: "Homemade croutons",
    caesarSauce: "Cypriani sauce",
    chickenShrimp: "Chicken/Shrimp",
    dairy: "Dairy products",
    gluten: "Gluten",
    egg: "Egg",
    kcal: "320 kcal",
    prepTime: "15 min",
    weight: "350 g",
    waiterInfo: "If you have questions about the item, please ask the waiter."
  },
  ru: {
    watchVideo: "Смотреть видео",
    ingredients: "Ингредиенты",
    allergens: "Аллергены",
    romaineLettuce: "Салат Романо",
    parmesan: "Сыр Пармезан",
    croutons: "Домашние сухарики",
    caesarSauce: "Соус Чиприани",
    chickenShrimp: "Курица/Креветки",
    dairy: "Молочные продукты",
    gluten: "Глютен",
    egg: "Яйцо",
    kcal: "320 ккал",
    prepTime: "15 мин",
    weight: "350 г",
    waiterInfo: "Если у вас есть вопросы о блюде, обратитесь к официанту."
  }
};

const Detail = () => {



  // 1. Home-da seçilən dili yaddaşdan oxuyur
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("appLang") || "az";
  });

  const t = translations[lang];


  
  // 2. Əgər istifadəçi Detail səhifəsində də dili dəyişərsə yaddaş yenilənir
  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLang(selectedLang);
    localStorage.setItem("appLang", selectedLang);
  };

  const { id } = useParams();
  const [data, setData] = useState(null);




  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/data')
      .then((response) => {
        if (!response.ok) throw new Error('Ağ yanıtı başarısız');
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error('Veri çekme hatası:', error);
      });
  }, []);
  

  const product = data?.find((item) => String(item.mID) === String(id));

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

const [translatedDesc, setTranslatedDesc] = useState(""); // Tərcümə olunmuş açıqlama
const [isTranslating, setIsTranslating] = useState(false);
    const rawDescription = product?.mDescription || "Cypriani Sezar Salatı – Təzə romana kahısı, parmesan pendiri, ev üsulu krutonlar və xüsusi Cypriani sousu ilə hazırlanan klassik Sezar salatının ən zərif təqdimatı.";

useEffect(() => {
    if (!rawDescription) return;

    // Azərbaycan dili seçiləndə orijinal mətni göstər
    if (lang === 'az') {
      setTranslatedDesc(rawDescription);
      return;
    }

    setIsTranslating(true);
    translateText(rawDescription, lang)
      .then((res) => setTranslatedDesc(res))
      .finally(() => setIsTranslating(false));
  }, [lang, rawDescription]);
  

  const toggleFullscreen = async (e) => {
    e.stopPropagation();
    if (!wrapperRef.current) return;

    try {
      if (!document.fullscreenElement) {
        if (wrapperRef.current.requestFullscreen) {
          await wrapperRef.current.requestFullscreen();
        } else if (wrapperRef.current.webkitRequestFullscreen) {
          await wrapperRef.current.webkitRequestFullscreen();
        }
        if (window.screen.orientation && window.screen.orientation.lock) {
          window.screen.orientation.lock('landscape').catch(() => {});
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        if (window.screen.orientation && window.screen.orientation.unlock) {
          window.screen.orientation.unlock();
        }
      }
    } catch (err) {
      console.log('Tam ekran xətası:', err);
    }
  };

  return (
    <>
      {/* Navbar */}
      <div className="container flex flex-row justify-between mx-auto py-4 max-w-[550px] px-2 lg:px-0 md:max-w-[720px] lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl items-center text-[#3a513e]">
        <Link to={'/'}>
          <button className="w-10 h-10 bg-[#f9f3e7] text-[#3a513e] border border-[#cac2a7]/40 rounded-full flex items-center justify-center hover:bg-[#f2e7d3] transition-colors duration-200 focus:outline-none cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>
        </Link>
        <span className="text-[20px] md:text-[24px] lg:text-[28px] font-extrabold whitespace-nowrap">
          JAGUAR LOUNGE
        </span>

        {/* Language Choice */}
        <div className="relative inline-flex items-center">
          <div className="pointer-events-none absolute left-3 z-10 flex items-center justify-center text-[#3a513e]">
            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={10} /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
          </div>
          
          <select 
            value={lang}
            onChange={handleLanguageChange}
            className="appearance-none bg-[#f9f3e7] text-[#3a513e] font-medium text-sm pl-9 pr-8 py-2 rounded-full border border-[#cac2a7]/40 focus:outline-none cursor-pointer relative z-0"
          >
            <option value="az">AZ</option>
            <option value="en">EN</option>
            <option value="ru">RU</option>
          </select>

          <div className="pointer-events-none absolute right-3 z-10 flex items-center justify-center text-[#3a513e]">
            <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="container flex flex-row justify-between mx-auto pb-2 max-w-[550px] px-2 lg:px-0 md:max-w-[720px] lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl items-center text-[#3a513e]">
        <div
          ref={wrapperRef}
          onClick={togglePlay}
          className="w-full aspect-video rounded-[25px] relative overflow-hidden flex items-center justify-center group cursor-pointer"
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            loop
            muted
            preload="auto"
          >
            <source src={`${foodVideoExample}#t=0.001`} type="video/mp4" />
          </video>

          {!isPlaying && (
            <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center gap-2 transition-all duration-300">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white/80 backdrop-blur-md text-[#3a513e] rounded-full flex items-center justify-center shadow-lg">
                <i className="fa-solid fa-play text-xl md:text-2xl ml-1" />
              </div>
              <div className="bg-black/40 backdrop-blur-md text-white text-xs md:text-sm px-4 py-1.5 rounded-full font-light tracking-wide">
                {t.watchVideo}
              </div>
            </div>
          )}

          <button
            onClick={toggleFullscreen}
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
          >
            <i className="fa-solid fa-expand text-sm" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-2 lg:px-0 max-w-[550px] md:max-w-[720px] lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl text-[#3a513e]">
        <div className="flex flex-col justify-between md:justify-start gap-1">
          <h2 className="text-lg md:text-3xl font-semibold font-serif whitespace-nowrap">
            {product?.mName}
          </h2>

          <p className="text-sm">
{isTranslating ? "Tərcümə olunur..." : translatedDesc}
          </p>

          <div className="flex flex-row items-center justify-between">
            <div className="text-[30px] md:text-[28px] lg:text-[34px] my-2 font-semibold text-[#3a513e]">
              {product?.mPrice} <span>₼</span>
            </div>
          </div>

          <h2 className="flex flex-row items-center mt-3 gap-2 text-[30px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-utensils-icon lucide-utensils w-[1em] h-[1em]"
            >
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
            <span className="font-serif text-[24px]">{t.ingredients}</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            <div className="bg-white border border-[#3a513e]/20 rounded-[20px] sm:rounded-[25px] p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#3a513e] shrink-0 [mask-image:url('./img/salad.svg')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-image:url('./img/salad.svg')] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]" />
              <span className="text-[#3a513e] text-sm sm:text-base font-medium truncate">{t.romaineLettuce}</span>
            </div>
            <div className="bg-white border border-[#3a513e]/20 rounded-[20px] sm:rounded-[25px] p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#3a513e] shrink-0 [mask-image:url('./img/cheese.svg')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-image:url('./img/cheese.svg')] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]" />
              <span className="text-[#3a513e] text-sm sm:text-base font-medium truncate">{t.parmesan}</span>
            </div>
            <div className="bg-white border border-[#3a513e]/20 rounded-[20px] sm:rounded-[25px] p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#3a513e] shrink-0 [mask-image:url('./img/bread.svg')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-image:url('./img/bread.svg')] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]" />
              <span className="text-[#3a513e] text-sm sm:text-base font-medium truncate">{t.croutons}</span>
            </div>
            <div className="bg-white border border-[#3a513e]/20 rounded-[20px] sm:rounded-[25px] p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#3a513e] shrink-0 [mask-image:url('./img/sauce.svg')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-image:url('./img/sauce.svg')] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]" />
              <span className="text-[#3a513e] text-sm sm:text-base font-medium truncate">{t.caesarSauce}</span>
            </div>
            <div className="bg-white border border-[#3a513e]/20 rounded-[20px] sm:rounded-[25px] p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#3a513e] shrink-0 [mask-image:url('./img/chicken-leg.svg')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-image:url('./img/chicken-leg.svg')] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]" />
              <span className="text-[#3a513e] text-sm sm:text-base font-medium truncate">{t.chickenShrimp}</span>
            </div>
          </div>

          <h2 className="flex mt-6 flex-row items-center gap-2 text-[30px] text-[#3a513e]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-[1em] h-[1em]"
            >
              <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
              <path d="m8.5 8.5 7 7" />
            </svg>
            <span className="font-serif text-[24px]">{t.allergens}</span>
          </h2>
          <div className="flex flex-row flex-wrap gap-3 sm:gap-4">
            <div className="bg-white border border-[#a26246] rounded-[20px] sm:rounded-[25px] p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#3a513e] shrink-0 [mask-image:url('./img/chicken-leg.svg')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-image:url('./img/chicken-leg.svg')] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]" />
              <span className="text-[#3a513e] text-sm sm:text-base font-medium truncate">{t.dairy}</span>
            </div>
            <div className="bg-white border border-[#a26246] rounded-[20px] sm:rounded-[25px] p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#3a513e] shrink-0 [mask-image:url('./img/chicken-leg.svg')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-image:url('./img/chicken-leg.svg')] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]" />
              <span className="text-[#3a513e] text-sm sm:text-base font-medium truncate">{t.gluten}</span>
            </div>
            <div className="bg-white border border-[#a26246] rounded-[20px] sm:rounded-[25px] p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#3a513e] shrink-0 [mask-image:url('./img/chicken-leg.svg')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-image:url('./img/chicken-leg.svg')] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]" />
              <span className="text-[#3a513e] text-sm sm:text-base font-medium truncate">{t.egg}</span>
            </div>
          </div>

          <div className="flex mt-6 my-2 flex-row border-2 border-[#ece6dd] p-3 sm:p-4 bg-white rounded-[20px] items-center justify-around">
            <span className="flex flex-1 flex-row items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-flame-icon lucide-flame bg-[#f0eee5] rounded-full p-2 w-10 h-10"
              >
                <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />
              </svg>
              <span>{t.kcal}</span>
            </span>

            <div className="hidden sm:block w-[1px] h-6 bg-[#ece6dd] shrink-0" />

            <span className="flex flex-1 flex-row items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-clock-icon lucide-clock bg-[#f0eee5] rounded-full p-2 w-10 h-10"
              >
                <circle cx={12} cy={12} r={10} />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>{t.prepTime}</span>
            </span>

            <div className="hidden sm:block w-[1px] h-6 bg-[#ece6dd] shrink-0" />

            <span className="flex flex-1 flex-row items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-weight-tilde-icon lucide-weight-tilde bg-[#f0eee5] rounded-full p-2 w-10 h-10"
              >
                <path d="M6.5 8a2 2 0 0 0-1.906 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8z" />
                <path d="M7.999 15a2.5 2.5 0 0 1 4 0 2.5 2.5 0 0 0 4 0" />
                <circle cx={12} cy={5} r={3} />
              </svg>
              <span>{t.weight}</span>
            </span>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex mt-6 my-2 justify-between border-2 border-[#ece6dd] flex-row gap-2 items-center bg-[#f0ede3] rounded-[20px] p-3 sm:p-4">
          <div className="flex flex-row items-center gap-2">
            <i className="fa-solid fa-circle-info bg-[#f0ede3] text-[#374427] rounded-full text-[24px] sm:text-[28px] md:text-[30px] lg:text-[36px]" />
            <span className="font-serif text-base">
              {t.waiterInfo}
            </span>
          </div>
          <div
            className="w-32 h-14 bg-[#374427]/40"
            style={{
              WebkitMask: `url(${jaguarLogo}) no-repeat center / contain`,
              mask: `url(${jaguarLogo}) no-repeat center / contain`
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Detail;