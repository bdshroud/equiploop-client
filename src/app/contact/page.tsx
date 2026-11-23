"use client";

import * as React from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Thank you! Your inquiry has been dispatched to our fleet operations desk.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background py-12 sm:py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-text mb-1">
            Dispatch & Support Desk
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Contact EquipLoop
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Have questions regarding machine availability, job-site delivery logistics, or listing your fleet? We&apos;re here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Direct Contact Info */}
          <div className="space-y-4">
            <Card className="p-6 rounded-2xl border-border bg-card shadow-xs space-y-4">
              <h2 className="font-bold text-base text-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-text" />
                <span>Headquarters</span>
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                EquipLoop Commercial Machinery Inc.<br />
                8400 Industrial Blvd, Suite 200<br />
                Austin, TX 78744
              </p>
            </Card>

            <Card className="p-6 rounded-2xl border-border bg-card shadow-xs space-y-4">
              <h2 className="font-bold text-base text-foreground flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-text" />
                <span>Direct Hotline</span>
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Toll Free: +1 (800) 412-LOOP<br />
                Direct Fleet Desk: +1 (512) 555-0144
              </p>
            </Card>

            <Card className="p-6 rounded-2xl border-border bg-card shadow-xs space-y-4">
              <h2 className="font-bold text-base text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-text" />
                <span>Operating Hours</span>
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Mon - Fri: 6:00 AM - 8:00 PM CST<br />
                Sat: 7:00 AM - 4:00 PM CST<br />
                Emergency on-site swap: 24/7
              </p>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-2 p-6 sm:p-8 rounded-2xl border-border bg-card shadow-xs">
            <h2 className="font-bold text-lg text-foreground mb-1">Send a Message</h2>
            <p className="text-xs text-muted-foreground mb-6">
              Our fleet coordinators typically respond within 30 minutes during active yard hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Your Name *</label>
                  <Input
                    type="text"
                    placeholder="e.g. John Miller"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Email Address *</label>
                  <Input
                    type="email"
                    placeholder="contractor@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Subject</label>
                <Input
                  type="text"
                  placeholder="e.g. Inquiring about excavator delivery in North Austin"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Message *</label>
                <textarea
                  rows={4}
                  placeholder="Describe your equipment requirement, project duration, or inquiry..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full p-3 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-amber"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full sm:w-auto font-bold bg-amber text-graphite hover:bg-amber/90 text-xs px-8"
              >
                {loading ? "Transmitting..." : "Send Dispatch Inquiry"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
