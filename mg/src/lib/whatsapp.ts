import { SITE, GUIDE_CONTACT_NUMBER } from "./site";
import type { Provider } from "@/types";

/** رقم الطبيب الخاص إن وُجد، وإلا رقم الدليل المركزي. */
export function getContact(p: Provider) {
  return {
    phone: p.phone ?? GUIDE_CONTACT_NUMBER.phone,
    whatsapp: p.whatsapp ?? GUIDE_CONTACT_NUMBER.whatsapp,
    phoneViaGuide: !p.phone,
    whatsappViaGuide: !p.whatsapp,
  };
}

export function createWhatsAppUrl({ phone = SITE.phoneIntl, message }: { phone?: string; message?: string }) {
  const digits = phone.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const MSG = {
  contact: (name: string, specialty?: string) => `مرحباً، أريد التواصل مع ${name}${specialty ? ` (${specialty})` : ""} عن طريق دليلك الطبي`,
  help: "مرحبًا، أحتاج المساعدة في العثور على خدمة طبية في كفرالشيخ.",
  join: "مرحبًا، أنا مقدم خدمة طبية وأرغب في معرفة تفاصيل إضافة خدمتي على دليلك الطبي بكفرالشيخ.",
  claim: (name: string, url: string) => `مرحبًا، أنا ${name} وأرغب في تعديل بيانات صفحتي أو طلب حذفها من دليلك الطبي بكفرالشيخ.
رابط الصفحة: ${url}`,
  about: (name: string) => `مرحبًا، أريد الاستفسار عن ${name} من خلال دليلك الطبي بكفرالشيخ.`,
};
