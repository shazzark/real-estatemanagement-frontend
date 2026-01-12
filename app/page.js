import Navbar from "./_components/navbar";
import Hero from "./_components/hero";
import FeaturedProperties from "./_components/featured-properties";
import Testimonials from "./_components/testimonial";
// import ContactCTA from "./_components/contact-cta";
import Footer from "./_components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <FeaturedProperties />
      <Testimonials />
      <Footer />
    </main>
  );
}
