import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await fetch("http://13.124.222.250:8080/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert("회원가입 성공!");
        navigate("/");
      } else {
        alert("회원가입 실패!");
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      alert("오류가 발생했습니다. 다시 시도하세요.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-header">
          <h2>회원가입</h2>
          <p className="sub">계정을 만들어 서비스를 이용해보세요</p>
        </div>

        <form
          className="signup-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <div className="form-row">
            <label htmlFor="username">아이디</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="사용할 아이디를 입력하세요"
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
              회원가입
            </button>
            <button
              type="button"
              className="text-btn"
              onClick={() => navigate("/login")}
            >
              로그인으로 이동
            </button>
          </div>

          {/* ✅ 홈으로 버튼 추가 */}
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

export default SignupPage;