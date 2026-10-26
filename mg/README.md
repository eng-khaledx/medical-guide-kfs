# دليلك الطبي بكفرالشيخ

دليل طبي بالعربي (RTL) لمحافظة كفرالشيخ: بحث عن الأطباء والتخصصات، وتواصل مباشر عبر واتساب أو الاتصال، ونماذج انضمام لمقدمي الخدمة تتحفظ في Google Sheets. مبني بـ Next.js 14 (App Router) وTypeScript، والبيانات ملفات TS في `src/data/` بدون قاعدة بيانات.

## التشغيل

```bash
cd mg
npm install
npm run dev        # http://localhost:3000
```

قبل أي commit: `npx tsc --noEmit && npm run lint && npm run build` (وقّف الـ dev server قبل `build` ثم شغّله تاني).

## متغيرات البيئة

انسخ `.env.local.example` إلى `.env.local` واملأ القيم (الأسماء بس هنا، القيم سرية ومش بتترفع على git):

| الاسم | الاستخدام |
|---|---|
| `SHEETS_WEBHOOK_URL` | رابط Google Apps Script اللي بيحفظ طلبات الانضمام |
| `SHEETS_SECRET` | السر المشترك مع الـ Apps Script |
| `NEXT_PUBLIC_SITE_URL` | دومين الموقع (canonical وsitemap وروابط الصفحات) |

على Vercel أضفهم من Project → Settings → Environment Variables.

## إضافة أو تعديل المحتوى

- الأطباء: `src/data/doctors.ts` (نفس الفكرة في باقي ملفات `src/data/` للأنواع التانية). الحقول الفاضية بتختفي من الموقع.
- التخصصات والمناطق والأقسام والبنرات: ملفات `src/data/*`.
- الأسعار مخفية لحد ما `feeVerified: true` للدكتور (`src/lib/site.ts`).
- الصور: `public/doctors/` وحقل `image` في بيانات الدكتور.

## حالة المشروع

التفاصيل الكاملة (الصفحات، الأرقام، القرارات، الناقص، وخطة الأولويات): [PROJECT_STATUS.md](PROJECT_STATUS.md)
