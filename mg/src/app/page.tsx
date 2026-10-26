import Link from "next/link";
import Icon from "@/components/Icon";
import SearchBar from "@/components/SearchBar";
import Banners from "@/components/Banners";
import Tile from "@/components/Tile";
import ProviderCard from "@/components/ProviderCard";
import OfferCard from "@/components/OfferCard";
import { getActiveOffers, getAllTiles, getDoctors, getFeaturedProviders, getHomeTiles, popularSearches } from "@/lib/data";
import { MSG, createWhatsAppUrl } from "@/lib/whatsapp";
import { SITE, showFeatured } from "@/lib/site";

export default function Home() {
  const featured = getFeaturedProviders().slice(0, 8);
  const offers = getActiveOffers();
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>{SITE.name}</h1>
          <p className="hero-sub">{SITE.tagline}</p>
          <p className="muted">ابحث عن الطبيب أو الخدمة الطبية التي تحتاجها بسهولة.</p>
          <SearchBar />
          <div className="chips">
            <span>أشهر البحث:</span>
            {popularSearches.map((s) => <Link key={s.href} className="chip" href={s.href}>{s.label}</Link>)}
          </div>
        </div>
      </section>

      <Banners />

      <section className="container section" id="categories">
        <div id="specialties">
          <h2 className="section-title">ماذا تبحث اليوم؟</h2>
          <div className="tiles">{getHomeTiles().map((t) => <Tile key={t.href} {...t} />)}</div>
          <Link className="btn btn-ghost all-btn" href="/specialties">كل التخصصات ({getAllTiles().length})</Link>
        </div>
      </section>

      <section className="container section help-section">
        <aside className="help-card">
          <span className="help-icon"><Icon name="heart" size={26} /></span>
          <div className="help-text">
            <h2>مش لاقي اللي بتدور عليه؟</h2>
            <p className="muted">ابعتلنا اللي محتاجه وإحنا نساعدك في الوصول للخدمة المناسبة.</p>
          </div>
          <a className="btn btn-primary" href={createWhatsAppUrl({ message: MSG.help })} target="_blank" rel="noopener noreferrer">
            <Icon name="chat" size={18} />اطلب المساعدة</a>
        </aside>
      </section>

      {featured.length > 0 && (
        <section className="container section">
          <div className="section-head">
            <h2 className="section-title">{showFeatured ? "مقدمو خدمة مميزون" : "أطباء من الدليل"}</h2>
            <Link href="/search" className="more">عرض الكل <span className="more-arrow" aria-hidden="true">←</span></Link>
          </div>
          <div className="grid">{featured.map((p) => <ProviderCard key={p.id} p={p} />)}</div>
          <Link className="btn btn-outline all-doctors-btn" href="/search">عرض كل الأطباء ({getDoctors().length}) ←</Link>
        </section>
      )}

      {offers.length > 0 && (
        <section className="container section" id="offers">
          <h2 className="section-title">عروض طبية</h2>
          <div className="grid">{offers.map((o) => <OfferCard key={o.id} o={o} />)}</div>
        </section>
      )}

      <section className="container section">
        <h2 className="section-title">إزاي بتستخدم الموقع؟</h2>
        <ol className="steps">
          <li><span className="step-n">1</span><h3>ابحث</h3><p className="muted">ابحث عن الطبيب أو الخدمة التي تحتاجها.</p></li>
          <li><span className="step-n">2</span><h3>اختار</h3><p className="muted">شوف التفاصيل واختر مقدم الخدمة المناسب لاحتياجك.</p></li>
          <li><span className="step-n">3</span><h3>تواصل</h3><p className="muted">اتصل أو تواصل عبر واتساب بسهولة.</p></li>
        </ol>
      </section>

      <section className="container section" id="providers-cta">
        <div className="cta-band">
          <div>
            <h2>أنت مقدم خدمة طبية؟</h2>
            <p className="muted">خلّي خدمتك موجودة على دليلك الطبي بكفرالشيخ.</p>
          </div>
          <div className="cta-actions">
            <Link className="btn btn-primary" href="/join/doctor">سجّل عيادتك</Link>
            <a className="cta-secondary" href={createWhatsAppUrl({ message: MSG.join })} target="_blank" rel="noopener noreferrer">عندك سؤال؟ كلمنا واتساب</a>
          </div>
        </div>
      </section>
    </>
  );
}
