"use client";
import { useEffect, useState } from "react";

interface ChatSession {
  id: string;
  created_at: string;
  last_active: string;
  user_agent?: string;
}
interface ChatMessage {
  id: number;
  session_id: string;
  role: string;
  content: string;
  created_at: string;
}

export default function ChatHistoryPanel() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      const response = await fetch("/api/admin/chat/sessions", {
        credentials: "same-origin",
      });
      if (response.ok) {
        const data = (await response.json()) as ChatSession[];
        setSessions(data);
      }
      setLoading(false);
    };
    fetchSessions();
  }, []);

  const fetchMessages = async (session_id: string) => {
    setSelected(session_id);
    setLoading(true);
    const response = await fetch(`/api/admin/chat/messages/${session_id}`, {
      credentials: "same-origin",
    });
    if (response.ok) {
      const data = (await response.json()) as ChatMessage[];
      setMessages(data);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#181818] rounded-xl p-8 border border-gold/10 text-white">
      <h2 className="mb-2 text-2xl font-bold">Chatbot Conversations</h2>
      <p className="mb-8 text-base text-white/60">Browse all chat sessions and review message history.</p>
      <div className="flex gap-8">
        <div className="w-1/3 min-w-[220px] max-h-[60vh] overflow-y-auto border-r border-gold/10 pr-4">
          {loading && <div className="text-gold">Loading...</div>}
          {sessions.map((s) => (
            <div
              key={s.id}
              className={`p-3 mb-2 rounded-lg cursor-pointer ${selected === s.id ? "bg-gold/10 border border-gold/40" : "hover:bg-gold/5"}`}
              onClick={() => fetchMessages(s.id)}
            >
              <div className="font-mono text-xs text-gold">{s.id.slice(0, 8)}...</div>
              <div className="text-xs">Created: {new Date(s.created_at).toLocaleString()}</div>
              <div className="text-xs">Last: {new Date(s.last_active).toLocaleString()}</div>
              <div className="text-xs text-white/40 truncate">{s.user_agent?.slice(0, 40)}</div>
            </div>
          ))}
        </div>
        <div className="flex-1 max-h-[60vh] overflow-y-auto bg-[#111] rounded-xl p-4 border border-gold/10">
          {selected && messages.length === 0 && !loading && <div className="text-white/40 italic">No messages in this session.</div>}
          {messages.map((m) => (
            <div key={m.id} className={`my-2 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-3 py-2 rounded-xl text-sm ${m.role === "user" ? "bg-gold/80 text-black" : "bg-white text-black border border-gold/10"}`}>{m.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
