import { useMediaQuery } from "react-responsive";
import SvgHeroSection from "./SvgHeroSection";
import SvgLogoOutline from "./SVGLogoOutline";
import SvgScrollDown from "./SvgScrollDown";
import SvgCheckerdGrid from "./SvgCheckerdGrid";
import SvgGridSquareBtmR from "./SvgGridSquareBtmR";
import SvgDotsGrid from "./SvgDotsGrid";
import SvgGridSquareTpL from "./SvgGridSquareTpL";

export default function HeroSection() {
  const isLarge = useMediaQuery({ query: "(min-width: 1024px)" });

  const MobileHero = (
    <>
      {/* Hero Message */}
      <div className="hero-section-msg text-center p-2 sm:p-3 md:p-4 z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-left font-bold">
          Hi, I'm{" "}
          <span className="text-brightBlue font-extrabold italic">Seun</span>
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl pt-1 text-left font-extrabold">
          Frontend Developer
        </h2>
        <p className="text-base sm:text-lg md:text-xl pt-1 sm:pt-2 mx-auto max-w-xl text-left">
          Building responsive, accessible, and user-focused web applications.
        </p>
      </div>

      {/* Hero Illustration */}
      <div
        className="hero-section-illustration w-full flex justify-center items-center relative 
       h-[38vh] xs:h-[40vh] sm:h-[45vh] md:h-[48vh]
       max-w-[400px] sm:max-w-md md:max-w-xl mx-auto mt-2"
      >
        <SvgHeroSection className="w-full h-full object-contain relative z-10" />
      </div>

      <div className="flex flex-col items-center z-10 pb-2 sm:pb-4 mt-2">
        <p className="text-sm sm:text-base md:text-lg font-bold pb-1 sm:pb-2">
          Scroll Down
        </p>
        <SvgScrollDown className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
      </div>
    </>
  );

  const DesktopHero = (
    <>
      {/* Hero Message */}
      <div className="hero-section-msg p-2 sm:p-4 md:p-6">
        <h1 className="text-6xl lg:text-7xl xl:text-8xl 2xl:text-8xl font-bold text-left">
          Hi, I'm{" "}
          <span className="text-brightBlue font-extrabold italic">Seun</span>
        </h1>
        <p className="text-5xl sm:text-5xl md:text-5xl font-extrabold pt-1 text-left">
          Frontend Developer
        </p>
        <p className="text-2xl lg:text-2xl pt-2 mx-auto max-w-xl text-left">
          Building responsive, accessible, and user-focused web applications.
        </p>
      </div>

      {/* Hero Illustration with dynamic gradient circle */}
      <div className="hero-section-illustration lg:w-2/5 max-h-[100%] flex flex-col justify-center items-center relative">
        <SvgHeroSection className="relative z-10 w-full max-w-xl xl:max-w-3xl 2xl:max-w-4xl" />
      </div>
    </>
  );
  //bg-gradient-to-b from-[inkBlack] via-deepSpaceBlue to-[inkBlack]

  return (
    <section className="mt-16 min-h-[calc(100dvh-4rem)] w-full flex flex-col lg:flex-row justify-center items-center relative z-10 overflow-hidden bg-gradient-to-b from-[inkBlack] via-deepSpaceBlue to-[inkBlack]">
      {isLarge ? (
        <div className="w-full flex lg:flex-row lg:gap-6 justify-center items-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {DesktopHero}
        </div>
      ) : (
        <div className="w-full flex flex-col gap-2 justify-center items-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {MobileHero}
        </div>
      )}

      {/* Decorative SVGs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Left */}
        <SvgGridSquareTpL className="absolute w-16 h-16 top-[0vh] sm:top-[2vh] lg:top-[14vh] xl:top-[15vh] left-[4vw] sm:left-[1vw] lg:left-[4vw] xl:left-[12vw]" />
        <SvgDotsGrid className="absolute w-16 h-16 bottom-[35vh] -left-[2vw] sm:-left-[4vw] lg:-left-6 xl:left-[1vw]" />
        <SvgCheckerdGrid className="absolute w-16 h-16 bottom-[2vh] left-[2vw]" />
        {/* Right */}
        <SvgLogoOutline className="absolute w-16 h-16 top-[1vh]  right-[1vw] lg:right-[2vw]" />
        <SvgDotsGrid className=" absolute w-16 h-16 bottom-[35vh] -right-[2vw] 2xl:right-[5vw]" />
        <SvgGridSquareBtmR className="absolute w-16 h-16 bottom-[4vh] lg:bottom-[5vh] right-[2vw] lg:right-[5vw] xl:right-[6vw]" />
      </div>
    </section>
  );
}
