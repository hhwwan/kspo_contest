## [중요] Git에서 클론 해온 뒤 바로 작업 하는 방법

[이유] 몇개 폴더가 git에 업로드가 안되어 있음

→ gitignore에 의해 /dist나 /build같은 파일이 안올라감

현업에서도 최소한의 소스만 남기고 그걸 클론해와서 각자 개발환경에 도입함

### [frontend]

1. 먼저 git을 자기 로컬로 clone
2. 터미널에서 clone한 폴더로 이동 후 cd frontend
3. npm install → 이거하면 node_modules 설치 됨
4. npm run build → 이거하면 dist 폴더 설치됨

이러면 React 구조 완성

📌 package-lock.json은 기존에 있던 파일 다시 복사 붙여넣기해서 사용 권장 (chatbot 관련 디자인 깨질 수도 있음)

### [backend]

1. 먼저 git을 자기 로컬로 clone
2. 터미널에서 clone한 폴더로 이동 후 cd backend
3. ./gradlew build → 이거 하면 build 폴더 생성 됨 (window는 명령어가 다를 수도)

→ 이렇게 git clone후 각자 환경에 맞게 설치 해주면 바로 사용가능

→ 위 방법대로 진행 후 ‘백-프론트 통합’ 문서에 있는 것과 똑같이 하면 원래 처럼 사용 가능 이 방법으로 클론해서 사용하는 것을 추천
