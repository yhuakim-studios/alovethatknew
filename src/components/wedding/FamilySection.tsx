import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function FamilySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-primary text-primary-foreground" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-script text-3xl gold-text mb-2">Blessed by</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-10">Our Families</h2>
          <div className="gold-divider mb-12" />

          <div className="grid md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <h3 className="font-display text-xl font-semibold gold-text">Chief & Mrs. Ambrose Emeka Ngwu</h3>
              <p className="font-body text-primary-foreground/70 text-sm">Umumkpume Orba, Udenu L.G.A</p>
              <p className="font-body text-primary-foreground/50 text-xs">Enugu State</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <h3 className="font-display text-xl font-semibold gold-text">Late Chief & Mrs. Cletus Ngwu Ugwuaroh</h3>
              <p className="font-body text-primary-foreground/70 text-sm">Amanefi Ukehe, Igbo Etiti L.G.A</p>
              <p className="font-body text-primary-foreground/50 text-xs">Enugu State</p>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
            className="mt-10 font-body text-primary-foreground/60 text-sm italic"
          >
            This union is celebrated with the blessings of our families.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
