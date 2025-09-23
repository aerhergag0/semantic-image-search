# Semantic Image Search

[https://semantic-image-search-frontend-aerhergag0s-projects.vercel.app/](https://semantic-image-search-frontend-8u3tfqrbh-aerhergag0s-projects.vercel.app/)

### 소개

---

이 프로젝트는 벡터 유사도 검색을 활용하여 의미론적 유사성을 기반으로 이미지를 검색할 수 있는 프로젝트입니다.

- **semantic image search란** : 벡터 유사도 검색을 활용해 의미론적 유사성을 기반으로 이미지를 검색할 수 있습니다.
- **이미지 임베딩**: 검색을 위한 약 30,000개의 샘플 이미지를 벡터로 임베딩하여 데이터베이스에 저장하였습니다.
- **다국어 지원**: sentence-transformers의 다국어 모델을 사용하여 한국어 및 기타 언어 검색을 지원합니다.

<div align="center">
   <img alt="Image-Embedding-Flow" src="/asset/emb_flow.png"/>
</div>

- 사용자가 검색 쿼리를 입력하거나 또는 이미지를 업로드하면, OpenAI의 CLIP 모델과 같은 벡터 공간을 공유하는
  sentence-transformers/clip-ViT-B-32 모델에 의해 임베딩되어 512 차원의 벡터로 변환됩니다.
- 이 벡터는 입력 데이터의 의미적 특징을 나타내며, 이를 통해 데이터 간 유사도를 계산할 수
  있습니다. 인코딩된 벡터는 데이터베이스에 저장됩니다. 이러한 벡터 임베딩을 통해 벡터 공간에서 유사한 항목을 검색할 수 있습니다.

<div align="center">
   <img alt="ImageSearch" src="https://raw.githubusercontent.com/UKPLab/sentence-transformers/master/docs/img/ImageSearch.png"/>
</div>
- sentence-transformer의 모델을 이용하여 이미지와 텍스트를 유사한 벡터 공간에 임베딩 한 후 유사한 이미지를 찾고 이미지 검색을 구현 할 수 있습니다.

> 출처: [Sentence-Transformers Image Search](https://www.sbert.net/examples/applications/image-search/README.html)



---

### Demo

1. **이미지 업로드**: 프론트엔드 인터페이스를 통해 이미지를 업로드하면, 이미지가 S3에 저장됨과 동시에 PostgreSQL 데이터베이스에 벡터로 임베딩됩니다. 저장된 값은 검색에 이용됩니다.
   <div align="center">
      <img alt="Image-Upload-Demo" src="/asset/demo1.gif"/>
   </div>


2. **이미지 검색**: 검색 쿼리를 임베딩 한 후, 데이터베이스의 임베딩된 값을 코사인 유사도로 검색하여 거리가 가까운 순으로 유사한 값을 찾아 결과를 보여줍니다.
   <div align="center">
      <img alt="Image-Search-Demo" src="/asset/demo2.gif"/>
   </div>

---

### 프로젝트 구조

<div align="center">
   <img alt="Flow" src="/asset/flow.png"/>
</div>

---

### 기술 스택

- FastAPI
- Next.js 14
- PostgreSQL 12+
- ~~Naver Cloud Platform~~ (현재 로컬에서 터널링으로 배포 중), Vercel
- Amazon S3

### 라이브러리

- SQLModel
- pgvector
- sentence-transformers/clip-ViT-B-32-multilingual-v1
- NextUI

---
### 설정

.env

```javascript
// (~/backend/.env)
APP_POSTGRESQL_DB_URL=      // PostgreSQL 데이터베이스 URL

APP_ALLOWED_ORIGINS=        // 허용된 오리진 설정

APP_DEV_FRONTEND_URL=       // 개발 환경 프론트엔드 URL
APP_DEV_BACKEND_URL=        // 개발 환경 백엔드 URL
APP_FRONTEND_URL=           // 배포된 프론트엔드 URL
APP_BACKEND_URL=            // 배포된 백엔드 URL

APP_S3_BUCKET_PATH=         // S3 버킷 경로
APP_UPLOADS_PATH=           // 업로드된 파일 경로
```

```javascript
// (~/frontend/.env)
NEXT_PUBLIC_BACKEND_API_BASE_URL=       // 배포된 프론트엔드 URL
NEXT_PUBLIC_FRONTEND_API_BASE_URL=      // 배포된 백엔드 URL

NEXT_PUBLIC_AWS_ACCESS_KEY_ID=          // AWS 접근 키 ID
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=      // AWS 접근 엑세스 키
NEXT_PUBLIC_AWS_REGION=                 // AWS 리전
NEXT_PUBLIC_AWS_BUCKET_NAME=            // AWS 버켓 이름
```
---
### 참고 사이트 및 이미지 출처

- [Sentence-Transformers](https://github.com/UKPLab/sentence-transformers)
- [Vercel Examples](https://github.com/vercel/examples)
- [Kaggle - Food Recognition Dataset](https://www.kaggle.com/datasets/awsaf49/food-recognition-2022-dataset)
- [Unsplash Data](https://unsplash.com/data)





