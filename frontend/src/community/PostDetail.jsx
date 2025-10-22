import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PostDetail.css';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/community/${id}`)
            .then(res => res.json())
            .then(data => setPost(data))
            .catch(err => console.error(err));
    }, [id]);

    const handleEdit = () => {
        const newTitle = prompt('제목을 수정하세요', post.title);
        const newContent = prompt('내용을 수정하세요', post.content);

        if (newTitle && newContent) {
            fetch(`http://localhost:8080/api/community/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...post, title: newTitle, content: newContent })
            })
            .then(res => res.json())
            .then(updated => setPost(updated));
        }
    };

    if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

    return (
        <div className="post-detail-container">
            <div className="detail-header">
                <h1 className="post-detail-title">{post.title}</h1>
                <div className="post-detail-meta">
                    <span>{post.author}</span> | <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="post-detail-content-wrapper">
                    <p className="post-content">{post.content}</p>
                </div>
            </div>

            <div className="detail-footer">
                <button
                    className="edit-button"
                    onClick={() => navigate(`/community/${post.id}/edit`)}
                >
                    수정
                </button>
                <button className="detail-back-button" onClick={() => navigate('/community')}>
                    ← 목록으로 돌아가기
                </button>
            </div>
        </div>
    );
}