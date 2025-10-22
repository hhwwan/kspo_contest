import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import './Community.css';

// 예시 게시글 데이터
const initialPosts = [
    { id: 1, title: '체육시설 이용 후기', author: '김동환', date: '2025-10-21', content: '오늘 방문한 시설은 정말 깨끗하고 좋아요!' },
    { id: 2, title: '체육시설 예약 관련 문의', author: '정규', date: '2025-10-20', content: '예약이 잘 안되는데 어떻게 해야 하나요?' },
    { id: 3, title: '새로운 운동 프로그램 추천', author: '전수은', date: '2025-10-19', content: '요가와 필라테스 프로그램이 새로 생겼네요!' },
    { id: 4, title: '수영장 이용 TIP', author: '이민수', date: '2025-10-18', content: '주말엔 사람이 많으니 평일 아침 추천!' },
    { id: 5, title: '헬스장 기구 점검 문의', author: '박지훈', date: '2025-10-17', content: '러닝머신 고장 신고 방법 아시는 분?' },
    { id: 6, title: '요가 프로그램 후기', author: '정수민', date: '2025-10-16', content: '강사님이 친절하시고 프로그램 좋습니다.' },
];

export default function Community() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState(initialPosts);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    // 검색/필터링
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase()) ||
        post.author.toLowerCase().includes(search.toLowerCase())
    );

    // 페이징
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const changePage = (pageNumber) => setCurrentPage(pageNumber);

    // 게시글 삭제
    const handleDelete = (id) => setPosts(posts.filter(post => post.id !== id));

    return (
        <div className="community-container">
            <h1 className="community-title">체육시설 공공 게시판</h1>

            {/* 검색창 */}
            <input
                type="text"
                placeholder="검색어를 입력하세요 (제목, 내용, 작성자)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
            />

            {/* 게시글 목록 */}
            <div className="posts-list">
                {currentPosts.map(post => (
                    <div
                        key={post.id}
                        className="post-card-horizontal"
                        onClick={() => navigate(`/community/${post.id}`)}
                    >
                        <span className="post-date">{post.date}</span>
                        <h2 className="post-title">{post.title}</h2>
                        <span className="post-author">{post.author}</span>
                        <button
                            className="delete-button"
                            onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                        >
                            삭제
                        </button>
                    </div>
                ))}
            </div>

            {/* 페이지네이션 + 돌아가기 버튼 */}
            <div className="pagination-container">
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            className={currentPage === i + 1 ? 'active' : ''}
                            onClick={() => changePage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <button className="community-back-button" onClick={() => navigate('/')}>
                    ← 메인으로 돌아가기
                </button>
            </div>
        </div>
    );
}