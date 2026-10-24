# دليلك الطبي بكفرالشيخ

تشغيل: `npm install` ثم `npm run dev` (المنفذ 3000). للبناء: `npm run build`.

## إضافة دكتور
افتح `src/data/doctors.ts` وانسخ المثال المعلّق وعدّل بياناته. الحقول الفارغة تختفي تلقائيًا.
نفس الفكرة في pharmacies / laboratories / radiology / medicalCenters / dentalClinics / hospitals / physiotherapy.
الصور: ضعها في `public/doctors/` واكتب `image: "/doctors/اسم-الملف.jpg"`.

## البيانات التجريبية
`src/data/demo.ts` فيها 5 نماذج تجريبية. لإخفائها: `showDemoData: false` في `src/lib/site.ts`.

## البنرات والعروض
`src/data/banners.ts` و `src/data/offers.ts` (لو العروض فاضية القسم بيختفي).

## اللوجو
`public/logo/medical-guide-logo.jpg`
