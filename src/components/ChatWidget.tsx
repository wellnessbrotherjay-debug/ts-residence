"use client";
import { useState, useRef, useEffect } from "react";
import { getOrCreateSessionId } from "@/lib/chat-session";

const SYSTEM_PROMPT = `You are TS Residence’s professional website assistant. You know everything about the apartments, amenities, pricing, location, and wellness benefits as described on the website. Help users navigate, answer questions, and always guide them to the most relevant page or action. Be friendly, concise, and focused on helping the user understand why TS Residence is the best choice for them. If you cannot answer, politely say: 'For more details or personal assistance, please contact our team on WhatsApp at +62 811 1902 8111.'`;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "assistant", content: "Hi! 👋 How can I help you with TS Residence today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
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
      <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 50 }}>
        {!open && (
          <button
            aria-label="Open chat"
            className="rounded-full bg-gold shadow-lg p-0 w-14 h-14 flex items-center justify-center hover:scale-105 transition"
            onClick={() => setOpen(true)}
          >
            <span className="text-3xl">💬</span>
          </button>
        )}
        {open && (
          <div className="w-80 max-w-[90vw] rounded-2xl shadow-2xl border border-gold/30 bg-white flex flex-col overflow-hidden">
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
