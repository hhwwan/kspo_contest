import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Community.css';

export default function Community() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    useEffect(() => {
        fetch('http://localhost:8080/api/community')
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.error(err));
    }, []);

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
    const handleDelete = (id) => {
        fetch(`http://localhost:8080/api/community/${id}`, { method: 'DELETE' })
            .then(() => setPosts(posts.filter(post => post.id !== id)));
    };

    return (
        <div className="community-container">
            <h1 className="community-title">체육시설 공공 게시판</h1>
            
            {/* 검색창 + 작성 버튼을 한 라인에 */}
            <div className="search-write-container">
                <input
                    type="text"
                    placeholder="검색어를 입력하세요 (제목, 내용, 작성자)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
                <button
                    className="write-button"
                    onClick={() => navigate("/community/write")}
                >
                    게시글 작성
                </button>
            </div>

            {/* 게시글 목록 */}
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