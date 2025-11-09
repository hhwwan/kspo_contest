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

    useEffect(() => {
        fetch('http://13.124.222.250:8080/api/community', {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                // createdAt 기준 내림차순으로 정렬: 최신 글이 맨 위
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

    const handleDelete = (id) => {
        fetch(`http://13.124.222.250:8080/api/community/${id}`, {
            method: 'DELETE',
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("본인 게시글만 삭제할 수 있습니다. 로그인 상태인지 확인하세요.");
                // 삭제 후 화면에서도 최신 글 기준으로 갱신
                setPosts(prev => prev.filter(post => post.id !== id));
            })
            .catch(err => alert(err.message));
    };

    return (
        <div className="community-container">
            <div className="community-wrapper">
                <h1 className="community-title">체육시설 공공 게시판</h1>
                
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
                            <span className="post-author">{post.authorName}</span>
                            <button
                                className="delete-button"
                                onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                            >
                                삭제
                            </button>
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