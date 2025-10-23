import React, { useState } from "react";
import './Chatbot.css';

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

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
            const botReply = data.reply.replace(/\n/g, "<br/>"); // 줄바꿈 처리

            setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleBack = () => window.history.back();

    return (
        <div className="chat-container flex flex-col h-screen bg-gray-100">
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
