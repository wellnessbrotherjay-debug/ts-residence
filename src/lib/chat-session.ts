import { v4 as uuidv4 } from 'uuid';

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = localStorage.getItem('tsr_chat_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('tsr_chat_session_id', sessionId);
  }
  return sessionId;
}
