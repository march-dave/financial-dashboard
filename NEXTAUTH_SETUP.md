# NextAuth 설정 가이드

이 프로젝트에는 NextAuth.js를 사용한 Google OAuth 인증이 구현되어 있습니다.

## 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 다음 환경 변수들을 추가하세요:

```env
# NextAuth 설정
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth 설정
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

## Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트를 생성하거나 기존 프로젝트 선택
3. "APIs & Services" > "Credentials"로 이동
4. "Create Credentials" > "OAuth 2.0 Client IDs" 선택
5. Application type을 "Web application"으로 설정
6. Authorized redirect URIs에 다음 URL 추가:
   - `http://localhost:3000/api/auth/callback/google` (개발환경)
   - `https://yourdomain.com/api/auth/callback/google` (프로덕션)

## NEXTAUTH_SECRET 생성

다음 명령어로 랜덤 시크릿을 생성할 수 있습니다:

```bash
openssl rand -base64 32
```

## 주요 파일 구조

```
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # NextAuth API 라우트
│   ├── auth/
│   │   ├── signin/page.tsx              # 로그인 페이지
│   │   └── error/page.tsx               # 인증 오류 페이지
│   └── layout.tsx                       # SessionProvider 설정
├── lib/
│   └── auth.ts                          # NextAuth 설정
├── components/
│   ├── providers/session-provider.tsx   # SessionProvider 래퍼
│   ├── auth-status.tsx                  # 인증 상태 표시 컴포넌트
│   └── top-nav.tsx                      # 로그인/로그아웃 버튼
├── hooks/
│   └── use-auth.ts                      # 인증 관련 커스텀 훅
├── types/
│   └── next-auth.d.ts                   # NextAuth 타입 확장
└── middleware.ts                        # 라우트 보호 미들웨어
```

## 사용법

### 1. 인증 상태 확인

```tsx
import { useAuth } from "@/hooks/use-auth"

function MyComponent() {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) return <div>로딩 중...</div>
  if (!isAuthenticated) return <div>로그인이 필요합니다.</div>

  return <div>안녕하세요, {user?.name}님!</div>
}
```

### 2. 로그인/로그아웃

```tsx
import { signIn, signOut } from "next-auth/react"

// 로그인
await signIn("google")

// 로그아웃
await signOut({ callbackUrl: "/auth/signin" })
```

### 3. 서버 사이드에서 세션 확인

```tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)
  
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}
```

## 보호된 라우트

`middleware.ts`에서 다음 라우트들이 인증을 요구하도록 설정되어 있습니다:

- `/analytics/*`
- `/chat/*`
- `/invoices/*`
- `/meetings/*`
- `/members/*`
- `/organization/*`
- `/payments/*`
- `/payroll/*`
- `/permissions/*`
- `/projects/*`
- `/settings/*`
- `/timesheet/*`
- `/transactions/*`

## 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하여 인증 기능을 테스트할 수 있습니다.

## 문제 해결

### 1. "Configuration" 오류
- `NEXTAUTH_SECRET`이 설정되어 있는지 확인
- Google OAuth 설정이 올바른지 확인

### 2. "AccessDenied" 오류
- Google Cloud Console에서 OAuth 동의 화면 설정 확인
- 테스트 사용자 추가 (개발 단계)

### 3. Redirect URI 오류
- Google Cloud Console의 Authorized redirect URIs 설정 확인
- 정확한 콜백 URL이 등록되어 있는지 확인 