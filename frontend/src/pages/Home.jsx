import logo from "../assets/img/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import heroImg from "../assets/img/hero.jpg";
import divider from "../assets/img/divider.svg";
import { Link } from "react-router-dom";

// Statik mətnlərin çeviri sözlüyü
const translations = {
  az: {
    fresh: "Təzə",
    local: "Yerli",
    seasonal: "Mövsumi",
    everyday: "Hər gün",
    popular: "Populyar",
    qutabs: "Qutablar",
    service: "Servislər",
    coldDrinks: "Soyuq içkilər",
    selectedForYou: "Sizin üçün seçdik",
    avocadoGreens: "Avokado və göyərti"
  },
  en: {
    fresh: "Fresh",
    local: "Local",
    seasonal: "Seasonal",
    everyday: "Every day",
    popular: "Popular",
    qutabs: "Qutabs",
    service: "Services",
    coldDrinks: "Cold drinks",
    selectedForYou: "Selected for you",
    avocadoGreens: "Avocado and greens"
  },
  ru: {
    fresh: "Свежий",
    local: "Местный",
    seasonal: "Сезонный",
    everyday: "Каждый день",
    popular: "Популярное",
    qutabs: "Кутабы",
    service: "Услуги",
    coldDrinks: "Холодные напитки",
    selectedForYou: "Выбрано для вас",
    avocadoGreens: "Авокадо и зелень"
  }
};

export default function Home() {
  const [activeGroup, setActiveGroup] = useState("MENYU");
  const [data, setData] = useState(null);

  // 1. Dili localStorage-dən oxuyuruq (Əgər yoxdursa default 'az' seçilir)
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("appLang") || "az";
  });

  const t = translations[lang];

  // 2. Dil dəyişdikdə həm state, həm də localStorage yenilənir
  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLang(selectedLang);
    localStorage.setItem("appLang", selectedLang);
  };

  useEffect(() => {
    // Express backend'e istek atıyoruz
    fetch("https://jaguar-qr-menu-api.vercel.app/api/data")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ağ yanıtı başarısız");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Veri çekme hatası:", error);
      });
  }, []);

  return (
    <>
      <div className="container flex flex-row justify-between mx-auto py-4 max-w-[550px] px-2 lg:px-0 md:max-w-[720px] lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl lg:justify-between items-center text-[#3a513e]">
        <div className="flex flex-row items-center gap-3">
          {/* logo */}
          <img
            src={logo}
            className="max-h-10 sm:max-h-12 md:max-h-16 lg:max-h-20 shrink"
            alt="Jaguar Lounge Logo"
          />
          <div className="flex flex-col justify-evenly">
            <span className="text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] font-extrabold">
              JAGUAR LOUNGE
            </span>
            <div className="flex text-[12px] md:text-[16px] items-center tracking-tight lg:text-[20px] gap-1">
              <span>{t.fresh}</span>
              <span className="w-1 h-1 rounded-full bg-[#3a513e]" />
              <span>{t.local}</span>
              <span className="w-1 h-1 rounded-full bg-[#3a513e]" />
              <span>{t.seasonal}</span>
            </div>
          </div>
        </div>

        {/* Dil Seçimi Menyusu */}
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

      {/* Banner / Saat Bölümü */}
      <div className="container flex flex-row justify-between mx-auto py-2 max-w-137.5 px-2 lg:px-0 md:max-w-180 lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl items-center text-[#3a513e]">
        <div
          style={{ backgroundImage: `url(${heroImg})` }}
          className="w-full aspect-video rounded-[25px] bg-cover bg-center relative overflow-hidden p-6 lg:p-8 flex items-end"
        >
          <div className="bg-white/80 xl:text-[34px] backdrop-blur-md gap-2 px-3 py-2 items-center justify-between rounded-xl text-[#3a513e] flex flex-row">
            <i className="fa-regular fa-clock text-[24px] xl:text-[45px]" />
            <span className="flex flex-col gap-0">
              <span className="font-light">{t.everyday}</span>
              <span className="font-medium">09:00—23:00</span>
            </span>
          </div>
        </div>
      </div>

      {/* Kateqoriya Düymələri */}
      <div className="container mx-auto px-2 lg:px-0 max-w-137.5 md:max-w-180 lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
        <div className="flex items-center justify-between md:justify-start overflow-x-auto gap-1 whitespace-nowrap no-scrollbar py-2">
          {/* Populyar / MENYU Düyməsi */}
          <button
            onClick={() => setActiveGroup("MENYU")}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm shrink-0 transition-all ${
              activeGroup === "MENYU"
                ? "bg-[#3a513e] text-white shadow-sm"
                : "bg-[#f9f3e7] text-[#3a513e] border border-[#cac2a7]/40 hover:bg-[#f5ebd7]"
            }`}
          >
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
              className="lucide lucide-star-icon lucide-star"
            >
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
            </svg>
            <span>{t.popular}</span>
          </button>

          {/* Qutablar Düyməsi */}
          <button
            onClick={() => setActiveGroup("QUTABLAR")}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm shrink-0 transition-all ${
              activeGroup === "QUTABLAR"
                ? "bg-[#3a513e] text-white shadow-sm"
                : "bg-[#f9f3e7] text-[#3a513e] border border-[#cac2a7]/40 hover:bg-[#f5ebd7]"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-paper-bag-icon lucide-paper-bag"
            >
              <path d="M5.364 3.848C4 6 3 9.652 3 12.652V19a2 2 0 002 2h14a2 2 0 002-2v-5c0-2.334-1.816-4.668-2.622-7.002" />
              <path d="M7 3h11.379a2 2 0 011.789 1.106l.723 1.447A1 1 0 0119.997 7h-8.525a2 2 0 01-1.789-1.106L8.79 4.105a2 2 0 10-3.579 1.789l2.261 4.522A5 5 0 018 12.652V21" />
            </svg>
            <span>{t.qutabs}</span>
          </button>

          {/* Soyuq İçkilər Düyməsi */}
          <button
            onClick={() => setActiveGroup("SOYUQ İÇKİLƏR")}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm shrink-0 transition-all ${
              activeGroup === "SOYUQ İÇKİLƏR"
                ? "bg-[#3a513e] text-white shadow-sm"
                : "bg-[#f9f3e7] text-[#3a513e] border border-[#cac2a7]/40 hover:bg-[#f5ebd7]"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-cup-soda-icon lucide-cup-soda"
            >
              <path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8" />
              <path d="M5 8h14" />
              <path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0" />
              <path d="m12 8 1-6h2" />
            </svg>
            <span>{t.coldDrinks}</span>
          </button>

                    <button
            onClick={() => setActiveGroup("Услуги")}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm shrink-0 transition-all ${
              activeGroup === "Услуги"
                ? "bg-[#3a513e] text-white shadow-sm"
                : "bg-[#f9f3e7] text-[#3a513e] border border-[#cac2a7]/40 hover:bg-[#f5ebd7]"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            <span>{t.service}</span>
          </button>
        </div>
      </div>

      {/* Başlıq Bölməsi */}
      <div className="container mx-auto px-2 lg:px-0 max-w-137.5 md:max-w-180 lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl text-[#3a513e]">
        <div className="flex flex-row items-center justify-between md:justify-start gap-1">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif whitespace-nowrap">
            {t.selectedForYou}
          </h2>
          <div className="h-5 md:h-full lg:h-11.25 md:flex-1 overflow-hidden">
            <img
              src={divider}
              className="w-full h-full object-right object-cover mask-[linear-gradient(to_right,transparent_0%,black_100%)] "
              alt="divider"
            />
          </div>
        </div>
      </div>

      {/* Məhsullar Siyahısı */}
{/* Məhsullar Siyahısı */}
<div className="container mx-auto py-4 px-2 lg:px-0 max-w-137.5 md:max-w-180 lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl text-[#3a513e]">
  <div className="grid gap-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-stretch">
    {data
      ?.filter((product) => product.mGroup === activeGroup)
      ?.map((product, index) => (
        <Link key={product.mID} to={`./mehsul/${product.mID}`} className="h-full flex flex-col">
          <div className="bg-white rounded-[25px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col border border-gray-100 h-full">
            
            {/* Şəkil */}
            <div className="w-full aspect-4/3 overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                alt={product.mName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Məhsul Məlumatları */}
            <div className="px-4 py-3 flex flex-col justify-between flex-1">
              <div>
                {/* line-clamp-2: Başlığı maks 2 sətir edir, nizamsız uzanmağı önləyir */}
                <h3 className="text-sm sm:text-base font-semibold text-[#3a513e] leading-tight line-clamp-2">
                  {product.mName}
                </h3>
                <p className="text-black/60 text-xs sm:text-sm line-clamp-1 mt-1">
                  {product.mSubName}
                </p>
              </div>

              {/* mt-auto: Qiyməti həmişə kartın alt hissəsinə yapışdırır */}
              <div className="text-[18px] sm:text-[20px] md:text-[22px] font-medium text-[#3a513e] mt-auto pt-2">
                {product.mPrice} <span>₼</span>
              </div>
            </div>

          </div>
        </Link>
      ))}
  </div>
</div>
    </>
  );
}