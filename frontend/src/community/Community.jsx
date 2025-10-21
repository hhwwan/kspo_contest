import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Community.css';

export default function Community() {
    const navigate = useNavigate();

    // 예시 게시글 데이터
    const posts = [
        { id: 1, title: '체육시설 이용 후기', author: '김동환', date: '2025-10-21', content: '오늘 방문한 시설은 정말 깨끗하고 좋아요!' },
        { id: 2, title: '체육시설 예약 관련 문의', author: '정규', date: '2025-10-20', content: '예약이 잘 안되는데 어떻게 해야 하나요?' },
        { id: 3, title: '새로운 운동 프로그램 추천', author: '전수은', date: '2025-10-19', content: '요가와 필라테스 프로그램이 새로 생겼네요!' },
    ];

    return (
        <div className="community-container">
            <h1 className="community-title">체육시설 공공 게시판</h1>

            {/* 메인페이지 돌아가기 버튼 */}
            <button className="back-button" onClick={() => navigate('/')}>
                ← 메인페이지로 돌아가기
            </button>

            <div className="posts-list">
                {posts.map(post => (
                    <div key={post.id} className="post-card">
                        <h2 className="post-title">{post.title}</h2>
                        <div className="post-meta">
                            <span className="post-author">{post.author}</span> | <span className="post-date">{post.date}</span>
                        </div>
                        <p className="post-content">{post.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
