from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# SDI 라우터
from region_sdi import router as region_sdi_router
from city_size_sdi import router as city_size_sdi_router
from gender_age_sdi import router as gender_age_sdi_router

# PDI 라우터
from region_pdi import router as region_pdi_router
from city_size_pdi import router as city_size_pdi_router
from gender_age_pdi import router as gender_age_pdi_router

app = FastAPI(title="FastAPI 통합 서버")

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://13.124.222.250:5173", "http://13.124.222.250:8080","http://leisureupup.com:8080"],  # React 개발 서버 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SDI
app.include_router(region_sdi_router, prefix="/api/sdi", tags=["지역별 SDI"])
app.include_router(city_size_sdi_router, prefix="/api/sdi", tags=["도시규모별 SDI"])
app.include_router(gender_age_sdi_router, prefix="/api/sdi", tags=["성별연령별 SDI"])

# PDI
app.include_router(region_pdi_router, prefix="/api/pdi", tags=["지역별 PDI"])
app.include_router(city_size_pdi_router, prefix="/api/pdi", tags=["도시규모별 PDI"])
app.include_router(gender_age_pdi_router, prefix="/api/pdi", tags=["성별연령별 PDI"])