import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://leisureupup.com:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "로그인 실패");
        return;
      }

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        alert(data.message || "로그인 성공!");
        navigate("/");
      } else {
        alert(data.message || "로그인 실패");
      }
    } catch (err) {
      console.error(err);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>로그인</h2>
          <p className="sub">계정 정보를 입력하고 로그인하세요</p>
        </div>

        <form
          className="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="form-row">
            <label htmlFor="username">아이디</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력하세요"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              로그인
            </button>
            <button
              type="button"
              className="text-btn"
              onClick={() => navigate("/signup")}
            >
              회원가입으로 이동
            </button>
          </div>

          <div className="home-section">
            <button
              type="button"
              className="home-btn"
              onClick={() => navigate("/")}
            >
              🏠 홈으로
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
