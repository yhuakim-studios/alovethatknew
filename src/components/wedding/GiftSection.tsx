import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Gift, CreditCard, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function GiftSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", amount: "", message: "" });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.amount) {
      toast.error("Please fill in email and amount");
      return;
    }

    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount < 100) {
      toast.error("Minimum gift amount is ₦100");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("initialize-payment", {
        body: {
          email: form.email.trim(),
          amount,
          name: form.name.trim(),
          message: form.message.trim(),
        },
      });

      if (error) throw error;
      if (data?.authorization_url) {
        window.open(data.authorization_url, "_blank");
        toast.success("Redirecting to payment page...");
        setShowPayment(false);
        setForm({ name: "", email: "", amount: "", message: "" });
      } else {
        throw new Error(data?.error || "Payment initialization failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Payment failed. Please try again.");
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="gift" className="section-padding bg-primary text-primary-foreground" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-script text-3xl gold-text mb-2">With love</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">Bless Our Union</h2>
          <div className="gold-divider mt-6 mb-8" />
          <p className="font-body text-primary-foreground/70 max-w-lg mx-auto leading-relaxed">
            Your presence at our wedding is the greatest gift we could ask for. However, if you wish to bless our new home with a financial gift, you may do so using the options below.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="bg-primary-foreground/5 border border-gold/15 rounded-2xl p-8 text-left"
          >
            <Building2 className="text-gold mb-4" size={28} />
            <h3 className="font-display text-xl font-semibold mb-4">Bank Transfer</h3>
            <div className="space-y-2 font-body text-primary-foreground/70 text-sm">
              <p><span className="text-primary-foreground/40">Bank:</span> Contact for details</p>
              <p><span className="text-primary-foreground/40">Account:</span> Cynthia & Paul Wedding</p>
              <p><span className="text-primary-foreground/40">Number:</span> Contact coordinator</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="bg-primary-foreground/5 border border-gold/15 rounded-2xl p-8 text-left"
          >
            <CreditCard className="text-gold mb-4" size={28} />
            <h3 className="font-display text-xl font-semibold mb-4">Online Payment</h3>
            <p className="font-body text-primary-foreground/70 text-sm mb-6">
              Send a gift securely through Paystack.
            </p>

            {!showPayment ? (
              <button
                onClick={() => setShowPayment(true)}
                className="px-6 py-3 bg-gold text-accent-foreground font-body text-sm uppercase tracking-widest rounded-full hover:bg-gold-light transition-colors flex items-center gap-2"
              >
                <Gift size={16} />
                Send Gift
              </button>
            ) : (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                onSubmit={handlePayment}
                className="space-y-3 mt-2"
              >
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gold/20 bg-primary-foreground/5 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="Your name"
                />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gold/20 bg-primary-foreground/5 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="Email address"
                />
                <input
                  required
                  type="number"
                  min="100"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gold/20 bg-primary-foreground/5 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="Amount (₦)"
                />
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gold/20 bg-primary-foreground/5 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                  placeholder="Message for the couple (optional)"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-gold text-accent-foreground font-body text-sm uppercase tracking-widest rounded-lg hover:bg-gold-light transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Gift size={14} />}
                    {loading ? "Processing..." : "Pay Now"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPayment(false)}
                    className="px-4 py-2.5 border border-gold/20 text-primary-foreground/60 font-body text-sm rounded-lg hover:bg-primary-foreground/5 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
