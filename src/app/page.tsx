import HeroSection from "@/components/HeroSection";
import SignatureSection from "@/components/SignatureSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import TimelineSection from "@/components/TimelineSection";
import PlaygroundSection from "@/components/PlaygroundSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen relative w-full overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Projects Section */}
      <ProjectsSection />

      {/* Signature Feature: Code DNA */}
      <SignatureSection />

      {/* Skills Section */}
      <SkillsSection />

      {/* Timeline Section */}
      <TimelineSection />

      {/* Playground Section */}
      <PlaygroundSection />

      {/* Contact Section */}
      <ContactSection />
    </main>
  );
}
