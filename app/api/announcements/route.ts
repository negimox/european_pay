import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const announcements = await prisma.announcement.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Limit to recent announcements
    });

    return NextResponse.json({ announcements }, { status: 200 });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
