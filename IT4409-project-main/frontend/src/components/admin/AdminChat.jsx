import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  adminEndSupport,
  adminJoinSupport,
  adminSendMessage,
  fetchChatHistoryForAdmin,
  fetchConversationsForAdmin,
} from "../../api/chatApi";

export default function AdminChat() {
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [supportChanging, setSupportChanging] = useState(false);
  const pollIntervalRef = useRef(null);

  const loadMessages = useCallback(async (userId) => {
    if (!userId) return;
    setLoadingMessages(true);
    try {
      const data = await fetchChatHistoryForAdmin(userId);
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages for admin", err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const loadConversations = useCallback(async (options = {}) => {
    setLoadingConversations(true);
    try {
      const data = await fetchConversationsForAdmin();
      setConversations(data);

      if (options.syncSelected && selectedUserId) {
        const matched = data.find((item) => item.userId === selectedUserId);
        if (matched) {
          setSelectedUserInfo(matched);
        }
      } else if (!selectedUserId && data.length > 0) {
        const firstConversation = data[0];
        setSelectedUserId(firstConversation.userId);
        setSelectedUserInfo(firstConversation);
        loadMessages(firstConversation.userId);
      }
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setLoadingConversations(false);
    }
  }, [loadMessages, selectedUserId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!selectedUserId) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return undefined;
    }

    const poll = () => {
      loadMessages(selectedUserId);
      loadConversations({ syncSelected: true });
    };

    poll();

    if (!pollIntervalRef.current) {
      pollIntervalRef.current = setInterval(poll, 5000);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [loadConversations, loadMessages, selectedUserId]);

  const handleSelectUser = useCallback((conversation) => {
    setSelectedUserId(conversation.userId);
    setSelectedUserInfo(conversation);
    loadMessages(conversation.userId);
  }, [loadMessages]);

  const handleJoinSupport = async () => {
    if (!selectedUserId || supportChanging) return;
    setSupportChanging(true);
    try {
      await adminJoinSupport(selectedUserId);
      await loadConversations({ syncSelected: true });
    } catch (err) {
      console.error("Failed to join support", err);
    } finally {
      setSupportChanging(false);
    }
  };

  const handleEndSupport = async () => {
    if (!selectedUserId || supportChanging) return;
    setSupportChanging(true);
    try {
      await adminEndSupport(selectedUserId);
      await loadConversations({ syncSelected: true });
    } catch (err) {
      console.error("Failed to end support", err);
    } finally {
      setSupportChanging(false);
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (!selectedUserId || !input.trim() || sending) return;

    const content = input.trim();
    setInput("");
    setSending(true);

    try {
      await adminSendMessage(selectedUserId, content);
      const data = await fetchChatHistoryForAdmin(selectedUserId);
      setMessages(data);
      loadConversations();
    } catch (err) {
      console.error("Failed to send admin message", err);
    } finally {
      setSending(false);
    }
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredConversations = conversations.filter((conversation) => {
    if (!normalizedSearch) return true;
    const target = (
      conversation.fullname ||
      conversation.username ||
      conversation.email ||
      ""
    )
      .toString()
      .toLowerCase();

    return target.includes(normalizedSearch);
  });

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-xl shadow-slate-200/40 backdrop-blur">
      <div className="grid h-[76vh] lg:grid-cols-[340px_1fr]">
        <div className="flex flex-col border-b border-slate-100 lg:border-b-0 lg:border-r">
          <div className="space-y-3 border-b border-slate-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_70%)] p-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Hỗ trợ khách hàng
              </div>
              <h2 className="mt-1 font-display text-2xl font-black text-slate-950">
                Live chat
              </h2>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Khách hàng</h3>
              <button
                type="button"
                onClick={loadConversations}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
              >
                Làm mới
              </button>
            </div>

            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-orange-300 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
              placeholder="Tim theo ten / email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto bg-white">
            {loadingConversations && (
              <div className="p-4 text-sm text-slate-400">Đang tải hội thoại...</div>
            )}

            {filteredConversations.map((conversation) => (
              <button
                key={conversation.userId}
                type="button"
                onClick={() => handleSelectUser(conversation)}
                className={`w-full border-b border-slate-100 px-4 py-4 text-left transition-colors hover:bg-slate-50 ${
                  conversation.userId === selectedUserId
                    ? "bg-orange-50/70"
                    : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 truncate font-semibold text-slate-900">
                    {conversation.fullname ||
                      conversation.username ||
                      conversation.email ||
                      conversation.userId}
                  </div>
                  {conversation.unreadCount > 0 ? (
                    <span className="shrink-0 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      {conversation.unreadCount}
                    </span>
                  ) : null}
                </div>
                <div className="mt-1 truncate text-xs text-slate-500">
                  {conversation.lastRole === "user" ? "KH: " : "Admin: "}
                  {conversation.lastMessage}
                </div>
                <div className="mt-2 space-y-1 text-[11px] text-slate-400">
                  {conversation.lastOrderCode ? (
                    <div className="font-semibold text-orange-600">
                      Đơn #{conversation.lastOrderCode}
                    </div>
                  ) : null}
                  <div>
                    {conversation.lastAt
                      ? new Date(conversation.lastAt).toLocaleString()
                      : ""}
                  </div>
                  {conversation.currentAdminName ? (
                    <div
                      className={
                        conversation.isHandledByMe ? "text-emerald-600" : ""
                      }
                    >
                      Đang được hỗ trợ bởi: {conversation.currentAdminName}
                      {conversation.isHandledByMe && " (ban)"}
                    </div>
                  ) : conversation.lastAdminName ? (
                    <div>Admin gan nhat: {conversation.lastAdminName}</div>
                  ) : null}
                </div>
              </button>
            ))}

            {!loadingConversations && conversations.length === 0 && (
              <div className="p-4 text-sm text-slate-400">Chưa có hội thoại nào.</div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 bg-[linear-gradient(135deg,#ffffff_0%,#fff7ed_100%)] p-4">
            {selectedUserInfo ? (
              <>
                <div>
                  <div className="text-lg font-bold text-slate-950">
                    {selectedUserInfo.fullname ||
                      selectedUserInfo.username ||
                      selectedUserInfo.email ||
                      selectedUserInfo.userId}
                  </div>
                  <div className="text-xs text-slate-500">
                    ID: {selectedUserInfo.userId}
                  </div>
                  {selectedUserInfo.lastOrderCode ? (
                    <div className="mt-1 text-xs font-semibold text-orange-600">
                      Đang có câu hỏi về đơn #{selectedUserInfo.lastOrderCode}
                    </div>
                  ) : null}
                  {selectedUserInfo.currentAdminName ? (
                    <div className="mt-1 text-xs text-slate-500">
                      Đang được hỗ trợ bởi: {selectedUserInfo.currentAdminName}
                      {selectedUserInfo.isHandledByMe && " (ban)"}
                    </div>
                  ) : selectedUserInfo.lastAdminName ? (
                    <div className="mt-1 text-xs text-slate-500">
                      Admin gan nhat: {selectedUserInfo.lastAdminName}
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  {selectedUserInfo.isHandledByMe ? (
                    <button
                      type="button"
                      onClick={handleEndSupport}
                      disabled={supportChanging}
                      className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-60"
                    >
                      Ket thuc ho tro
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleJoinSupport}
                      disabled={supportChanging}
                      className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-100 disabled:opacity-60"
                    >
                      Nhan ho tro
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-400">
                Chọn một khách hàng để xem hội thoại.
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/80 px-4 py-4 text-sm">
            {loadingMessages && (
              <div className="text-xs text-slate-400">Đang tải tin nhắn...</div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm shadow-sm ${
                    message.role === "user"
                      ? "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                      : "rounded-br-md bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                  }`}
                >
                  {message.orderCode ? (
                    <div className="mb-1 text-[10px] font-semibold uppercase opacity-75">
                      Đơn #{message.orderCode}
                    </div>
                  ) : null}
                  {message.content}
                </div>
              </div>
            ))}

            {!loadingMessages && messages.length === 0 && selectedUserId && (
              <div className="text-xs text-slate-400">Chưa có tin nhắn nào.</div>
            )}
          </div>

          <form onSubmit={handleSend} className="border-t border-slate-100 bg-white p-4">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-orange-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
                placeholder={
                  selectedUserId
                    ? "Nhập nội dung trả lời..."
                    : "Chọn một khách hàng để bắt đầu chat"
                }
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={!selectedUserId || sending}
              />
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-[1.01] disabled:opacity-60"
                disabled={!selectedUserId || sending || !input.trim()}
              >
                Gui
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
