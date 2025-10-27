import React, { useState } from 'react';
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

  const serviceImages = [
    { img: ChatbotImg, text: '챗봇', route: "/chat" },
    { img: CustomImg, text: '맞춤형 체육시설 검색' },
    { img: CommunityImg, text: '체육시설 공공 게시판', route: "/community" },
    { img: SupplyImg, text: '수요 - 공급 현황 확인', route: "/sdi" },
  ];

  return (
    <div className="main-container">
      {/*<section className="main-hero" style={{ backgroundImage: `url(${BuildingImg})` }}> -> 이게 전부다 100%로 나오게*/}
      <section className="main-hero">
        <img src={BuildingImg} alt="Background" className="bg-image" />
        <header className="main-header">
          {/* 왼쪽 로고 */}
          <div className="main-logo">LeisureUp</div>

          {/* 오른쪽 전체 영역 */}
          <div className="header-right"> 
            {/* 챗봇 링크 */}
            <div
              className="chatbot-top-link"
              onClick={() => {
                const width = Math.floor(window.innerWidth * 0.8);
                const height = Math.floor(window.innerHeight * 0.8);
                window.open(
                  "/chat",
                  "_blank",
                  `width=${width},height=${height},resizable=yes,scrollbars=yes`
                );
              }}>
              간편하게 <span className="chatbot-highlight">챗봇에 질문하기!</span>
            </div>

            {/* 로그인 버튼 */}
            <div className="main-header-buttons">
              <button>Login</button>
              <button className="signup-btn">Sign Up</button>
            </div>

            {/* 햄버거 메뉴 */}
            <div className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </div>

            {/* 드롭다운 메뉴 */}
            <div className={`menu-dropdown ${menuOpen ? 'active' : ''}`}>
              <span onClick={() => navigate('/chat')}>챗봇</span>
              <span onClick={() => navigate('/recommend')}>맞춤형 체육시설 검색</span>
              <span onClick={() => navigate('/community')}>공공 게시판</span>
              <span onClick={() => navigate('/sdi')}>수요 - 공급 현황</span>
            </div>
          </div>
        </header>

        <div className="main-hero-text">
          <h1>LeisureUp</h1>
          <div className="site-info-dropdown">
            <button className="site-info-btn">사이트 정보</button>
            <ul className="site-info-list">
              <li>LeisureUp은 ~~한 서비스입니다.</li>
              <li>
                <span
                  className="site-info-link"
                  onClick={() => {
                    window.open(
                      "/chat",
                      "_blank",
                      "width=" + Math.floor(window.innerWidth * 0.8) +
                      ",height=" + Math.floor(window.innerHeight * 0.8) +
                      ",resizable=yes,scrollbars=yes"
                    );
                  }}>
                  Chatbot
                </span>{" "}
                은 다양한 기능을 제공합니다.
              </li>
              <li>맞춤형 체육시설은</li>
              <li>공공 게시판은</li>
              <li>수요-공급 정보를 한눈에 확인할 수 있습니다.</li>
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