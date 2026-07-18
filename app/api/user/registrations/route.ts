import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const registrations = await prisma.registration.findMany({
      where: {
        userId: session.userId,
        status: "ACTIVE",
      },
      include: {
        event: {
          include: {
            _count: {
              select: { registrations: true },
            },
          },
        },
      },
      orderBy: {
        registeredAt: "desc",
      },
    });

    return NextResponse.json({ registrations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
