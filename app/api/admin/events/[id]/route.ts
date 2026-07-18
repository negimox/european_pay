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
    const { title, description, bannerUrl, category, venue, startAt, endAt, registrationDeadline, capacity, fees } = body;

    const event = await prisma.event.update({
      where: { id: p.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(bannerUrl !== undefined && { bannerUrl }),
        ...(category && { category }),
        ...(venue && { venue }),
        ...(startAt && { startAt: new Date(startAt) }),
        ...(endAt && { endAt: new Date(endAt) }),
        ...(registrationDeadline && { registrationDeadline: new Date(registrationDeadline) }),
        ...(capacity != null && { capacity: parseInt(capacity, 10) }),
        ...(fees != null && { fees: parseFloat(fees) }),
      },
    });

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error("Error updating event:", error);
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
    await prisma.event.delete({
      where: { id: p.id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
