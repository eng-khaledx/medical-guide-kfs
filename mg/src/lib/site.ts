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
