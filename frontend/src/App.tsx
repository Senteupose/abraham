import Navbar from "./components/Navbar";
import SocialMatrix from "./components/SocialMatrix";
import Hero from "./components/Hero";
import SupporterRegistration from "./components/SupporterRegistration";
import VoterPortal from "./components/VoterPortal";
import DonationPortal from "./components/DonationPortal";
import Biography from "./components/Biography";
import ExcellenceMatrix from "./components/ExcellenceMatrix";
import Blog from "./components/Blog";
import VlogEngine from "./components/VlogEngine";
import Footer from "./components/Footer";

export default function App() {
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
