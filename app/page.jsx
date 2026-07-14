import Hero from "../components/home/hero";
import WhoWeIs from "../components/home/who-we-is";
import Pillars from "../components/home/pillars";
import CompanyCollage from "../components/CompanyCollage";
import BirthdayBanner from "../components/BirthdayBanner";


export const metadata = {
  title: "Kappa Theta Pi UTD - Home",
  description:
    "Kappa Theta Pi (KTP) Mu Chapter at UT Dallas, a co-ed professional technology fraternity building technical skills, professional growth, and lifelong community.",
};

export default function Home() {
  return (
    <div className="relative w-full">
      {/* Shows only on a brother's birthday; hidden otherwise. */}
      <BirthdayBanner />
      <Hero />
      <WhoWeIs />
      <Pillars />
      <CompanyCollage/>
    </div>
  );
}
