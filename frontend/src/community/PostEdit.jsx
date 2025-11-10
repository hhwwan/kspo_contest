import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './PostForm.css';

export default function PostEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [authorName, setAuthorName] = useState(''); // author → authorName
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch(`http://13.124.222.250:8080/api/community/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setTitle(data.title);
                setContent(data.content);
                setAuthorName(data.authorName); // 읽기용
            })
            .catch(err => console.error(err));
    }, [id, token]);

    const handleUpdate = () => {
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력하세요.');
            return;
        }

        fetch(`http://13.124.222.250:8080/api/community/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ title, content })
        })
        .then(res => {
            if (!res.ok) throw new Error("수정 실패");
            return res.json();
        })
        .then(() => navigate(`/community/${id}`))
        .catch(err => alert(err.message));
    };

    return (
        <div className="post-detail-container">
            <div className="post-detail-wrapper">
                <h1 className="post-detail-title">게시글 수정</h1>

                <div className="post-detail-meta">
                    <input
                        type="text"
                        value={authorName}
                        readOnly
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
        </div>
    );
}
