import { motion } from "framer-motion";
import heroImg from "@/assets/hero2.jpg";
import { Heart } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Cynthia & Paul"
          className="w-full h-full object-cover object-[50%_20%]"
        />
        <div className="absolute inset-0 bg-primary/50" />
      </div>

      {/* Falling petals */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${8 + i * 8}%`,
            top: `-5%`,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, Math.sin(i) * 40, 0],
            rotate: [0, 360],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "linear",
          }}
        >
          <Heart
            size={10 + Math.random() * 8}
            className="text-gold/40"
            fill="currentColor"
          />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-body text-sm md:text-base tracking-[0.4em] uppercase text-primary-foreground/70 mb-6"
        >
          The Wedding Of
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="relative"
        >
          {/* Decorative diamonds */}
          <motion.span
            className="absolute left-0 top-1/2 -translate-y-1/2 text-primary-foreground/60 text-3xl md:text-4xl"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            ◈
          </motion.span>
          <motion.span
            className="absolute right-0 top-1/2 -translate-y-1/2 text-primary-foreground/60 text-3xl md:text-4xl"
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            ◈
          </motion.span>

          <h1 className="font-script text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-primary-foreground text-shadow-hero leading-tight px-10">
            Cynthia <span className="gold-gradient-text">&</span> Paul
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-8"
        >
          <p className="font-body text-primary-foreground/70 tracking-[0.5em] text-sm md:text-base">
            07 &nbsp;.&nbsp; 04 &nbsp;.&nbsp; 2026
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <a
            href="#details"
            className="px-8 py-3 bg-gold text-accent-foreground font-body text-sm uppercase tracking-widest rounded-full hover:bg-gold-light transition-colors"
          >
            View Details
          </a>
          <a
            href="#rsvp"
            className="px-8 py-3 border border-primary-foreground/30 text-primary-foreground font-body text-sm uppercase tracking-widest rounded-full hover:bg-primary-foreground/10 transition-colors"
          >
            RSVP Now
          </a>
        </motion.div>
      </div>

      {/* Curved bottom transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L0 80C240 20 480 0 720 0C960 0 1200 20 1440 80L1440 120H0Z"
            fill="hsl(var(--cream))"
          />
        </svg>
      </div>
    </section>
  );
}
