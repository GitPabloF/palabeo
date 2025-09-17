"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ValidationError } from "@/lib/validation"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFieldErrors({}) // Reset field errors

    // Client-side validation
    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match" })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to login page with success message
        router.push(
          "/login?message=Account created successfully! Please sign in."
        )
      } else {
        // Handle detailed validation errors
        if (data.details && Array.isArray(data.details)) {
          // Create errors object by field
          const errorsByField: Record<string, string> = {}
          data.details.forEach((error: ValidationError) => {
            errorsByField[error.field] = error.message
          })
          setFieldErrors(errorsByField)
        } else {
          // Simple error
          setFieldErrors({ general: data.error || "Something went wrong" })
        }
      }
    } catch (error) {
      setFieldErrors({ general: "Something went wrong" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {fieldErrors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {fieldErrors.general}
                </div>
              )}

              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={
                    fieldErrors.name
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {fieldErrors.name && (
                  <div className="text-red-500 text-sm">{fieldErrors.name}</div>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={
                    fieldErrors.email
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {fieldErrors.email && (
                  <div className="text-red-500 text-sm">
                    {fieldErrors.email}
                  </div>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={
                    fieldErrors.password
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {fieldErrors.password && (
                  <div className="text-red-500 text-sm">
                    {fieldErrors.password}
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  Password must contain: uppercase, lowercase, number, special
                  character (8+ chars)
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={
                    fieldErrors.confirmPassword
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {fieldErrors.confirmPassword && (
                  <div className="text-red-500 text-sm">
                    {fieldErrors.confirmPassword}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
