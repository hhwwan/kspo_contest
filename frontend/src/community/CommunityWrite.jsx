import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './PostForm.css';

export default function CommunityWrite() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = () => {
        if (!title.trim() || !author.trim() || !content.trim()) {
            alert('제목, 작성자, 내용은 반드시 입력해야 합니다.');
            return;
        }
        
        fetch("http://13.124.222.250:8080/api/community", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, author, content })
        })
        .then(res => res.json())
        .then(() => navigate("/community"))
        .catch(err => console.error(err));
    };

    return (
        <div className="post-detail-container">
            <div className="post-detail-wrapper">
                <h1 className="post-detail-title">게시글 작성</h1>
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
                    <button className="edit-button" onClick={handleSubmit}>작성 완료</button>
                    <button className="detail-back-button" onClick={() => navigate('/community')}>← 목록으로 돌아가기</button>
                </div>
            </div>
        </div>
    );
}
