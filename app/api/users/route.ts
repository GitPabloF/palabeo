import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Create a new user
 * @param request - The request object
 * @returns The created user
 */
export async function POST(request: NextRequest) {
  try {
    const { email, name, userLanguage, learnedLanguage } = await request.json()

    if (!email || !name) {
      return NextResponse.json(
        { error: "Must have an email and name" },
        { status: 400 }
      )
    }

    // verify is the user already exist
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exist with this email" },
        { status: 409 }
      )
    }
    // create the user
    const user = await prisma.user.create({
      data: {
        email,
        name: name,
        userLanguage: userLanguage || "en",
        learnedLanguage: learnedLanguage || "es",
      },
    })

    return NextResponse.json(
      {
        message: "User sucessfully created",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Could not create the user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Get all users
 * @returns The users
 */
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        userLanguage: true,
        learnedLanguage: true,
        userWords: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            userWords: true,
          },
        },
      },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error occured when get all the users: ", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
