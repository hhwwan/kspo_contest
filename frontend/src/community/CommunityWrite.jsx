import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './PostForm.css';

export default function CommunityWrite() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("로그인 후 이용 가능합니다.");
            navigate("/login");
        }
    }, [navigate]);

    const handleSubmit = () => {
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력하세요.');
            return;
        }

        const token = localStorage.getItem("token");
        fetch("http://leisureupup.com:8080/api/community", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ title, content }) // author 제거
        })
        .then(res => res.json())
        .then(() => navigate("/community"))
        .catch(err => console.error(err));
    };

    return (
        <div className="post-detail-container">
            <div className="post-detail-wrapper">
                <h1 className="post-detail-title">게시글 작성</h1>

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
                    <button className="detail-back-button" onClick={() => navigate('/community')}>
                        ← 목록으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}
