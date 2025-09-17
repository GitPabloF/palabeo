import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import {
  validateUserRegistrationData,
  createValidationErrorResponse,
} from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    // Parse and validate JSON
    let requestData
    try {
      requestData = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    // Validate registration data
    const validationResult = validateUserRegistrationData(requestData)
    if (!validationResult.success) {
      return NextResponse.json(
        createValidationErrorResponse(validationResult.errors),
        { status: 400 }
      )
    }

    const { email, password, name } = validationResult.data!

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    })

    // Return sanitized response (exclude password hash)
    return NextResponse.json(
      {
        message: "User created successfully",
        userId: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
