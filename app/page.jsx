import Hero from "../components/home/hero";
import WhoWeIs from "../components/home/who-we-is";
import Pillars from "../components/home/pillars";
import CompanyCollage from "../components/CompanyCollage";
import '../styles/globals.css'


export const metadata = {
  title: "Kappa Theta Pi UTD - Home",
  description: "Kappa Theta Pi Descripton",
};

export default function Home() {
  return (
    <div className="relative w-screen">
      <Hero />
      <WhoWeIs />
      <Pillars />
      <CompanyCollage/>
    </div>
  );
}
