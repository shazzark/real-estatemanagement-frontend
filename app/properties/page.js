"use client";
import Navbar from "../_components/navbar";
import PropertiesGrid from "../_components/properties-grid";
import Footer from "../_components/footer";

export default function PropertiesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PropertiesGrid />
      <Footer />
    </main>
  );
}
