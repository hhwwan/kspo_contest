import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Community.css';

export default function Community() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    const token = localStorage.getItem("token");

    // ⭐ 로그인한 사용자 ID 상태
    const [userId, setUserId] = useState("");
    useEffect(() => {
        if(token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserId(payload.sub || "");
            } catch(e) {
                console.error("JWT 파싱 오류:", e);
                setUserId("");
            }
        }
    }, [token]);

    // 게시글 가져오기
    useEffect(() => {
        fetch('http://leisureupup.com:8080/api/community', {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(sorted);
        })
        .catch(err => console.error(err));
    }, [token]);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase()) ||
        post.authorName.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const changePage = (pageNumber) => setCurrentPage(pageNumber);

    // 삭제 (본인 글만 가능)
    const handleDelete = (id, authorName) => {
        if(userId !== authorName) {
            alert("본인 게시글만 삭제할 수 있습니다.");
            return;
        }
        fetch(`http://leisureupup.com:8080/api/community/${id}`, {
            method: 'DELETE',
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) throw new Error("삭제 실패");
            setPosts(prev => prev.filter(post => post.id !== id));
        })
        .catch(err => alert(err.message));
    };

    return (
        <div className="community-container">
            <div className="community-wrapper">

                {/* ⭐ 상단 헤더: 제목 + 로그인 사용자 표시 */}
                <div className="community-header">
                    <h1 className="community-title">체육시설 공공 게시판</h1>
                    {userId && <div className="logged-user">{userId} 님</div>}
                </div>

                <div className="search-write-container">
                    <input
                        type="text"
                        placeholder="검색어를 입력하세요 (제목, 내용, 작성자)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    {token ? (
                        <button
                            className="write-button"
                            onClick={() => navigate("/community/write")}
                        >
                            게시글 작성
                        </button>
                    ) : (
                        <span className="login-note">로그인 후 글 작성 가능</span>
                    )}
                </div>

                <div className="posts-list">
                    {currentPosts.map(post => (
                        <div
                            key={post.id}
                            className="post-card-horizontal"
                            onClick={() => navigate(`/community/${post.id}`)}
                        >
                            <span className="post-date">
                                {new Date(post.createdAt).toLocaleString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                })}
                            </span>
                            <h2 className="post-title">{post.title}</h2>

                            {/* 작성자 표시 */}
                            <span className={`post-author ${post.authorName === userId ? 'my-post' : ''}`}>
                                {post.authorName}{post.authorName === userId ? " (나)" : ""}
                            </span>

                            {/* 삭제 버튼: 본인 글만 */}
                            {post.authorName === userId && (
                                <button
                                    className="delete-button"
                                    onClick={(e) => { e.stopPropagation(); handleDelete(post.id, post.authorName); }}
                                >
                                    삭제
                                </button>
                            )}
                        </div>
                    ))}
                </div>

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
        </div>
    );
}
