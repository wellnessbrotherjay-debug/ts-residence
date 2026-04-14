"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Bell, MapPin } from "lucide-react";

const notifications = [
  { id: 1, message: "New inquiry for SOHO Apartment", location: "Perth, AU", time: "2 mins ago" },
  { id: 2, message: "Studio Apartment just viewed", location: "Singapore", time: "Just now" },
  { id: 3, message: "Someone is checking Solo units", location: "London, UK", time: "5 mins ago" },
  { id: 4, message: "WhatsApp chat started", location: "Jakarta, ID", time: "10 mins ago" },
  { id: 5, message: "Booking inquiry received", location: "Paris, FR", time: "1 min ago" },
];

export function UrgencyEngine() {
  const [index, setIndex] = useState(-1);
  const [show, setShow] = useState(false);
  const [liveEvents, setLiveEvents] = useState(notifications);

  const fetchLiveEvents = async () => {
    try {
      const res = await fetch('/api/dashboard/summary'); // Reusing existing summary endpoint if it has recent events
      if (res.ok) {
        const data = await res.json();
        if (data.recentEvents && data.recentEvents.length > 0) {
          const mapped = data.recentEvents.map((ev: any) => ({
             id: ev.id,
             message: ev.event_type === 'page_view' ? `Viewing ${ev.page.split('/').pop()} unit` : `Interested in ${ev.page.split('/').pop()}`,
             location: ev.metadata?.location || "Someone",
             time: "just now"
          }));
          setLiveEvents([...mapped, ...notifications].slice(0, 10));
        }
      }
    } catch (e) {}
  };

  const triggerNext = useCallback(() => {
    setShow(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % liveEvents.length);
      setShow(true);
      setTimeout(() => setShow(false), 6000);
    }, 4000);
  }, [liveEvents]);

  useEffect(() => {
    fetchLiveEvents();
    const startTimeout = setTimeout(triggerNext, 10000);
    const interval = setInterval(() => {
      fetchLiveEvents();
      triggerNext();
    }, 25000);
    return () => {
      clearTimeout(startTimeout);
      clearInterval(interval);
    };
  }, [triggerNext]);

  return (
    <div className="fixed bottom-6 left-6 z-100 pointer-events-none">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            className="bg-white/90 backdrop-blur-xl border border-gold/20 shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-4 rounded-xl flex items-start gap-4 max-w-[320px] pointer-events-auto"
          >
            <div className="bg-gold/10 p-2 rounded-full shrink-0">
               <Bell size={16} className="text-gold-dark" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-ink leading-tight">
                {liveEvents[index]?.message}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                  <MapPin size={10} /> {liveEvents[index]?.location}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {liveEvents[index]?.time}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
