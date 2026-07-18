import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const events = await prisma.event.findMany({
      orderBy: {
        startAt: "desc",
      },
      include: {
        _count: {
          select: { registrations: { where: { status: "ACTIVE" } } },
        },
      },
    });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin events:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, bannerUrl, category, venue, startAt, endAt, registrationDeadline, capacity, fees } = body;

    if (!title || !description || !venue || !startAt || !endAt || !registrationDeadline || capacity == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        bannerUrl,
        category: category || "OTHER",
        venue,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        registrationDeadline: new Date(registrationDeadline),
        capacity: parseInt(capacity, 10),
        fees: parseFloat(fees) || 0,
        createdById: session.userId,
      },
    });

    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
