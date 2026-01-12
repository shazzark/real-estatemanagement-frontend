"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, Globe, Target } from "lucide-react";
import Image from "next/image";
import Navbar from "../_components/navbar";

export default function AboutPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const values = [
    {
      title: "Uncompromising Integrity",
      description:
        "We believe in transparency and honesty in every interaction, ensuring our clients' interests always come first.",
      icon: <Target className="w-6 h-6" />,
    },
    {
      title: "Visionary Design",
      description:
        "We don't just find spaces; we discover architectural artifacts that inspire and endure.",
      icon: <Globe className="w-6 h-6" />,
    },
    {
      title: "Community Focus",
      description:
        "Our projects are designed to enrich the local fabric and create lasting value for neighborhoods.",
      icon: <Users className="w-6 h-6" />,
    },
  ];

  const team = [
    {
      name: "Samson Wylie",
      role: "Architectural Designer & Partner",
      image: "/professional-portrait-architect.jpg",
    },
    {
      name: "Liam Dutch",
      role: "Managing Director",
      image: "/professional-portrait-director.jpg",
    },
    {
      name: "Elena Rossi",
      role: "Head of Development",
      image: "/professional-portrait-developer.jpg",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-accent/20">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="container relative z-10 px-4 text-center"
        >
          <span className="inline-block px-3 py-1 mb-6 text-xs tracking-widest uppercase border border-primary/20 text-primary">
            Our Legacy
          </span>
          <h1 className="max-w-4xl mx-auto mb-8 text-5xl font-serif italic tracking-tight md:text-7xl text-foreground text-balance">
            Crafting the future of architectural living
          </h1>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed text-muted-foreground text-pretty">
            Artifact is more than a real estate firm. we are curators of
            contemporary living, dedicated to bringing visionary architectural
            concepts to life.
          </p>
        </motion.div>
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Image
            src="/minimal-architectural-texture.jpg"
            alt="Texture"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-24 border-t border-border/50">
        <div className="container px-4 mx-auto">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -30 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-4/5 bg-muted overflow-hidden"
            >
              <Image
                src="/modern-architectural-building-detail.jpg"
                alt="Architectural Story"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 30 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-serif text-foreground">
                The Artifact Story
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>
                  Founded on the principle that property should be as much a
                  work of art as it is a functional space, Artifact began as a
                  small boutique developer in 2015. Our journey started with a
                  single vision: to bridge the gap between pure architectural
                  expression and residential utility.
                </p>
                <p>
                  Today, we stand at the forefront of contemporary residential
                  architecture, known for our meticulous attention to detail and
                  our commitment to using materials that tell a story. Every
                  project we undertake is an exhibit of our dedication to the
                  craft.
                </p>
              </div>
              <button className="flex items-center gap-3 py-2 text-sm tracking-widest uppercase border-b border-primary text-primary hover:text-accent hover:border-accent transition-colors">
                View our journey <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container px-4 mx-auto text-center mb-16">
          <h2 className="mb-6 text-4xl font-serif">Mission & Values</h2>
          <div className="w-24 h-px mx-auto bg-primary/30"></div>
        </div>
        <div className="container px-4 mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 space-y-6 transition-colors border border-border/50 bg-card hover:bg-white/50"
              >
                <div className="p-3 bg-primary/10 w-fit text-primary">
                  {value.icon}
                </div>
                <h3 className="text-xl font-serif tracking-tight">
                  {value.title}
                </h3>
                <p className="leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-background">
        <div className="container px-4 mx-auto text-center mb-16">
          <h2 className="mb-6 text-4xl font-serif">Meet the Partners</h2>
          <p className="max-w-xl mx-auto text-muted-foreground">
            A collaborative team of designers, strategists, and visionaries
            shaping the future of architectural living.
          </p>
        </div>
        <div className="container px-4 mx-auto">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group"
              >
                <div className="relative aspect-4/5 overflow-hidden bg-muted mb-6">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-serif tracking-tight">
                  {member.name}
                </h3>
                <p className="text-sm tracking-widest uppercase text-primary/70">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-border/50">
        <div className="container px-4 mx-auto text-center">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto space-y-8"
          >
            <h2 className="text-3xl font-serif italic md:text-5xl">
              Ready to find your artifact?
            </h2>
            <p className="text-muted-foreground">
              Contact us today to learn more about our upcoming architectural
              developments and private exhibition events.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button className="px-8 py-3 tracking-widest text-white uppercase transition-colors bg-primary hover:bg-primary/90">
                Contact Us
              </button>
              <button className="px-8 py-3 tracking-widest uppercase transition-colors border border-primary text-primary hover:bg-primary hover:text-white">
                View Projects
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
