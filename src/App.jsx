import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import AboutMeSection from "./components/AboutMeSection";
import MySkillsSection from "./components/MySkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import ContactMeSection from "./components/ContactMeSection";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <NavBar />
      <HeroSection />
      <AboutMeSection />
      <MySkillsSection />
      <ProjectsSection />
      <ContactMeSection />
      <Footer />
    </>
  );
}

export default App;
