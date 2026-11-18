"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const REVIEWS = [
  {
    name: "Marcus Vance",
    role: "Project Manager, Lone Star Foundations",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    equipment: "Caterpillar 305.5E2 Mini Excavator",
    quote: "We needed a compact excavator delivered to our downtown Austin high-rise site within 18 hours. EquipLoop hooked us up with Apex Machinery, and the machine was delivered fueled and ready to dig.",
  },
  {
    name: "Elena Rostova",
    role: "Production Director, Horizon Festivals",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    equipment: "JBL PRX ONE & Honda EU7000iS",
    quote: "Organizing multi-day outdoor events requires dependable power and sound that won't clip. The Honda inverter generators and PA systems from EquipLoop ran flawlessly through 95-degree Texas heat.",
  },
  {
    name: "Derrick Hayes",
    role: "Lead Foreman, Hayes Commercial Framing",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    equipment: "Genie GS-1930 Scissor Lift",
    quote: "Instead of calling three different rental yards and waiting on faxed quote forms, I reserved two Genie scissor lifts right from my phone at 6 AM. The digital inspection checklist made check-in painless.",
  },
  {
    name: "Sarah Chen",
    role: "Director of Photography, Redline Media Group",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    equipment: "Sony FX6 Cinema Camera Package",
    quote: "EquipLoop gave us access to a complete Sony FX6 full-frame rig with GM prime lenses for a national commercial shoot. The equipment was impeccably maintained, fully calibrated, and arrived right on schedule.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-20 bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-amber mb-1.5">
            Verified Contractor Feedback
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Customer Reviews & Testimonials
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Read what site superintendents, trade pros, cinema directors, and event leads have to say about EquipLoop rentals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((rev, idx) => (
            <motion.div
              key={rev.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-6 rounded-2xl bg-card border border-border flex flex-col justify-between shadow-xs hover:border-amber/40 transition-colors h-full"
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber text-amber" />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-muted-foreground/30" />
                </div>

                {/* Review Text */}
                <p className="text-xs text-muted-foreground leading-relaxed italic mb-6">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              {/* Author & Equipment Tag */}
              <div className="pt-4 border-t border-border/60">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={rev.avatar} alt={rev.name} />
                    <AvatarFallback className="bg-graphite text-white text-xs font-bold">
                      {rev.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-foreground truncate">{rev.name}</h4>
                    <p className="text-[10px] text-muted-foreground truncate">{rev.role}</p>
                  </div>
                </div>
                <div className="mt-2 text-[10px] font-medium text-amber bg-amber/10 px-2 py-0.5 rounded truncate">
                  Rented: {rev.equipment}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
