import Navbar from "@/components/Navbar";
import SocialMatrix from "@/components/SocialMatrix";
import Hero from "@/components/Hero";
import Biography from "@/components/Biography";
import ExcellenceMatrix from "@/components/ExcellenceMatrix";
import SupporterRegistration from "@/components/SupporterRegistration";
import VoterPortal from "@/components/VoterPortal";
import DonationPortal from "@/components/DonationPortal";
import Blog from "@/components/Blog";
import VlogEngine from "@/components/VlogEngine";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <div className="relative isolate overflow-x-clip">
      <Navbar />
      <SocialMatrix />

      <main>
        <Hero />
        <Biography />
        <ExcellenceMatrix />
        <SupporterRegistration />
        <VoterPortal />
        <DonationPortal />
        <Blog />
        <VlogEngine />
      </main>

      <Footer />
    </div>
  );
}
