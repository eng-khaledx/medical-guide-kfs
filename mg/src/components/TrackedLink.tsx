"use client";
import { trackEvent, type TrackEvent } from "@/lib/track";

interface Props extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "onClick"> {
  event: Exclude<TrackEvent, "join_submit">;
  slug: string; name: string; specialty?: string;
}

/** رابط عادي (واتساب/اتصال) يسجّل الضغطة في الخلفية دون التدخل في الرابط نفسه. */
export default function TrackedLink({ event, slug, name, specialty, children, ...rest }: Props) {
  return <a {...rest} onClick={() => trackEvent({ event, providerSlug: slug, providerName: name, specialty })}>{children}</a>;
}
