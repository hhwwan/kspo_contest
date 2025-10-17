import React, { useState } from "react";
import './Chatbot.css'

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    
    const handleSend = async () => {
        if (!input.trim()) return;

        // 내 메시지 추가
        const newMessage = { role: "user", text: input };
        setMessages((prev) => [...prev, newMessage]);

        // input 초기화
        setInput("");
        const hostname = window.location.hostname;
        const API_URL = "/api/chat";
        
        try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input }),
        });
        const data = await response.json();

        // 챗봇 응답 추가
        setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
        } catch (error) {
        console.error("Error:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
        {/* 채팅 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg, idx) => (
            <div
                key={idx}
                className={`p-2 rounded-lg max-w-xs ${
                msg.role === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-300 text-black self-start"
                }`}
            >
                {msg.text}
            </div>
            ))}
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
