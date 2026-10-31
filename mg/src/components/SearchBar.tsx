import Icon from "./Icon";
import { getAreas } from "@/lib/data";

// نموذج GET عادي يعمل بدون JavaScript ويفتح /search
export default function SearchBar({ q = "", area = "", compact = false }: { q?: string; area?: string; compact?: boolean }) {
  return (
    // key: عند التنقل من الفلاتر (client) الحقول uncontrolled فلازم تتبني من جديد بقيم الـ URL
    <form key={`${q}|${area}`} className={`search${compact ? " compact" : ""}`} action="/search" method="get" role="search">
      <label className="field">
        <Icon name="search" size={20} />
        <span className="sr-only">ابحث عن دكتور أو تخصص أو خدمة</span>
        <input type="search" name="q" enterKeyHint="search" autoComplete="off" defaultValue={q} placeholder="ابحث عن دكتور، تخصص أو خدمة..." maxLength={80} />
      </label>
      <label className="field field-area">
        <Icon name="pin" size={20} />
        <span className="sr-only">اختر المنطقة</span>
        <select name="area" defaultValue={area}>
          <option value="">اختر المنطقة</option>
          {getAreas().map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
        </select>
      </label>
      <button className="btn btn-primary" type="submit"><Icon name="search" size={18} />ابحث الآن</button>
    </form>
  );
}
