import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const [imgUrl, setImgUrl] = useState('');
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('national');

    useEffect(() => {
        // 지역 목록 가져오기
        fetch('http://localhost:8080/api/sdi/regions')
        .then(res => res.json())
        .then(data => setRegions(data))
        .catch(err => console.error('지역 목록 로드 실패:', err));
        
        // 초기 이미지는 전국 평균
        setImgUrl('http://localhost:8080/api/sdi/national');
    }, []);

    // 버튼 클릭 시 이미지 변경
    const handleClick = (region) => {
        setSelectedRegion(region);

        if (region === 'national') {
        setImgUrl('http://localhost:8080/api/sdi/national');
        } else {
        setImgUrl(`http://localhost:8080/api/sdi/region/${region}`);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
        <h1>체육시설 SDI</h1>

        {/* 버튼 영역 */}
        <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button
            onClick={() => handleClick('national')}
            style={{ backgroundColor: selectedRegion === 'national' ? '#4CAF50' : '#e0e0e0' }}
            >
            전국 평균
            </button>

            {regions.map((region) => (
            <button
                key={region}
                onClick={() => handleClick(region)}
                style={{ backgroundColor: selectedRegion === region ? '#4CAF50' : '#e0e0e0' }}
            >
                {region}
            </button>
            ))}
        </div>

        {/* 이미지 영역 */}
        {imgUrl && (
            <div>
            <img src={imgUrl} alt={selectedRegion} style={{ width: '100%', height: 'auto', maxWidth: '900px' }} />
            </div>
        )}
        </div>
    );
}

export default App