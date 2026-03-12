import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const WEDDING_DATE = new Date("2026-04-07T10:00:00+01:00").getTime();

function getTimeLeft() {
  const now = Date.now();
  const diff = Math.max(0, WEDDING_DATE - now);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown() {
  const [time, setTime] = useState(getTimeLeft());
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <section className="section-padding bg-cream" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-script text-3xl gold-text mb-2">Counting down to</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground font-bold mb-12">Forever</h2>
        </motion.div>

        <div className="flex justify-center gap-4 md:gap-8">
          {units.map((u, i) => (
            <motion.div
              key={u.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                <span className="font-display text-3xl md:text-5xl font-bold text-primary-foreground">
                  {String(u.value).padStart(2, "0")}
                </span>
              </div>
              <span className="mt-3 font-body text-xs md:text-sm text-muted-foreground uppercase tracking-widest">
                {u.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
