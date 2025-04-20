# 🐝 CodeHive (React SPA 리뉴얼 버전)

> 📌 이 레포지토리는 [기존 Spring Boot 기반 SSR 프로젝트](https://github.com/hyese95/BIT-HIVE-Team.codehive-)를 **React 기반 SPA로 리팩토링**하는 작업을 진행 중인 **프론트엔드 전용 리포지토리**입니다.

---

## 🎯 프로젝트 소개

**CodeHive**는 실시간 비트코인 시세 확인, 모의 투자, 수익률 분석 기능 등을 제공하는 가상 투자 플랫폼입니다.  
이전 버전은 Spring Boot + Thymeleaf 기반의 서버 사이드 렌더링(SSR) 구조였으며,  
현재는 **React 기반 Single Page Application(SPA)**으로 리뉴얼 중입니다.

---

## ✨ 주요 기능 (개발 중)

- 📈 업비트 API 기반 실시간 시세 및 차트 표시  
- 💰 모의투자 및 가상 자산 관리  
- 📊 투자 수익률 계산 및 시각화  
- 🧾 거래내역, 포트폴리오 요약  
- 🔒 사용자 인증 및 정보 관리 (예정)  
- 🗣️ 커뮤니티 피드 기능 (예정)  

---

## 🛠️ 기술 스택

| 영역        | 기술                                       |
|-------------|--------------------------------------------|
| **Frontend**| React, React Router, Axios, SASS(SCSS)     |
| **Backend** | 기존 Spring Boot 프로젝트 연동 예정        |
| **API**     | Upbit Open API                             |
| **Chart**   | TradingView(Ligthweight Chart)라이브러리   |

---

## 📁 프로젝트 구조 예시

```
codehive-react/
├── public/
├── src/
│   ├── components/       # 재사용 가능한 컴포넌트
│   ├── pages/            # 라우트 단위 화면
│   ├── hooks/            # 커스텀 훅
│   ├── utils/            # 헬퍼 함수
│   ├── styles/           # SCSS 스타일 모듈
│   └── App.jsx           # 진입 컴포넌트
├── .env
├── package.json
└── README.md
```

---

## 📦 로컬 실행 방법

```bash
# 1. 클론
git clone https://github.com/realsydrid/codehive-react.git
cd codehive-react

# 2. 패키지 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

---

## 🔗 관련 레포지토리

- 💻 [Spring Boot + Thymeleaf SSR 프로젝트](https://github.com/hyese95/BIT-HIVE-Team.codehive-)



