export default function ContactCTA() {
  return (
    <section
      id="contact"
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-primary"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6 text-balance">
          Ready to Find Your Perfect Home?
        </h2>
        <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 text-balance leading-relaxed">
          Let our expert team guide you through every step of your real estate
          journey. Contact us today for a personalized consultation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button className="bg-primary-foreground text-primary px-8 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium">
            Schedule Consultation
          </button>
          <button className="border-2 border-primary-foreground text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary-foreground hover:text-primary transition-all font-medium">
            Learn More
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-primary-foreground/20">
          <div>
            <p className="text-2xl font-bold text-primary-foreground mb-2">
              (555) 123-4567
            </p>
            <p className="text-primary-foreground/80">Phone</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-foreground mb-2">
              info@luxeproperties.com
            </p>
            <p className="text-primary-foreground/80">Email</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-foreground mb-2">
              123 Real Estate Blvd
            </p>
            <p className="text-primary-foreground/80">Address</p>
          </div>
        </div>
      </div>
    </section>
  );
}
