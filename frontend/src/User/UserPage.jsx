import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./UserPage.css";

// ---- 한국 지역 데이터 ----
const regionData = {
  "서울특별시": [
    "종로구","중구","용산구","성동구","광진구","동대문구","중랑구","성북구","강북구",
    "도봉구","노원구","은평구","서대문구","마포구","양천구","강서구","구로구","금천구",
    "영등포구","동작구","관악구","서초구","강남구","송파구","강동구"
  ],

  "부산광역시": [
    "중구","서구","동구","영도구","부산진구","동래구","남구","북구","해운대구","사하구",
    "금정구","강서구","연제구","수영구","사상구","기장군"
  ],

  "대구광역시": [
    "중구","동구","서구","남구","북구","수성구","달서구","달성군","군위군"
  ],

  "인천광역시": [
    "중구","동구","미추홀구","연수구","남동구","부평구","계양구","서구","강화군","옹진군"
  ],

  "광주광역시": [
    "동구","서구","남구","북구","광산구"
  ],

  "대전광역시": [
    "동구","중구","서구","유성구","대덕구"
  ],

  "울산광역시": [
    "중구","남구","동구","북구","울주군"
  ],

  "세종특별자치시": [],

  "경기도": [
    "수원시","용인시","고양시","성남시","부천시","안산시","안양시","남양주시","화성시",
    "평택시","의정부시","시흥시","파주시","김포시","광명시","광주시","군포시",
    "하남시","오산시","이천시","안성시","의왕시","양주시","구리시","여주시",
    "동두천시","과천시","가평군","양평군","포천시"
  ],

  "강원도": [
    "춘천시","원주시","강릉시","동해시","태백시","속초시","삼척시",
    "홍천군","횡성군","영월군","평창군","정선군","철원군","화천군","양구군","인제군","고성군","양양군"
  ],

  "충청북도": [
    "청주시","충주시","제천시","보은군","옥천군","영동군","증평군",
    "진천군","괴산군","음성군","단양군"
  ],

  "충청남도": [
    "천안시","공주시","보령시","아산시","서산시","논산시","계룡시","당진시",
    "금산군","부여군","서천군","청양군","홍성군","예산군","태안군"
  ],

  "전라북도": [
    "전주시","익산시","군산시","정읍시","남원시","김제시",
    "완주군","진안군","무주군","장수군","임실군","순창군",
    "고창군","부안군"
  ],

  "전라남도": [
    "목포시","여수시","순천시","나주시","광양시",
    "담양군","곡성군","구례군","고흥군","보성군","화순군","장흥군","강진군","해남군",
    "영암군","무안군","함평군","영광군","장성군","완도군","진도군","신안군"
  ],

  "경상북도": [
    "포항시","경주시","김천시","안동시","구미시","영주시","영천시","상주시",
    "문경시","경산시","군위군","의성군","청송군","영양군","영덕군","청도군",
    "고령군","성주군","칠곡군","예천군","봉화군","울진군","울릉군"
  ],

  "경상남도": [
    "창원시","김해시","진주시","양산시","거제시","통영시","사천시","밀양시",
    "함안군","창녕군","고성군","남해군","하동군","산청군",
    "함양군","거창군","합천군"
  ],

  "제주특별자치도": [
    "제주시","서귀포시"
  ]
};

const UserPage = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [activities, setActivities] = useState([]);
  const [mapUrl, setMapUrl] = useState("");

  const [region1, setRegion1] = useState(""); // 대분류
  const [region2, setRegion2] = useState(""); // 소분류 (optional)

  // 🔍 활동 조회
  const searchActivities = async () => {
    const res = await fetch(
      `http://leisureupup.com:8080/api/user/search?gender=${gender}&age=${age}` //여기 ec2에서 돌릴 때는 13.124.222.250:8080으로 바꿔야함. local에서는 localhost:8080
    );
    const json = await res.json();

    setMapUrl("");
    setActivities(json);
  };

  const goBackToMain = () => {
      navigate("/");      // 메인페이지로 이동
    };

  // 🗺 지도 열기 → "대분류 + 소분류 + 활동명" 검색
  const openMap = (keyword) => {
    if (!region1) {
      alert("지역을 선택해주세요!");
      return;
    }

    // 최종 검색어 생성
    const searchLocation =
      (region1 || "") + " " +
      (region2 || "") + " " +
      keyword;

    setMapUrl(`https://map.kakao.com/?q=${encodeURIComponent(searchLocation)}`);


    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 200);
  };

  // 소분류가 없는 지역인지 체크
  const hasSubRegion = region1 && regionData[region1] && regionData[region1].length > 0;

  return (
    <div className="user-page-container">

      <div className="user-card">

        <h2 className="user-title">여가 활동 추천</h2>

        {/* 🔽 지역 선택 UI */}
        <div className="user-filter-box">


          {/* 성별 */}
          <select onChange={(e) => setGender(e.target.value)}>
            <option value="">성별 선택</option>
            <option value="남">남자</option>
            <option value="여">여자</option>
          </select>

          {/* 연령 */}
          <select onChange={(e) => setAge(e.target.value)}>
            <option value="">연령대 선택</option>
            <option value="10대">10대</option>
            <option value="20대">20대</option>
            <option value="30대">30대</option>
            <option value="40대">40대</option>
            <option value="50대">50대</option>
            <option value="60대">60대</option>
            <option value="70대 이상">70대 이상</option>
          </select>

          {/* ⭐ 대분류 지역 선택 */}
          <select
            value={region1}
            onChange={(e) => {
              setRegion1(e.target.value);
              setRegion2(""); // 대분류 바뀌면 소분류 초기화
            }}
          >
            <option value="">지역 선택</option>
            {Object.keys(regionData).map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          {/* ⭐ 소분류 지역 선택 (있는 경우에만 표시) */}
          {hasSubRegion && (
            <select
              value={region2}
              onChange={(e) => setRegion2(e.target.value)}
            >
              <option value="">세부 지역 선택</option>
              {regionData[region1].map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          )}

          <button onClick={searchActivities}>조회</button>
        </div>
        <div className="notice-bar">
          <p className="region-notice">
            여가활동 순위는 성별·연령별 순위이며, 지역은 반영되지 않습니다.
          </p>

          <button className="back-btn" onClick={goBackToMain}>
            메인으로 돌아가기
          </button>
        </div>


        {/* 결과 영역 */}
        {activities.length > 0 && (
          <div
            className="result-area"
            style={{
              flexDirection: mapUrl ? "row" : "column",
              alignItems: mapUrl ? "stretch" : "center",
            }}
          >
            <div style={{ width: mapUrl ? "35%" : "70%" }}>
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>활동명</th>
                    <th>점수</th>
                    <th>지도</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((item, i) => (
                    <tr key={i}>
                      <td>{item.activity}</td>
                      <td>{item.score}</td>
                      <td>
                        <button onClick={() => openMap(item.activity)}>
                          지도 보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {mapUrl && (
              <div className="map-box">
                <iframe src={mapUrl} title="naver-map" />
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default UserPage;
