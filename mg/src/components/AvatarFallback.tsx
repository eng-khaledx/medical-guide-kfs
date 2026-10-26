import Icon from "./Icon";
import { getSpecialty } from "@/lib/data";
import type { Provider } from "@/types";

/** أول حرف من الاسم بعد "د." */
const initial = (name: string) => Array.from(name.replace(/^\s*(?:دكتورة|دكتور|د\s*\.?)\s*/, "").trim())[0] ?? "د";

/** بديل الصورة: للأطباء حرف الاسم الأول بلون التخصص (نفس ألوان أيقونات الأقسام)، ولغيرهم أيقونة. */
export default function AvatarFallback({ p, iconSize = 30 }: { p: Provider; iconSize?: number }) {
  if (p.providerType !== "DOCTOR") {
    return <Icon name={p.providerType === "PHARMACY" ? "pill" : p.providerType === "LABORATORY" ? "flask" : "user"} size={iconSize} />;
  }
  const tint = getSpecialty(p.specialty)?.tint ?? "blue";
  return <span className={`avatar-fill tint-${tint}`} aria-hidden="true">{initial(p.name)}</span>;
}
