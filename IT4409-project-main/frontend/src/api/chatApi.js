import axios from "axios";
import { buildApiUrl } from "../config/api";

export async function fetchChatHistory() {
  const res = await axios.get(buildApiUrl("/chat/history"));
  return Array.isArray(res.data?.messages) ? res.data.messages : [];
}

export async function sendChatMessage(message) {
  const res = await axios.post(buildApiUrl("/chat"), { message });
  return res.data?.message || null;
}

export async function fetchSupportStatus() {
  const res = await axios.get(buildApiUrl("/chat/support-status"));
  return res.data || { currentAdmin: null, lastAdmin: null };
}

export async function fetchConversationsForAdmin() {
  const res = await axios.get(buildApiUrl("/admin/chat/conversations"));
  return Array.isArray(res.data?.conversations) ? res.data.conversations : [];
}

export async function fetchChatHistoryForAdmin(userId) {
  const res = await axios.get(buildApiUrl(`/admin/chat/${userId}`));
  return Array.isArray(res.data?.messages) ? res.data.messages : [];
}

export async function adminSendMessage(userId, message) {
  const res = await axios.post(buildApiUrl(`/admin/chat/${userId}`), {
    message,
  });
  return res.data?.message || null;
}

export async function adminJoinSupport(userId) {
  const res = await axios.post(buildApiUrl(`/admin/chat/${userId}/join`));
  return res.data;
}

export async function adminEndSupport(userId) {
  const res = await axios.post(buildApiUrl(`/admin/chat/${userId}/end`));
  return res.data;
}
