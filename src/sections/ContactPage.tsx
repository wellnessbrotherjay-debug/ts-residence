import { useState, useEffect } from "react";
import { BTN_SOLID } from "../constants";
import { FadeInView } from "../components/animations";
import { EditableImage } from "../components/EditableImage";
import { listImages } from "@/lib/images-client";

export const ContactPage = () => {
  const [hallwayImage, setHallwayImage] = useState(
    "https://picsum.photos/seed/ts-hallway/1200/1200",
  );

  useEffect(() => {
    const loadImages = async () => {
      const d = await listImages("contact");
      if (d?.[0]) setHallwayImage(d[0].url);
    };

    loadImages();
  }, []);

  return (
    <div className="mx-auto max-w-[1400px] px-6 pt-32 pb-20 md:px-10">
      <FadeInView className="mb-20">
        <span className="label-caps text-gold">Get in Touch</span>
        <h1 className="heading-display text-ink mt-4 mb-16 text-5xl md:text-6xl lg:text-7xl">
          Let's talk about your long-stay
        </h1>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <p className="label-caps">Phone / WhatsApp</p>
            <p className="text-ink font-serif text-xl md:text-2xl">
              +62 811 1902 8111
            </p>
            <p className="label-caps pt-4">Telegram</p>
            <p className="text-ink font-serif text-xl md:text-2xl">
              +62 811 1902 8111
            </p>
          </div>
          <div className="space-y-3">
            <p className="label-caps">Email</p>
            <p className="text-ink font-serif text-xl md:text-2xl">
              tsresidence@townsquare.co.id
            </p>
          </div>
          <div className="space-y-3">
            <p className="label-caps">Address</p>
            <p className="text-ink font-serif text-xl leading-relaxed md:text-2xl">
              Jl. Nakula No.18, Legian, Seminyak, Bali
            </p>
          </div>
        </div>
      </FadeInView>

      {/* Form */}
      <FadeInView className="mb-24 grid grid-cols-1 items-start gap-12 bg-white p-8 md:p-14 lg:grid-cols-12 lg:gap-20 lg:p-20">
        <div className="h-full lg:col-span-5">
          <div className="aspect-[4/5] min-h-[400px] overflow-hidden md:aspect-square lg:aspect-auto lg:h-full">
            <EditableImage
              src={hallwayImage}
              alt="TS Residence"
              category="contact"
              className="h-full w-full"
              onImageChange={setHallwayImage}
            >
              {(src: string) => (
                <img
                  src={src}
                  alt="TS Residence"
                  className="h-full w-full object-cover"
                />
              )}
            </EditableImage>
          </div>
        </div>

        <div className="space-y-10 lg:col-span-7">
          <div>
            <h2 className="text-ink mb-3 font-serif text-3xl md:text-4xl">
              Looking for a long-term stay?
            </h2>
            <p className="text-body">
              Tell us what you're looking for — our team will get back to you
              with personalized recommendations.
            </p>
          </div>

          <form className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
            {[
              { label: "First Name", type: "text", placeholder: "First Name" },
              { label: "Last Name", type: "text", placeholder: "Last Name" },
              { label: "Email", type: "email", placeholder: "Email address" },
              {
                label: "Phone (optional)",
                type: "text",
                placeholder: "Phone number",
              },
            ].map((field) => (
              <div key={field.label} className="space-y-2">
                <label className="label-caps text-ink">{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="border-gold/20 focus:border-gold placeholder:text-muted/40 w-full border-b bg-transparent py-3 text-sm transition-colors outline-none"
                />
              </div>
            ))}
            <div className="space-y-2 md:col-span-2">
              <label className="label-caps text-ink">Stay Duration</label>
              <select className="border-gold/20 focus:border-gold w-full appearance-none border-b bg-transparent py-3 text-sm transition-colors outline-none">
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="label-caps text-ink">Message (optional)</label>
              <textarea
                placeholder="Type your message here..."
                rows={4}
                className="border-gold/20 focus:border-gold placeholder:text-muted/40 w-full resize-none border-b bg-transparent py-3 text-sm transition-colors outline-none"
              />
            </div>
            <div className="pt-4 md:col-span-2">
              <button type="button" className={BTN_SOLID}>
                Send Inquiry
              </button>
            </div>
          </form>
        </div>
      </FadeInView>

      {/* Terms */}
      <div className="border-gold/35 border-t pt-20">
        <h2 className="text-ink mb-14 font-serif text-2xl md:text-3xl">
          Terms & Conditions
        </h2>
        <div className="text-muted grid grid-cols-1 gap-10 text-[12px] leading-relaxed md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          <div className="space-y-10 lg:col-span-2">
            <div>
              <h4 className="label-caps text-ink mb-4">Terms of Payment</h4>
              <ol className="list-decimal space-y-3 pl-4">
                <li>
                  Rental cost paid monthly in advance, by latest on 25th day of
                  the current month.
                </li>
                <li>
                  Refundable Security Deposit of 1 month rental cost, paid
                  before Lease Commencement Date.
                </li>
                <li>All costs are applicable to tax and service charge.</li>
              </ol>
            </div>
            <div>
              <h4 className="label-caps text-ink mb-4">Additional Cost</h4>
              <ol className="list-decimal space-y-2 pl-4">
                <li>Electricity</li>
              </ol>
            </div>
          </div>
          <div>
            <h4 className="label-caps text-ink mb-4">Included in Rental</h4>
            <ol className="list-decimal space-y-3 pl-4">
              <li>All units fully furnished</li>
              <li>
                Access to Pool, Gym, Restaurant, Business Center at TS Suites
              </li>
              <li>Parking spot for 1 vehicle</li>
              <li>Maintenance periodically</li>
              <li>Internet, TV, Water, Concierge</li>
            </ol>
          </div>
          <div>
            <h4 className="label-caps text-ink mb-4">Optional Services</h4>
            <ol className="list-decimal space-y-3 pl-4">
              <li>Laundry</li>
              <li>Housekeeping</li>
              <li>Breakfast</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
