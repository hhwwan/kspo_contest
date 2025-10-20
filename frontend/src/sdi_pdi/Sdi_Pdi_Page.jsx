import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' 
import '../App.css'

function Sdi_Pdi_Page() {
    const navigate = useNavigate(); // 돌아가기 버튼용도
    const FASTAPI_BASE_URL = 'http://13.124.222.250:8000/api';

    // URL용 안전한 이름으로 변환
    function toSafeFilename(name) {
        return name.replace(/[\\/:"*?<>|]+/g, "_");
    }

    // SDI/PDI 선택
    const [metric, setMetric] = useState('sdi'); // sdi 또는 pdi
    
    const [category, setCategory] = useState('city_size'); // 대분류: city_size, region, gender_age
    const [subOptions, setSubOptions] = useState([]);      // 중분류 목록
    const [selectedSub, setSelectedSub] = useState('');    // 선택한 중분류
    const [imgUrl, setImgUrl] = useState('');



    // 대분류 변경 시 중분류 목록 가져오기
    useEffect(() => {
        setSelectedSub(''); // 선택 초기화
        setImgUrl('');      // 이미지 초기화

        let url = '';
        if (metric === 'sdi') {
            if (category === 'city_size') url = `${FASTAPI_BASE_URL}/sdi/city_sizes`;
            else if (category === 'region') url = `${FASTAPI_BASE_URL}/sdi/regions`;
            else if (category === 'gender_age') url = `${FASTAPI_BASE_URL}/sdi/gender_ages`;
        } else if (metric === 'pdi') {
            if (category === 'city_size') url = `${FASTAPI_BASE_URL}/pdi/city_sizes`;
            else if (category === 'region') url = `${FASTAPI_BASE_URL}/pdi/regions`;
            else if (category === 'gender_age') url = `${FASTAPI_BASE_URL}/pdi/gender_ages`;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => setSubOptions(data))
            .catch(err => console.error('중분류 목록 로드 실패:', err));
    }, [category, metric]);

    // 중분류 선택 시 이미지 URL 설정
    useEffect(() => {
        if (!selectedSub) return;

        let url = '';
        const safeName = toSafeFilename(selectedSub);

        if (metric === 'sdi') {
            if (category === 'city_size' || category === 'region') {
                url = `${FASTAPI_BASE_URL}/sdi/${category}/${safeName}`;
            } else if (category === 'gender_age') {
                url = `${FASTAPI_BASE_URL}/sdi/${category}/${encodeURIComponent(selectedSub)}`;
            }
        } else if (metric === 'pdi') {
            if (category === 'city_size' || category === 'region') {
                url = `${FASTAPI_BASE_URL}/pdi/${category}/${safeName}`;
            } else if (category === 'gender_age') {
                url = `${FASTAPI_BASE_URL}/pdi/${category}/${encodeURIComponent(selectedSub)}`;
            }
        }

        setImgUrl(url);
    }, [category, selectedSub, metric]);

    return (
        <div style={{
                display: 'flex',
                padding: '100px',
                gap: '40px',
                minHeight: '100vh',
                backgroundColor: '#f7f9fc', // 밝은 배경
                fontFamily: 'Inter, sans-serif',
            }}
        >
            {/* 왼쪽 콤보박스 영역 */}
            <div style={{
                    minWidth: '280px',
                    padding: '30px',
                    borderRadius: '16px',
                    backgroundColor: '#fff',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                }}
            >
                <h2
                    style={{
                        color: '#222',        // 검정보다 조금 부드러운 진한 색
                        fontSize: '22px',
                        fontWeight: '600',
                        marginBottom: '50px',
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)', // 살짝 그림자
                    }}
                >
                    공급부족지수 / 잠재수요지수
                </h2>

                {/* 돌아가기 버튼 추가 */}
                <button
                    onClick={() => navigate('/')}  // MainPage 경로로 이동
                    style={{
                        position: 'fixed',      // 화면에 고정
                        bottom: '50px',         
                        right: '40px',          // 오른쪽 끝에서 40px 간격
                        padding: '14px 28px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '500',
                        boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
                        zIndex: 1000,
                        transition: '0.2s all',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
                >
                    돌아가기
                </button>

                <label
                    style={{
                        fontSize: '15px',
                        fontWeight: '500',
                        marginBottom: '5px',
                        color: '#333',       // 검정 대비 조금 낮춰 부드럽게
                        textAlign: 'left',       // 왼쪽 정렬
                        marginLeft: '0',          // 카드 내부 padding과 별개로 왼쪽 끝에 붙이기
                    }}
                >
                    지표 선택
                </label>
                <select
                    value={metric}
                    onChange={(e) => setMetric(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        backgroundColor: '#fdfdfd',
                        fontSize: '15px',
                        color: '#222',      // 글씨 색상
                        marginBottom: '30px',
                    }}
                >
                    <option value="sdi">공급부족지수 (SDI)</option>
                    <option value="pdi">잠재수요지수 (PDI)</option>
                </select>

                <label
                    style={{
                        fontSize: '15px',
                        fontWeight: '500',
                        marginBottom: '5px',
                        color: '#333',       // 검정 대비 조금 낮춰 부드럽게
                        textAlign: 'left',   // 왼쪽 정렬
                        marginLeft: '0',     // 카드 내부 padding과 별개로 왼쪽 끝에 붙이기
                    }}
                >
                    대분류
                </label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        backgroundColor: '#fdfdfd',
                        fontSize: '15px',
                        color: '#222',      // 글씨 색상
                        marginBottom: '30px',
                    }}
                >
                    <option value="city_size">도시규모별</option>
                    <option value="region">지역별</option>
                    <option value="gender_age">성별/연령별</option>
                </select>

                <label
                    style={{
                        fontSize: '15px',
                        fontWeight: '500',
                        marginBottom: '5px',
                        color: '#333',       // 검정 대비 조금 낮춰 부드럽게
                        textAlign: 'left',   // 왼쪽 정렬
                        marginLeft: '0',     // 카드 내부 padding과 별개로 왼쪽 끝에 붙이기
                    }}
                >
                    중분류
                </label>
                <select
                    value={selectedSub}
                    onChange={(e) => setSelectedSub(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        backgroundColor: '#fdfdfd',
                        fontSize: '15px',
                        color: '#222',      // 글씨 색상
                        marginBottom: '10px',
                    }}
                >
                    <option value="">선택</option>
                    {subOptions.map(opt => (
                        <option key={opt} value={toSafeFilename(opt)}>
                            {opt}
                        </option>
                    ))}
                </select>
            </div>

            {/* 오른쪽 이미지 영역 */}
            <div style={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                    padding: '20px',
                    maxHeight: '80vh',
                    overflow: 'auto',
                }}
            >
                {imgUrl && (
                    <img
                        src={imgUrl}
                        alt={selectedSub}
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxWidth: '900px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default Sdi_Pdi_Page