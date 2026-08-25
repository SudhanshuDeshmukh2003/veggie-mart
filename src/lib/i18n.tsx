"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "hi" | "mr";

const LANG_KEY = "sabzi_lang";

const dict = {
  en: {
    brand: "Sabzi Bazaar",
    brandSub: "Bazaar",
    vegetables: "Vegetables",
    cart: "Cart",
    myOrders: "My Orders",
    admin: "Admin",
    logout: "Logout",
    signIn: "Sign in",
    signUp: "Sign up",
    heroTitle: "Sabzi Bazaar",
    heroTag: "fresh sabzi, home delivery",
    heroBody:
      "Order vegetables at today's market rates. Pay cash on delivery (COD). Every order goes to the shop on WhatsApp and shows in the admin panel.",
    browseMenu: "Today's sabzi",
    createAccount: "Create account",
    heroSide: "Daily rates · Local delivery",
    todayMenu: "Today's menu",
    todayMenuSub: "Choose 1 kg, ½ kg, 250 g or 125 g. Prices updated daily.",
    addToCart: "Add",
    outOfStock: "Out of stock",
    addedToast: "added to cart",
    cartEmpty: "Your cart is empty",
    cartEmptySub: "Add some vegetables to get started.",
    browseVeg: "Browse vegetables",
    yourCart: "Your cart",
    cartSub: "Select quantity, then checkout. Payment: Cash on Delivery only.",
    total: "Total",
    clearCart: "Clear cart",
    checkout: "Checkout",
    nothingCheckout: "Nothing to checkout",
    addVeg: "Add vegetables",
    checkoutTitle: "Checkout",
    checkoutSub: "Shop will get this order on WhatsApp. Pay cash on delivery.",
    deliveryAddress: "Delivery address",
    addressPh: "House no., street, area, landmark",
    phone: "Phone",
    notes: "Notes (optional)",
    notesPh: "e.g. Deliver before 8 AM",
    payment: "Payment",
    codTitle: "Cash on Delivery (COD)",
    codBody: "Pay in cash when your order arrives.",
    placeOrder: "Place order & WhatsApp alert",
    placing: "Placing order…",
    myOrdersTitle: "My orders",
    orderPlaced:
      "Order placed! WhatsApp opened for the shop. You can also see it under Admin → Orders.",
    noOrders: "No orders yet.",
    pleaseLogin: "Please sign in to view your orders.",
    qty_1kg: "1 kg",
    qty_500g: "½ kg",
    qty_250g: "250 g",
    qty_125g: "125 g",
    language: "Language",
    perKg: "/ kg",
    perUnit: "/",
  },
  hi: {
    brand: "सब्ज़ी बाज़ार",
    brandSub: "बाज़ार",
    vegetables: "सब्ज़ियाँ",
    cart: "कार्ट",
    myOrders: "मेरे ऑर्डर",
    admin: "एडमिन",
    logout: "लॉग आउट",
    signIn: "लॉगिन",
    signUp: "रजिस्टर",
    heroTitle: "सब्ज़ी बाज़ार",
    heroTag: "ताज़ी सब्ज़ी, घर तक डिलीवरी",
    heroBody:
      "आज के बाज़ार भाव पर सब्ज़ी ऑर्डर करें। सिर्फ़ कैश ऑन डिलीवरी (COD)। हर ऑर्डर दुकान के WhatsApp और एडमिन पैनल पर जाता है।",
    browseMenu: "आज की सब्ज़ी",
    createAccount: "अकाउंट बनाएँ",
    heroSide: "रोज़ाना भाव · लोकल डिलीवरी",
    todayMenu: "आज का मेनू",
    todayMenuSub: "1 किलो, आधा किलो, 250 ग्राम या 125 ग्राम चुनें। भाव रोज़ अपडेट।",
    addToCart: "जोड़ें",
    outOfStock: "स्टॉक खत्म",
    addedToast: "कार्ट में जुड़ गया",
    cartEmpty: "कार्ट खाली है",
    cartEmptySub: "पहले कुछ सब्ज़ियाँ जोड़ें।",
    browseVeg: "सब्ज़ियाँ देखें",
    yourCart: "आपका कार्ट",
    cartSub: "मात्रा चुनें, फिर चेकआउट। भुगतान: सिर्फ़ COD।",
    total: "कुल",
    clearCart: "कार्ट साफ़ करें",
    checkout: "चेकआउट",
    nothingCheckout: "चेकआउट के लिए कुछ नहीं",
    addVeg: "सब्ज़ी जोड़ें",
    checkoutTitle: "चेकआउट",
    checkoutSub: "ऑर्डर दुकान के WhatsApp पर जाएगा। डिलीवरी पर नकद भुगतान।",
    deliveryAddress: "डिलीवरी पता",
    addressPh: "मकान नं., गली, इलाका, लैंडमार्क",
    phone: "फ़ोन",
    notes: "नोट (वैकल्पिक)",
    notesPh: "जैसे सुबह 8 बजे से पहले डिलीवर करें",
    payment: "भुगतान",
    codTitle: "कैश ऑन डिलीवरी (COD)",
    codBody: "ऑर्डर आने पर नकद दें।",
    placeOrder: "ऑर्डर करें + WhatsApp",
    placing: "ऑर्डर हो रहा है…",
    myOrdersTitle: "मेरे ऑर्डर",
    orderPlaced:
      "ऑर्डर हो गया! दुकान के WhatsApp पर अलर्ट खुला। एडमिन पैनल में भी दिखेगा।",
    noOrders: "अभी कोई ऑर्डर नहीं।",
    pleaseLogin: "ऑर्डर देखने के लिए लॉगिन करें।",
    qty_1kg: "1 किलो",
    qty_500g: "½ किलो",
    qty_250g: "250 ग्राम",
    qty_125g: "125 ग्राम",
    language: "भाषा",
    perKg: "/ किलो",
    perUnit: "/",
  },
  mr: {
    brand: "सब्जी बाजार",
    brandSub: "बाजार",
    vegetables: "भाज्या",
    cart: "कार्ट",
    myOrders: "माझे ऑर्डर",
    admin: "अॅडमिन",
    logout: "लॉग आउट",
    signIn: "लॉगिन",
    signUp: "नोंदणी",
    heroTitle: "सब्जी बाजार",
    heroTag: "ताजी भाजी, घरी डिलिव्हरी",
    heroBody:
      "आजच्या बाजारभावात भाज्या ऑर्डर करा. फक्त कॅश ऑन डिलिव्हरी (COD). प्रत्येक ऑर्डर दुकानाच्या WhatsApp आणि अॅडमिन पॅनलवर जातो.",
    browseMenu: "आजची भाजी",
    createAccount: "खाते तयार करा",
    heroSide: "दररोज भाव · स्थानिक डिलिव्हरी",
    todayMenu: "आजचे मेनू",
    todayMenuSub: "1 किलो, अर्धा किलो, 250 ग्रॅम किंवा 125 ग्रॅम निवडा. भाव रोज अपडेट.",
    addToCart: "जोडा",
    outOfStock: "स्टॉक संपला",
    addedToast: "कार्टमध्ये जोडले",
    cartEmpty: "कार्ट रिकामी आहे",
    cartEmptySub: "आधी काही भाज्या जोडा.",
    browseVeg: "भाज्या पाहा",
    yourCart: "तुमची कार्ट",
    cartSub: "प्रमाण निवडा, मग चेकआउट. पेमेंट: फक्त COD.",
    total: "एकूण",
    clearCart: "कार्ट साफ करा",
    checkout: "चेकआउट",
    nothingCheckout: "चेकआउटसाठी काही नाही",
    addVeg: "भाजी जोडा",
    checkoutTitle: "चेकआउट",
    checkoutSub: "ऑर्डर दुकानाच्या WhatsApp वर जाईल. डिलिव्हरीवर रोख रक्कम.",
    deliveryAddress: "डिलिव्हरी पत्ता",
    addressPh: "घर क्र., गल्ली, परिसर, लँडमार्क",
    phone: "फोन",
    notes: "टीप (ऐच्छिक)",
    notesPh: "उदा. सकाळी ८ पूर्वी डिलिव्हर करा",
    payment: "पेमेंट",
    codTitle: "कॅश ऑन डिलिव्हरी (COD)",
    codBody: "ऑर्डर आल्यावर रोख द्या.",
    placeOrder: "ऑर्डर करा + WhatsApp",
    placing: "ऑर्डर होत आहे…",
    myOrdersTitle: "माझे ऑर्डर",
    orderPlaced:
      "ऑर्डर झाला! दुकानाच्या WhatsApp वर अलर्ट उघडला. अॅडमिन पॅनलमध्येही दिसेल.",
    noOrders: "अजून ऑर्डर नाही.",
    pleaseLogin: "ऑर्डर पाहण्यासाठी लॉगिन करा.",
    qty_1kg: "1 किलो",
    qty_500g: "½ किलो",
    qty_250g: "250 ग्रॅम",
    qty_125g: "125 ग्रॅम",
    language: "भाषा",
    perKg: "/ किलो",
    perUnit: "/",
  },
} as const;

export type DictKey = keyof typeof dict.en;

type I18nCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey) => string;
  qtyLabel: (value: number, unit: string) => string;
};

const Ctx = createContext<I18nCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY) as Lang | null;
    if (saved === "en" || saved === "hi" || saved === "mr") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(LANG_KEY, l);
    document.documentElement.lang = l === "en" ? "en" : l;
  }, []);

  const t = useCallback(
    (key: DictKey) => dict[lang][key] ?? dict.en[key] ?? key,
    [lang],
  );

  const qtyLabel = useCallback(
    (value: number, unit: string) => {
      if (unit === "kg") {
        if (Math.abs(value - 1) < 0.001) return t("qty_1kg");
        if (Math.abs(value - 0.5) < 0.001) return t("qty_500g");
        if (Math.abs(value - 0.25) < 0.001) return t("qty_250g");
        if (Math.abs(value - 0.125) < 0.001) return t("qty_125g");
      }
      return `${value} ${unit}`;
    },
    [t],
  );

  const value = useMemo(
    () => ({ lang, setLang, t, qtyLabel }),
    [lang, setLang, t, qtyLabel],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
