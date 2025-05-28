import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // 추가적인 미들웨어 로직이 필요한 경우 여기에 작성
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    // 보호할 라우트들을 지정
    "/",
    "/analytics/:path*",
    "/chat/:path*",
    "/invoices/:path*",
    "/meetings/:path*",
    "/members/:path*",
    "/organization/:path*",
    "/payments/:path*",
    "/payroll/:path*",
    "/permissions/:path*",
    "/projects/:path*",
    "/settings/:path*",
    "/timesheet/:path*",
    "/transactions/:path*",
  ]
} 