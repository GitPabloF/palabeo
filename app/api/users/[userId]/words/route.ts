import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await params
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    const {
      wordFrom,
      wordTo,
      exampleFrom,
      exampleTo,
      langFrom,
      langTo,
      typeName,
      typeCode,
    } = await request.json()

    if (
      !wordFrom ||
      !wordTo ||
      !langFrom ||
      !langTo ||
      !typeName ||
      !typeCode
    ) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      )
    }

    const userWord = await prisma.word.findFirst({
      where: {
        wordFrom: {
          equals: wordFrom,
          mode: "insensitive",
        },
        wordTo: {
          equals: wordTo,
          mode: "insensitive",
        },
        userId,
      },
    })

    if (userWord) {
      return NextResponse.json({ error: "Already exists" }, { status: 409 })
    }

    const word = await prisma.word.create({
      data: {
        wordFrom,
        wordTo,
        exampleFrom: exampleFrom || "",
        exampleTo: exampleTo || "",
        langFrom,
        langTo,
        typeName,
        typeCode,
        userId: userId,
      },
    })

    return NextResponse.json({ message: "Word added", word }, { status: 201 })
  } catch (error) {
    console.error("Erreur création mot:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    const { searchParams } = new URL(request.url)
    const langFrom = searchParams.get("langFrom")
    const langTo = searchParams.get("langTo")
    const typeCode = searchParams.get("typeCode")
    const mastered = searchParams.get("mastered")

    const where: any = { userId: userId }

    if (langFrom) where.langFrom = langFrom
    if (langTo) where.langTo = langTo
    if (typeCode) where.typeCode = typeCode
    if (mastered !== null) where.mastered = mastered === "true"
    const words = await prisma.word.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(words)
  } catch (error) {
    console.error("Error fetching words:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
