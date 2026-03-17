import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Church, MapPin, PartyPopper } from "lucide-react";
import coupleHero from "@/assets/hero.jpg";
import coupleStory from "@/assets/story.jpg";

const events = [
  {
    icon: Church,
    title: "Holy Matrimony",
    venue: "Christ The King Parish",
    location: "Odenigbo, Nsukka",
    time: "10:00 AM",
    date: "APR 7TH",
    image: coupleHero,
    mapLink: "https://maps.google.com/?q=Christ+The+King+Parish+Nsukka",
  },
  {
    icon: PartyPopper,
    title: "Reception",
    venue: "Amawukwu Primary School Field",
    location: "Orba",
    time: "AFTER MASS",
    date: "APR 7TH",
    image: coupleStory,
    mapLink: "https://maps.google.com/?q=Orba+Nsukka",
  },
];

const colors = [
  { name: "Dark Brown", color: "bg-brown" },
  { name: "Lilac", color: "bg-lilac" },
  { name: "White", color: "bg-background border border-border" },
  { name: "Green", color: "bg-wedding-green" },
];

export default function WeddingDetails() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="details" className="section-padding bg-background" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-script text-3xl gold-text mb-2">Save the Date</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground font-bold">
            Wedding Details
          </h2>
          <div className="gold-divider mt-6" />
        </motion.div>

        {/* Event Cards - Inspired layout with background images */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {events.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.2 }}
              className="relative group rounded-2xl overflow-hidden aspect-[4/5] md:aspect-[3/4] shadow-lg"
            >
              {/* Background Image */}
              <img
                src={event.image}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 backdrop-blur-[2px]" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                {/* Icon Circle */}
                <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center mb-6 backdrop-blur-sm bg-white/5">
                  <event.icon className="text-white" size={24} />
                </div>

                {/* Script Title */}
                <h3 className="font-script text-4xl md:text-5xl text-white mb-4">
                  {event.title}
                </h3>

                {/* Date & Time */}
                <p className="text-white/80 text-sm tracking-[0.2em] uppercase font-body mb-6">
                  {event.date} • {event.time}
                </p>

                {/* Divider */}
                <div className="w-16 h-px bg-white/30 mb-6" />

                {/* Venue */}
                <h4 className="font-display text-xl md:text-2xl text-white font-semibold mb-2">
                  {event.venue}
                </h4>
                <p className="text-white/60 font-body text-sm mb-8">
                  {event.location}
                </p>

                {/* View Map Button */}
                <a
                  href={event.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/30 text-white text-xs tracking-[0.15em] uppercase font-body backdrop-blur-sm bg-white/5 hover:bg-white/15 transition-colors duration-300"
                >
                  <MapPin size={14} />
                  View Map
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Colours of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="font-script text-3xl gold-text mb-2">What to Wear</p>
          <h3 className="font-display text-3xl md:text-4xl text-foreground font-bold mb-10">
            Colours of the Day
          </h3>
          <div className="gold-divider mb-12" />

          <div className="flex justify-center gap-4 md:gap-0 flex-wrap">
            {colors.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
                className="relative group flex flex-col items-center"
              >
                <div className="relative mx-4 md:mx-6">
                  <div
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${c.color} shadow-lg group-hover:scale-110 transition-transform duration-500`}
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-gold/20 scale-[1.2] group-hover:scale-[1.35] group-hover:border-gold/40 transition-all duration-500" />
                  <div className="absolute inset-0 rounded-full border border-gold/10 scale-[1.4] group-hover:scale-[1.55] transition-all duration-700" />
                </div>
                <span className="mt-5 font-display text-sm text-foreground font-medium tracking-wide">
                  {c.name}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.4 }}
            className="mt-10 text-sm text-muted-foreground font-body max-w-md mx-auto leading-relaxed"
          >
            We'd love for our guests to complement the celebration by
            incorporating these colours into their outfits.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
