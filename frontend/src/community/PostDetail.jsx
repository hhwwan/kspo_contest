import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PostDetail.css';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch(`http://13.124.222.250:8080/api/community/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setPost(data))
            .catch(err => console.error(err));
    }, [id, token]);

    const handleEdit = () => {
        if (!post) return;
        navigate(`/community/${post.id}/edit`);
    };

    const handleDelete = () => {
        fetch(`http://13.124.222.250:8080/api/community/${id}`, {
            method: 'DELETE',
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("본인 게시글만 삭제할 수 있습니다. 로그인 상태인지 확인하세요.");
                navigate("/community");
            })
            .catch(err => alert(err.message));
    };

    if (!post) return <div>게시글을 불러오는 중입니다...</div>;

    //  JWT에서 username 추출
    let payloadUsername = "";
    try {
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            // username, sub 등 다양한 이름으로 들어올 수 있으므로 우선순위로 처리
            payloadUsername = payload.username || payload.sub || "";
        }
    } catch (err) {
        console.error("JWT 파싱 오류", err);
    }

    //  서버 응답에서 작성자 필드명 확인 (authorName, authorUsername, author)
    const authorField = post.authorName || post.authorUsername || post.author || "";
    const isAuthor = authorField === payloadUsername;

    return (
        <div className="post-detail-container">
            <div className="post-detail-wrapper">
                <div className="detail-header">
                    <h1 className="post-detail-title">{post.title}</h1>
                    <div className="post-detail-meta">
                        <span>{authorField}</span> | <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="post-detail-content-wrapper">
                        <p className="post-content">{post.content}</p>
                    </div>
                </div>

                <div className="detail-footer">
                    {/*  로그인 사용자와 작성자 일치 시 수정/삭제 버튼 표시 */}
                    {isAuthor && (
                        <>
                            <button className="edit-button" onClick={handleEdit}>수정</button>
                            <button className="delete-button" onClick={handleDelete}>삭제</button>
                        </>
                    )}
                    <button className="detail-back-button" onClick={() => navigate('/community')}>
                        ← 목록으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}
