import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatbotImg from './assets/chatbot.jpg';
import CustomImg from './assets/custom.png';
import CommunityImg from './assets/community.png';
import SupplyImg from './assets/supply.png';
import EllipseImg from './assets/logo.jpg';
import BuildingImg from './assets/building.jpg';
import './App.css';

export default function MainPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //  추가된 부분: 로그인한 사용자 ID 표시
  const [userId, setUserId] = useState("");

  // 로그인 상태 확인 + 토큰 만료 체크
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setUserId("");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUserId("");
      } else {
        setIsLoggedIn(true);

        // JWT에서 아이디 추출 (payload.sub사용)
        setUserId( payload.sub || "");
      }
    } catch (e) {
      console.error("JWT 파싱 오류:", e);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUserId("");
    }
  }, []);

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserId("");
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const serviceImages = [
    { img: ChatbotImg, text: '챗봇', route: "/chat" },
    { img: CustomImg, text: '맞춤형 체육시설 검색' },
    { img: CommunityImg, text: '체육시설 공공 게시판', route: "/community" },
    { img: SupplyImg, text: '수요 - 공급 현황 확인', route: "/sdi" },
  ];

  return (
    <div className="main-container">
      <section className="main-hero">
        <img src={BuildingImg} alt="Background" className="bg-image" />
        <header className="main-header">
          
          {/* 왼쪽 로고 */}
          <div className="main-logo">LeisureUp</div>

          {/* 오른쪽 전체 영역 */}
          <div className="header-right">

            {/* 로그인한 사용자 표시 ⭐ */}
            {isLoggedIn && (
              <div className="logged-user">
                <span>{userId} 님</span>
              </div>
            )}

            {/* 챗봇 링크 */}
            <div
              className="chatbot-top-link"
              onClick={() => {
                const width = Math.floor(window.innerWidth * 0.8);
                const height = Math.floor(window.innerHeight * 0.8);
                window.open(
                  `${window.location.origin}/chat`,
                  "_blank",
                  `width=${width},height=${height},resizable=yes,scrollbars=yes`
                );
              }}
            >
              간편하게 <span className="chatbot-highlight">챗봇에 질문하기!</span>
            </div>

            {/* 로그인 상태에 따라 버튼 변경 */}
            <div className="main-header-buttons">
              {isLoggedIn ? (
                <button onClick={handleLogout}>Logout</button>
              ) : (
                <>
                  <button onClick={() => navigate("/login")}>Login</button>
                  <button className="signup-btn" onClick={() => navigate("/signup")}>Sign Up</button>
                </>
              )}
            </div>

            {/* 햄버거 메뉴 */}
            <div
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>

            {/* 드롭다운 메뉴 */}
            <div className={`menu-dropdown ${menuOpen ? 'active' : ''}`}>
              <span onClick={() => navigate('/chat')}>챗봇</span>
              <span onClick={() => navigate('/recommend')}>맞춤형 체육시설 검색</span>
              <span onClick={() => navigate('/community')}>체육시설 공공 게시판</span>
              <span onClick={() => navigate('/sdi')}>수요-공급 현황 확인</span>
            </div>
          </div>
        </header>


        <div className="main-hero-text">
          <h1>LeisureUp</h1>
          <div className="site-info-dropdown">
            <button className="site-info-btn">사이트 정보</button>
            <ul className="site-info-list">
              <li>LeisureUp은 다양한 체육 관련 기능을 제공합니다!</li>
              <li>챗봇 - 국민체력 100 데이터를 이용한 운동 추천 기능을 제공하는 서비스</li>
              <li>맞춤형 체육시설 검색 - 성별, 연령별 여가 활동 상위 10개 제공 및 사용자 주변 해당 시설 위치 제공 서비스</li>
              <li>체육시설 공공 게시판 - 체육시설 사용자를 위한 자유게시판 서비스</li>
              <li>수요-공급 현황 확인 - 인구특성별 선택 후 SDI(공급부족지수) · PDI(잠재 수요 지수)를 시각화 이미지로 제공하는 서비스</li>
            </ul>
          </div>
        </div>

        <img src={EllipseImg} alt="Ellipse" className="hero-circle" />
      </section>

      {/* 서비스 섹션 */}
      <section className="service-section">
        <h2>주요 서비스</h2>
        <div className="service-list">
          {serviceImages.map((service, index) => (
            <div
              key={index}
              className="service-card"
              onClick={() => service.route && navigate(service.route)}
            >
              <div className="service-img">
                <img src={service.img} alt={`card${index + 1}`} />
              </div>
              <div className="service-text">{service.text}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}