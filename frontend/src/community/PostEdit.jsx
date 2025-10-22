import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './PostForm.css';

export default function PostEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        fetch(`http://localhost:8080/api/community/${id}`)
            .then(res => res.json())
            .then(data => {
                setTitle(data.title);
                setAuthor(data.author);
                setContent(data.content);
            })
            .catch(err => console.error(err));
    }, [id]);

    const handleUpdate = () => {
        if (!title.trim() || !author.trim() || !content.trim()) {
            alert('제목, 작성자, 내용은 반드시 입력해야 합니다.');
            return;
        }
        
        fetch(`http://localhost:8080/api/community/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, content })
        })
        .then(res => res.json())
        .then(() => navigate(`/community/${id}`))
        .catch(err => console.error(err));
    };

    return (
        <div className="post-detail-container">
            <h1 className="post-detail-title">게시글 수정</h1>
            <div className="post-detail-meta">
                <input
                    type="text"
                    placeholder="작성자"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="post-meta-input"
                />
            </div>
            <div className="post-detail-content-wrapper">
                <input
                    type="text"
                    placeholder="제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="post-title-input"
                />
                <textarea
                    placeholder="내용을 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="post-content-textarea"
                />
            </div>
            <div className="detail-footer">
                <button className="edit-button" onClick={handleUpdate}>수정 완료</button>
                <button className="detail-back-button" onClick={() => navigate(`/community/${id}`)}>← 돌아가기</button>
            </div>
        </div>
    );
}
