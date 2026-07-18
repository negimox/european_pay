import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const p = await params;
    const body = await req.json();
    const { title, content, attachments } = body;

    // Validate if title provided
    if (title) {
      const titleWords = title.trim().split(/\s+/).length;
      if (titleWords <= 5 || titleWords > 35) {
        return NextResponse.json({ error: "Title must be greater than 5 and less than or equal to 35 words" }, { status: 400 });
      }
    }

    // Validate if content provided
    if (content) {
      const contentWords = content.trim().split(/\s+/).length;
      if (contentWords > 1000) {
        return NextResponse.json({ error: "Description must be 1000 words or less" }, { status: 400 });
      }
    }

    const announcement = await prisma.announcement.update({
      where: { id: p.id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(attachments && { attachments }),
      },
    });

    return NextResponse.json({ announcement }, { status: 200 });
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const p = await params;
    await prisma.announcement.delete({
      where: { id: p.id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
