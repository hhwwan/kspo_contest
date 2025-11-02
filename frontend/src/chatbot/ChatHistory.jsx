import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ChatHistory() {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.warn("JWT가 존재하지 않습니다. 로그인 후 확인하세요.");
      return;
    }

    const fetchHistory = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get("/api/chat/history", { 
          headers, 
          withCredentials: true  // 세션 쿠키도 포함
        });
        setMessages(res.data);
      } catch (err) {
        console.error("대화 기록 불러오기 실패:", err);
      }
    };

    fetchHistory();
  }, [token]);

  return (
    <div style={{ padding: '20px' }}>
      <h3>이전 대화 기록</h3>
      {messages.length === 0 ? (
        <p>이전 대화 기록이 없습니다.</p>
      ) : (
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>
              <strong>{msg.role === 'user' ? '사용자' : '챗봇'}</strong>: {msg.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChatHistory;