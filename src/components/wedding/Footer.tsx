import { Heart, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 px-6 text-center">
      <p className="font-script text-4xl gold-text mb-4">Cynthia & Paul</p>
      <p className="font-body text-primary-foreground/60 text-sm mb-6">
        Thank you for being part of our special day.
      </p>
      <div className="flex items-center justify-center gap-2 text-primary-foreground/50 text-sm font-body mb-8">
        <Phone size={14} />
        <span>Wedding Coordinator: +234 XXX XXX XXXX</span>
      </div>
      <div className="gold-divider mb-6" />
      <p className="font-body text-primary-foreground/40 text-xs flex items-center justify-center gap-1">
        Made with <Heart size={12} className="text-gold" fill="currentColor" /> Cynthia & Paul © 2026
      </p>
    </footer>
  );
}
