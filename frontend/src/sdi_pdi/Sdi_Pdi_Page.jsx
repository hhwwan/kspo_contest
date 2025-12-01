import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' 
import './Sdi_Pdi.css'

function Sdi_Pdi_Page() {
    const navigate = useNavigate(); // 돌아가기 버튼용도
    const FASTAPI_BASE_URL = 'http://leisureupup.com:8000/api';

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
        <div className="page-container">
            {/* 왼쪽 필터 영역 */}
            <div className="filter-card">
                <h2 className="page-title">공급부족지수 / 잠재수요지수</h2>

                <div className="form-group">
                    <label>지표 선택</label>
                    <select value={metric} onChange={(e) => setMetric(e.target.value)}>
                        <option value="sdi">공급부족지수 (SDI)</option>
                        <option value="pdi">잠재수요지수 (PDI)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>대분류</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="city_size">도시규모별</option>
                        <option value="region">지역별</option>
                        <option value="gender_age">성별/연령별</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>중분류</label>
                    <select value={selectedSub} onChange={(e) => setSelectedSub(e.target.value)}>
                        <option value="">선택</option>
                        {subOptions.map(opt => (
                        <option key={opt} value={toSafeFilename(opt)}>{opt}</option>
                        ))}
                    </select>
                </div>

                <button className="sdi-back-button" onClick={() => navigate('/')}>
                ← 메인으로 돌아가기
                </button>
            </div>

            {/* 오른쪽 이미지 영역 */}
            <div className="image-card">
                {imgUrl ? (
                <img src={imgUrl} alt={selectedSub} />
                ) : (
                <p className="placeholder-text">좌측에서 항목을 선택해주세요.</p>
                )}
            </div>
        </div>
    );
}

export default Sdi_Pdi_Page