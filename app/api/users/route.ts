import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { error } from "console"

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

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

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        _count: {
          select: {
            words: true,
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
