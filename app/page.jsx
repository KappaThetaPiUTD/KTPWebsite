import dynamic from "next/dynamic";
import Hero from "../components/home/hero";
import WhoWeIs from "../components/home/who-we-is";
import Pillars from "../components/home/pillars";

const CompanyCollage = dynamic(() => import("../components/CompanyCollage"), {
  loading: () => <div className="w-screen h-64 bg-white animate-pulse" />,
});

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
      <CompanyCollage />
    </div>
  );
}
