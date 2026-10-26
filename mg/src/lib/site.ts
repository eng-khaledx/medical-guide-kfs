/** رقم الدليل المركزي: يُستخدم لأي مقدم خدمة ليس له phone/whatsapp خاص به. */
export const GUIDE_CONTACT_NUMBER = { phone: "01550111914", whatsapp: "201550111914" } as const;

export const SITE = {
  name: "دليلك الطبي بكفرالشيخ",
  nameEn: "Medical Guide Kafr El Sheikh",
  tagline: "كل خدماتك الطبية في مكان واحد",
  phoneLocal: GUIDE_CONTACT_NUMBER.phone,
  phoneIntl: GUIDE_CONTACT_NUMBER.whatsapp,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

/** الأسعار الحالية غير موثقة: تظهر فقط عند showFees أو عند feeVerified للمقدم. القيم تبقى في البيانات. */
export const showFees = false;
export const FEE_PLACEHOLDER = "يُحدد عند التواصل";
/** نص السعر للعرض، أو undefined إن لم يكن للمقدم سعر. isPlaceholder يحدد التنسيق الخافت. */
export function getFeeDisplay(p: { consultationPrice?: string; feeVerified?: boolean }) {
  if (!p.consultationPrice) return undefined;
  const real = showFees || p.feeVerified === true;
  return { text: real ? p.consultationPrice : FEE_PLACEHOLDER, isPlaceholder: !real };
}

/** رابط صفحة فيسبوك؛ اتركه فارغًا لإخفاء الأيقونة. */
export const FACEBOOK_URL = "";
