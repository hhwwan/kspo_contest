import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PostDetail.css';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const initialPosts = [
            { id: 1, title: '체육시설 이용 후기', author: '김동환', date: '2025-10-21', content: '오늘 방문한 시설은 정말 깨끗하고 좋아요!' },
            { id: 2, title: '체육시설 예약 관련 문의', author: '정규', date: '2025-10-20', content: '예약이 잘 안되는데 어떻게 해야 하나요?' },
            { id: 3, title: '새로운 운동 프로그램 추천', author: '전수은', date: '2025-10-19', content: '요가와 필라테스 프로그램이 새로 생겼네요!' },
            { id: 4, title: '수영장 이용 TIP', author: '이민수', date: '2025-10-18', content: '주말엔 사람이 많으니 평일 아침 추천!' },
            { id: 5, title: '헬스장 기구 점검 문의', author: '박지훈', date: '2025-10-17', content: '러닝머신 고장 신고 방법 아시는 분?' },
            { id: 6, title: '요가 프로그램 후기', author: '정수민', date: '2025-10-16', content: '강사님이 친절하시고 프로그램 좋습니다.' },
        ];
        const foundPost = initialPosts.find(p => p.id === parseInt(id));
        setPost(foundPost);
    }, [id]);

    if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

    return (
        <div className="post-detail-container">
            <div className="detail-header">
                <h1 className="post-detail-title">{post.title}</h1>
                    <div className="post-detail-meta">
                        <span>{post.author }</span> | <span>{post.date}</span>
                    </div>

                    <div className="post-detail-content-wrapper">
                        <p className="post-content">{post.content}</p>
                    </div>
            </div>

            <div className="detail-footer">
                <button className="edit-button">수정</button>
                <button className="detail-back-button" onClick={() => navigate(-1)}>
                    ← 목록으로 돌아가기
                </button>
            </div>
        </div>
    );
}