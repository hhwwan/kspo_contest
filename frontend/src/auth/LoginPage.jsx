import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // 여기서 fetch 요청
    const handleLogin = async () => {
        try {
          const res = await fetch('http://13.124.222.250:8080/api/login', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
          });
      
          if (!res.ok) {
            const errorData = await res.json();
            alert(errorData.message || "로그인 실패");
            return;
          }
      
          const data = await res.json();
      
          // ✅ token이 있으면 localStorage에 저장 (다음 요청 시 사용)
          if (data.token) {
            localStorage.setItem("token", data.token);
            alert(data.message || "로그인 성공");
            navigate('/');
          } else {
            alert(data.message || "로그인 실패");
          }
      
        } catch (err) {
          console.error(err);
          alert('서버와 통신 중 오류가 발생했습니다.');
        }
      };
      
    return (
        <div>
            <h2>Login</h2>
            <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}