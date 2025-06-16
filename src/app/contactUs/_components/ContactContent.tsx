import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";

export const metadata: Metadata = {
  title: "Contact Us | YLY - Youth Leading Youth",
  description:
    "Get in touch with YLY (Youth Leading Youth). We're here to help with any questions or collaboration opportunities.",
};

export default function ContactContent() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-16">
      <div className="grid gap-16 lg:grid-cols-2">
        {/* Contact Form Card */}
        <div className="rounded-2xl bg-card p-8 shadow-lg">
          <h2 className="mb-8 text-3xl font-bold">Send us a Message</h2>
          <Suspense
            fallback={
              <div className="animate-pulse space-y-4">
                <div className="h-12 rounded-lg bg-gray-200" />
                <div className="h-12 rounded-lg bg-gray-200" />
                <div className="h-32 rounded-lg bg-gray-200" />
              </div>
            }
          >
            <ContactForm />
          </Suspense>
        </div>

        {/* Contact Information and Map */}
        <div className="flex flex-col justify-between space-y-8">
          <Suspense
            fallback={
              <div className="animate-pulse space-y-4">
                <div className="h-24 rounded-lg bg-gray-200" />
                <div className="h-24 rounded-lg bg-gray-200" />
              </div>
            }
          >
            <ContactInfo />
          </Suspense>

          {/* Map with SEO-friendly title */}
          <div className="relative h-[400px] overflow-hidden rounded-2xl shadow-lg">
            <Suspense
              fallback={
                <div className="h-full animate-pulse rounded-2xl bg-gray-200" />
              }
            >
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
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
