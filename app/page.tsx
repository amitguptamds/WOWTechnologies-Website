import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Vision from '@/components/Vision';
import Capabilities from '@/components/Capabilities';
import Products from '@/components/Products';
import Team from '@/components/Team';
import WhyWowzer from '@/components/WhyWowzer';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Vision />
      <Capabilities />
      <Products />
      <Team />
      <WhyWowzer />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
