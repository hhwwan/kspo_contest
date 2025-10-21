import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatbotImg from './assets/chatbot.jpg';
import CustomImg from './assets/custom.png';
import CommunityImg from './assets/community.png';
import SupplyImg from './assets/supply.png';
import EllipseImg from './assets/logo.jpg';
import BuildingImg from './assets/building.jpg';
import './App.css'

export default function MainPage() {
    const navigate = useNavigate();

    const serviceImages = [
        { img: ChatbotImg, text: "chat bot", route: "/chat" }, // route 추가
        { img: CustomImg, text: '맞춤형 체육시설 검색' },
        { img: CommunityImg, text: '체육시설 공공 게시판' },
        { img: SupplyImg, text: '수요 - 공급 현황 확인', route: "/sdi" }, // route 추가
    ];


    return (
        <div
            style={{
                position: 'relative',
                width: '100vw',
                midHeight: '10vh',
                backgroundColor: '#fff',
                boxSizing: 'border-box',
            }}
        >
            {/* 메인 섹션: Building 이미지 */}
            <section
                style={{
                width: '100vw',
                height: 440, // 1920x680 비율
                backgroundImage: `url(${BuildingImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                }}
            >
                {/* 헤더: 이미지 위에 겹치도록 */}
                <header
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: 40,
                        backgroundColor: '#000',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0 100px',
                        boxSizing: 'border-box',
                        zIndex: 10,
                    }}
                >
                    <div style={{ color: '#fff', fontSize: 24, fontWeight: 500, fontFamily: 'Inter'}}>
                        LeisureUp
                    </div>
                    <div style={{ display: 'flex', gap: 24 }}>
                        <button style={{ color: '#fff' }}>Login</button>
                        <button style={{ color: '#fff' }}>Sign Up</button>
                    </div>
                </header>

                {/* 메인 컨텐츠 텍스트 */}
                <div style={{ position: 'absolute', top: 91, left: 100 }}>
                    <h1 style={{ fontFamily: 'Jomolhari', marginLeft: -350, fontSize: 40, marginTop: -20, color: '#000' }}>
                        LeisureUp
                    </h1>
                    <p style={{ fontFamily: 'Jomolhari', fontSize: 25, marginTop: 20, color: '#000', lineHeight: 1.4 }}>
                        이 기술은 어쩌구 저쩌구 김동환
                        이러한 기술입니다~~
                    </p>
                    <p style={{ fontFamily: 'Jomolhari', fontSize: 25, marginTop: 20, color: '#000', lineHeight: 1.4 }}>
                        이 기술은 어쩌구 저쩌구 정규도 이러한 기술입니다~~
                    </p>
                    <p style={{ fontFamily: 'Jomolhari', fontSize: 25, marginTop: 20, color: '#000', lineHeight: 1.4 }}>
                        이 기술은 어쩌구 저쩌구 전수은 이러한 기술입니다~~
                    </p>
                </div>

                    {/* 오른쪽 원형 이미지 */}
                    <img
                    src={EllipseImg}
                    alt="Ellipse"
                    style={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 70,
                        right: 100,
                    }}
                />
            </section>

            {/* 사용자 서비스 섹션 */}
            <section
                style={{
                width: '100vw',
                paddingTop: 0,
                paddingBottom: 20,
                }}
            >
                <h2
                    style={{
                        fontFamily: 'Kailasa',
                        fontSize: 28,
                        marginLeft: -1300,
                        marginBottom: 20,
                        color: '#000',
                        textShadow: '0px 4px 4px rgba(0,0,0,0.25)',
                    }}
                >
                    사용자 서비스
                </h2>

                <div
                    style={{
                        display: 'flex',
                        gap: 180,
                        paddingLeft: 100,
                        flexWrap: 'wrap',
                    }}
                >
                    {serviceImages.map((service, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div
                                onClick={() => service.route && navigate(service.route)}
                                style={{
                                    width: 240,
                                    height: 200,
                                    borderRadius: 40,
                                    overflow: 'hidden',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                                }}
                            >
                                <img
                                    src={service.img}
                                    alt={`card${index + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                            {/* 이미지 밑 텍스트 상자 */}
                            <div
                                style={{
                                    marginTop: 12,
                                    fontFamily: 'Inter',
                                    fontWeight: 500,
                                    fontSize: 20,
                                    textAlign: 'center',
                                    color: '#000'
                                }}
                            >
                                {service.text}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
