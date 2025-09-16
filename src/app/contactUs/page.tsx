import type { Metadata } from "next";
import { ContactForm } from "./_components/ContactForm";
import { ContactHero } from "./_components/ContactHero";
import { ContactInfo } from "./_components/ContactInfo";

export const metadata: Metadata = {
  title: "Contact Us | YLY - Youth Leading Youth",
  description:
    "Get in touch with YLY (Youth Leading Youth). Whether you have questions, suggestions, or want to collaborate, we're here to help.",
  openGraph: {
    title: "Contact Us | YLY - Youth Leading Youth",
    description:
      "Get in touch with YLY (Youth Leading Youth). We're here to help with any questions or collaboration opportunities.",
    type: "website",
    siteName: "YLY - Youth Leading Youth",
    locale: "en_US",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "YLY Contact Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | YLY - Youth Leading Youth",
    description:
      "Get in touch with YLY (Youth Leading Youth). We're here to help with any questions or collaboration opportunities.",
    images: ["/images/hero.jpg"],
  },
  alternates: {
    canonical: "https://yly.com/contact",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <ContactHero />

      {/* Contact Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Contact Form Card */}
          <div className="rounded-2xl bg-card p-8 shadow-lg">
            <h2 className="mb-8 text-3xl font-bold">Send us a Message</h2>
            <ContactForm />
          </div>

          {/* Contact Information and Map */}
          <div className="flex flex-col justify-between space-y-8">
            <ContactInfo />

            {/* Map with SEO-friendly title */}
            <div className="relative h-[400px] overflow-hidden rounded-2xl shadow-lg">
              <iframe
                title="YLY Office Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.5725588343367!2d31.340944!3d30.0591863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAzJzMzLjEiTiAzMcKwMjAnMjcuNCJF!5e0!3m2!1sen!2seg!4v1625689420213!5m2!1sen!2seg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale transition-all hover:grayscale-0"
                aria-label="Interactive map showing YLY office location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>
    </main>
  );
}
