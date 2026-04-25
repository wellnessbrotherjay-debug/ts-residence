"use client";
import { useState, useRef, useEffect } from "react";
import { getOrCreateSessionId } from "@/lib/chat-session";

const SYSTEM_PROMPT = `You are TS Residence’s professional website assistant. You know everything about the apartments, amenities, pricing, location, and wellness benefits as described on the website. Help users navigate, answer questions, and always guide them to the most relevant page or action. Be friendly, concise, and focused on helping the user understand why TS Residence is the best choice for them. If you cannot answer, politely say: 'For more details or personal assistance, please contact our team on WhatsApp at +62 811 1902 8111.'`;


export default function ChatWidget() {

  const [open, setOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [messages, setMessages] = useState([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "assistant", content: "Hi! 👋 How can I help you with TS Residence today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState<string>(() => getOrCreateSessionId());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show greeting for 4 seconds
    const timer = setTimeout(() => setShowGreeting(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    // Get assistant reply
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages.filter(m => m.role !== "system") }),
    });
    const data = await res.json();
    const allMessages = [...newMessages, { role: "assistant", content: data.reply || "Sorry, something went wrong." }];
    setMessages(allMessages);
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    // Log chat to Supabase
    if (sessionId) {
      fetch("/api/chat/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          messages: [
            { role: "user", content: input },
            { role: "assistant", content: data.reply || "Sorry, something went wrong." },
          ],
          user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
          ip_address: "", // Optionally set on server
        }),
      });
    }
  }

  return (
    <>
      <div style={{ position: "fixed", bottom: 32, left: 32, zIndex: 9999 }}>
        {/* Greeting bubble */}
        {!open && showGreeting && (
          <div className="animate-fade-in-up mb-3 flex items-end justify-end">
            <div className="rounded-2xl bg-white px-4 py-3 shadow-xl border border-gold/30 text-black text-sm font-semibold max-w-xs">
              <span>👋 Hi there! How may I help you?</span>
            </div>
          </div>
        )}
        {/* Chatbot icon button */}
        {!open && (
          <button
            aria-label="Open chat"
            className="rounded-full bg-gold shadow-2xl p-0 w-16 h-16 flex items-center justify-center hover:scale-110 transition-all border-4 border-white"
            style={{ boxShadow: "0 4px 32px 0 rgba(0,0,0,0.18)" }}
            onClick={() => setOpen(true)}
          >
            {/* Chat bubble SVG icon */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="18" fill="#b8965a" />
              <path d="M11 15.5C11 13.0147 13.0147 11 15.5 11H20.5C22.9853 11 25 13.0147 25 15.5V20.5C25 22.9853 22.9853 25 20.5 25H15.5C13.0147 25 11 22.9853 11 20.5V15.5Z" fill="white"/>
              <ellipse cx="15.5" cy="18" rx="1.5" ry="1.5" fill="#b8965a"/>
              <ellipse cx="18" cy="18" rx="1.5" ry="1.5" fill="#b8965a"/>
              <ellipse cx="20.5" cy="18" rx="1.5" ry="1.5" fill="#b8965a"/>
            </svg>
          </button>
        )}
        {/* Chat window */}
        {open && (
          <div className="w-80 max-w-[90vw] rounded-2xl shadow-2xl border border-gold/30 bg-white flex flex-col overflow-hidden animate-fade-in-up">
            <div className="flex items-center justify-between bg-gold/10 px-4 py-2 border-b border-gold/20">
              <span className="font-bold text-gold">TS Residence Chat</span>
              <button onClick={() => setOpen(false)} className="text-xl font-bold text-gold/80 hover:text-gold">×</button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2 bg-[#f7f3ed]" style={{ maxHeight: 360 }}>
              {messages.filter(m => m.role !== "system").map((m, i) => (
                <div key={i} className={`my-2 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`px-3 py-2 rounded-xl text-sm ${m.role === "user" ? "bg-gold/80 text-black" : "bg-white text-black border border-gold/10"}`}>{m.content}</div>
                </div>
              ))}
              {loading && (
                <div className="my-2 flex justify-start"><div className="px-3 py-2 rounded-xl text-sm bg-white border border-gold/10 text-black opacity-60">...</div></div>
              )}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={sendMessage} className="flex gap-2 p-2 border-t border-gold/20 bg-white">
              <input
                className="flex-1 rounded-lg border border-gold/20 px-3 py-2 text-sm focus:outline-gold"
                placeholder="Type your question..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
                autoFocus={open}
              />
              <button
                type="submit"
                className="bg-gold text-black font-bold px-4 py-2 rounded-lg hover:bg-gold/80 disabled:opacity-50"
                disabled={loading || !input.trim()}
              >Send</button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
