import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const events = await prisma.event.findMany({
      where: {
        startAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        startAt: "asc",
      },
      include: {
        _count: {
          select: { registrations: { where: { status: "ACTIVE" } } },
        },
      },
    });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
