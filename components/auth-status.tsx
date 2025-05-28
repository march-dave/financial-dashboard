"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function AuthStatus() {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Status</CardTitle>
        <CardDescription>
          Check your current login status here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAuthenticated && user ? (
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback>
                {user.name?.split(" ").map(n => n[0]).join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="text-xs">
                Signed In
              </Badge>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Badge variant="outline" className="text-xs">
              Not Signed In
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">
              Click the Sign In button above to sign in.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 