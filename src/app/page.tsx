import Navbar         from "@/components/landing/Navbar";
import Hero           from "@/components/landing/Hero";
import Pain           from "@/components/landing/Pain";
import StatsBar       from "@/components/landing/StatsBar";
import Features       from "@/components/landing/Features";
import DashboardPreview from "@/components/landing/DashboardPreview";
import AIWorkflow     from "@/components/landing/AIWorkflow";
import Automations    from "@/components/landing/Automations";
import DayInLife      from "@/components/landing/DayInLife";
import Testimonials   from "@/components/landing/Testimonials";
import Comparison     from "@/components/landing/Comparison";
import FAQ            from "@/components/landing/FAQ";
import Contact        from "@/components/landing/Contact";
import Footer         from "@/components/landing/Footer";
import ChatWidget     from "@/components/chat/ChatWidget";
import VapiAgent      from "@/components/chat/VapiAgent";
import WhatsAppFloat  from "@/components/landing/WhatsAppFloat";

// US edition — clean light SaaS aesthetic. All landing components are
// self-contained light-styled; the dashboard keeps the dark theme.
export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8fafc] text-[#0f1726]">
      <Navbar />
      <main>
        <Hero />
        <Pain />
        <Features />
        <DashboardPreview />
        <AIWorkflow />
        <Automations />
        <StatsBar />
        <DayInLife />
        <Testimonials />
        <Comparison />
        <FAQ />
        <Contact />
      </main>
      <Footer />

      <ChatWidget />
      <VapiAgent />
      <WhatsAppFloat />
    </div>
  );
}
