import Image from "next/image";
import Navbar from "./components/navbar";
import AboutHeroSkills from "./components/herosection";
import ProjectsShowcase from "./components/projectshowcase";
import ProcessClock from "./components/process"
import ContactSection from "./components/contact";
import Footer from "./components/footer";

export default function Home() {
  return (
    <>
      <Navbar/>
      <AboutHeroSkills/>
      <ProjectsShowcase/>
      <ProcessClock/>
      <ContactSection/>
      <Footer/>
    </>
  );
}
