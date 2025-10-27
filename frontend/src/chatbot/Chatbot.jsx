import React, { useState, useEffect } from "react";
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showAlert, setShowAlert] = useState(true); // 입장 시 알림 표시

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botReply = data.reply.replace(/\n/g, "<br/>");
      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleBack = () => window.history.back();

  return (
    <div className="chat-container flex flex-col h-screen bg-gray-100">
      {/* 상단 알림 */}
      {showAlert && (
        <div className="chat-alert">
          사이트에 궁금한 점을 물어보세요
        </div>
      )}

      {/* 헤더 */}
      <div className="p-3 bg-gray-200 border-b flex items-center">
        <button
          onClick={handleBack}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          돌아가기
        </button>
        <h2 className="ml-4 font-bold text-lg text-black">챗봇</h2>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 rounded-2xl max-w-xs break-words ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-300 text-black rounded-bl-none"
              }`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          </div>
        ))}
      </div>

      {/* 💡 예시 질문 목록 */}
      <div className="example-questions p-3 bg-gray-50 border-t">
        <p className="font-semibold text-gray-700 mb-2">이런 질문을 해보세요 👇</p>
        <div className="flex flex-wrap gap-2">
          {["실내운동 추천해줘", "실외운동 추천해줘"].map((q, idx) => (
            <span
              key={idx}
              onClick={() => setInput(q)}
              className="cursor-pointer bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition"
            >
              {q}
            </span>
          ))}
        </div>
      </div>

      {/* 입력창 */}
      <div className="p-3 bg-white border-t flex">
        <input
          type="text"
          className="flex-1 border rounded-lg px-3 py-2 mr-2 focus:outline-none"
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          전송
        </button>
      </div>
    </div>
  );
}

export default Chatbot;