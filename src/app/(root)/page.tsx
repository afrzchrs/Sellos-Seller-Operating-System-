import Hero from "@/app/components/LandingPage/HeorSection";
import ProblemAgitation from "@/app/components/LandingPage/ProblemAgitation";
import CaraKerja from "@/app/components/LandingPage/HowItWorks"
import Fitur from "@/app/components/LandingPage/Features";
import SolusiUsaha from "@/app/components/LandingPage/UseCase";
import CTA from "@/app/components/LandingPage/CTA";

const About = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return (
    <>
      <Hero />
      <ProblemAgitation />
      <CaraKerja />
      <Fitur />
      <SolusiUsaha />
      <CTA />
    </>
  );
};

export default About;
