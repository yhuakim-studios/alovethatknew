import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import storyImg from "@/assets/couple-story.jpg";

export default function LoveStory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="story" className="section-padding bg-cream overflow-hidden" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-script text-3xl gold-text mb-2">How it all began</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground font-bold">Our Journey</h2>
          <div className="gold-divider mt-6" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img src={storyImg} alt="Our love story" className="w-full h-[500px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
            {/* Decorative frame */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-gold/40 rounded-tl-2xl" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-gold/40 rounded-br-2xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="space-y-6"
          >
            <p className="font-body text-muted-foreground leading-relaxed text-lg">
              Our love story is one beautifully written by God. What began as a simple connection grew into a deep friendship and a lifelong commitment.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed text-lg">
              Through every moment shared, we discovered a bond that felt perfectly crafted for us. Truly it's a ride worthwhile which we responded to and today, God has brought us to celebrate togetherness forever.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed text-lg">
              Today, surrounded by family and friends, we celebrate the love that brought us together and the future we will build side by side.
            </p>
            <div className="pt-4">
              <p className="font-script text-3xl gold-text">Forever & Always</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
