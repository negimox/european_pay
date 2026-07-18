import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { registrations: { where: { status: "ACTIVE" } } },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check capacity
    const currentRegistrations = event._count.registrations;
    if (currentRegistrations >= event.capacity) {
      return NextResponse.json(
        { error: "Event is fully booked" },
        { status: 400 }
      );
    }

    // Check registration deadline
    if (new Date() > event.registrationDeadline) {
      return NextResponse.json(
        { error: "Registration deadline has passed" },
        { status: 400 }
      );
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {
      // Ignored for empty bodies
    }

    const { tshirtSize, dietaryRequirements } = body;

    // Upsert registration (handle case where user previously cancelled)
    const registration = await prisma.registration.upsert({
      where: {
        userId_eventId: {
          userId: session.userId,
          eventId: eventId,
        },
      },
      update: {
        status: "ACTIVE",
        tshirtSize: tshirtSize || null,
        dietaryRequirements: dietaryRequirements || null,
      },
      create: {
        userId: session.userId,
        eventId: eventId,
        status: "ACTIVE",
        tshirtSize: tshirtSize || null,
        dietaryRequirements: dietaryRequirements || null,
      },
    });

    return NextResponse.json({ registration }, { status: 200 });
  } catch (error) {
    console.error("Error registering for event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;

    // We use soft delete / status update here
    const registration = await prisma.registration.update({
      where: {
        userId_eventId: {
          userId: session.userId,
          eventId: eventId,
        },
      },
      data: {
        status: "CANCELLED",
      },
    });

    return NextResponse.json({ registration }, { status: 200 });
  } catch (error) {
    console.error("Error cancelling registration:", error);
    // Might fail if not found, we can catch it specifically if needed
    return NextResponse.json(
      { error: "Failed to cancel registration or registration not found" },
      { status: 400 }
    );
  }
}
