import React, { useEffect, useState, useRef } from "react";
import { fetchChatHistory, sendChatMessage, fetchSupportStatus } from "../../api/chatApi";
import { FiMessageSquare, FiX, FiSend } from "react-icons/fi";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return !!localStorage.getItem("token");
    } catch (e) {
      return false;
    }
  });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [supportInfo, setSupportInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);


  useEffect(() => {
    const updateAuth = () => {
      try {
        setIsLoggedIn(!!localStorage.getItem("token"));
      } catch (e) {
        setIsLoggedIn(false);
      }
    };

    window.addEventListener("storage", updateAuth);
    window.addEventListener("authChanged", updateAuth);
    updateAuth();

    return () => {
      window.removeEventListener("storage", updateAuth);
      window.removeEventListener("authChanged", updateAuth);
    };
  }, []);

  // Auto scroll to bottom 
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const loadData = async () => {
      try {
        const history = await fetchChatHistory();
        setMessages(history);
        try {
          const status = await fetchSupportStatus();
          setSupportInfo(status);
        } catch (e) {
          console.error("Failed to load support status", e);
        }
      } catch (err) {
        console.error("Failed to load chat history", err);
      } finally {
        setInitialLoaded(true);
        setLoading(false);
      }
    };

    if (isOpen && !initialLoaded) {
      setLoading(true);
      loadData();
    }

    // tự động cập nhật tin nhắn khi cửa sổ đang mở
    if (isOpen && !pollIntervalRef.current) {
      pollIntervalRef.current = setInterval(() => {
        loadData();
      }, 5000);
    }

    if (!isOpen && pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    return () => {
      if (pollIntervalRef.current && !isOpen) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [isOpen, isLoggedIn, initialLoaded]);

  const handleSend = async (e) => {
    e?.preventDefault?.();
    if (!input.trim() || !isLoggedIn || loading) return;

    const content = input.trim();
    setInput("");
    setLoading(true);

    try {

      const optimisticUserMsg = {
        id: `tmp-${Date.now()}`,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticUserMsg]);

      await sendChatMessage(content);
      const history = await fetchChatHistory();
      setMessages(history);
    } catch (err) {
      console.error("Failed to send chat message", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content:
            "Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          aria-label="Mở chat hỗ trợ"
        >
          <FiMessageSquare size={24} />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-sky-600 text-white rounded-t-xl">
            <div>
              <div className="font-semibold text-sm">Hỗ trợ khách hàng</div>
              <div className="text-xs text-sky-100">
                {supportInfo?.currentAdmin?.displayName
                  ? `Đang được hỗ trợ bởi: ${supportInfo.currentAdmin.displayName}`
                  : supportInfo?.lastAdmin?.displayName
                  ? `Hỗ trợ gần nhất: ${supportInfo.lastAdmin.displayName}`
                  : "Trao đổi với quản trị viên về sản phẩm, đơn hàng..."}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sky-100 hover:text-white"
              aria-label="Đóng chat"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 text-sm bg-gray-50">
            {loading && messages.length === 0 && (
              <div className="text-xs text-gray-400 text-center mt-4">
                Đang tải lịch sử chat...
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg whitespace-pre-wrap text-xs ${
                    m.role === "user"
                      ? "bg-sky-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {/*  */}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="border-t p-2 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 text-xs px-3 py-2 border rounded-full focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="Nhập câu hỏi của bạn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white rounded-full w-9 h-9 flex items-center justify-center disabled:opacity-60"
                disabled={loading || !input.trim()}
              >
                <FiSend size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
