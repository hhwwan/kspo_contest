import React, { useState } from "react";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const response = await fetch("http://13.124.222.250:8080/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        alert("회원가입 성공!");
        navigate('/'); // 회원가입 성공 시 메인페이지로 이동
      } else {
        alert("회원가입 실패!");
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>회원가입</button>
    </div>
  );
}

export default SignupPage;
