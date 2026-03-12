import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function RSVPSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", guests: "1", attending: "yes" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("rsvps").insert({
        name: form.name.trim(),
        phone: form.phone.trim(),
        guests: parseInt(form.guests),
        attending: form.attending === "yes",
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Thank you for confirming your attendance!");
    } catch (err: any) {
      toast.error("Something went wrong. Please try again.");
      console.error("RSVP error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rsvp" className="section-padding bg-cream" ref={ref}>
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="font-script text-3xl gold-text mb-2">We'd love to see you</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground font-bold">Confirm Attendance</h2>
          <div className="gold-divider mt-6" />
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <CheckCircle className="mx-auto text-gold mb-4" size={48} />
            <h3 className="font-display text-2xl text-foreground font-semibold">Thank You!</h3>
            <p className="font-body text-muted-foreground mt-2">We look forward to celebrating with you.</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-background p-8 md:p-10 rounded-2xl shadow-lg border border-gold/10 space-y-6"
          >
            <div>
              <label className="block font-body text-sm text-muted-foreground mb-2 uppercase tracking-wider">Full Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block font-body text-sm text-muted-foreground mb-2 uppercase tracking-wider">Phone Number</label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
                placeholder="+234 XXX XXX XXXX"
              />
            </div>
            <div>
              <label className="block font-body text-sm text-muted-foreground mb-2 uppercase tracking-wider">Number of Guests</label>
              <select
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-body text-sm text-muted-foreground mb-2 uppercase tracking-wider">Will you attend?</label>
              <div className="flex gap-4">
                {["yes", "no"].map((val) => (
                  <label
                    key={val}
                    className={`flex-1 text-center py-3 rounded-lg border cursor-pointer font-body text-sm uppercase tracking-wider transition-all ${
                      form.attending === val
                        ? "bg-gold text-accent-foreground border-gold"
                        : "border-border text-muted-foreground hover:border-gold/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="attending"
                      value={val}
                      checked={form.attending === val}
                      onChange={(e) => setForm({ ...form, attending: e.target.value })}
                      className="sr-only"
                    />
                    {val === "yes" ? "Joyfully Accept" : "Regretfully Decline"}
                  </label>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-primary-foreground font-body text-sm uppercase tracking-widest rounded-lg hover:bg-brown-light transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {loading ? "Submitting..." : "Confirm Attendance"}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
}
