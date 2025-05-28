"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Suspense } from "react"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration."
      case "AccessDenied":
        return "Access was denied."
      case "Verification":
        return "The token has expired or has already been used."
      default:
        return "An error occurred during authentication."
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-red-600">
          Authentication Error
        </CardTitle>
        <CardDescription>
          {getErrorMessage(error)}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Link href="/auth/signin">
          <Button className="w-full">
            Try Again
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 pt-32">
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-600">
              Authentication Error
            </CardTitle>
            <CardDescription>
              Loading...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth/signin">
              <Button className="w-full">
                Try Again
              </Button>
            </Link>
          </CardContent>
        </Card>
      }>
        <AuthErrorContent />
      </Suspense>
    </div>
  )
} 