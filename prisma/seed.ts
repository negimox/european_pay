import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString =
  process.env.DIRECT_URL || process.env.DATABASE_URL || "";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Admin user ─────────────────────────────────────────────────────────────
  const adminEmail = "admin@campus.edu";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("Admin@1234", 12);
    const admin = await prisma.user.create({
      data: {
        name: "Campus Admin",
        email: adminEmail,
        passwordHash,
        role: Role.ADMIN,
      },
    });
    console.log(`✅ Created admin: ${admin.email}`);
    await seedData(admin.id);
  } else {
    console.log(`ℹ️  Admin already exists: ${adminEmail}`);
    await seedData(existingAdmin.id);
  }

  // ── Demo student ───────────────────────────────────────────────────────────
  const studentEmail = "student@campus.edu";
  const existingStudent = await prisma.user.findUnique({
    where: { email: studentEmail },
  });

  if (!existingStudent) {
    const passwordHash = await bcrypt.hash("Student@1234", 12);
    const student = await prisma.user.create({
      data: {
        name: "Demo Student",
        email: studentEmail,
        passwordHash,
        role: Role.STUDENT,
      },
    });
    console.log(`✅ Created student: ${student.email}`);
  } else {
    console.log(`ℹ️  Student already exists: ${studentEmail}`);
  }

  console.log("🎉 Seeding complete!");
}

async function seedData(adminId: string) {
  // Clear existing events and announcements to avoid duplicates on re-run
  await prisma.event.deleteMany({});
  await prisma.announcement.deleteMany({});

  // Add Events
  const events = [
    {
      title: "Tech Career Fair 2026",
      description: "Meet with top tech companies looking to hire students for internships and full-time roles. Bring your resumes!",
      category: "TECHNICAL" as any,
      bannerUrl: "/events/1.jpg",
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 60 * 4),
      registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      capacity: 150,
      venue: "Main Campus Hall",
      createdById: adminId,
    },
    {
      title: "Campus Music Festival",
      description: "Join us for an evening of live music performed by student bands. Food trucks will be available.",
      category: "CULTURAL" as any,
      bannerUrl: "/events/music.jpg",
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10 + 1000 * 60 * 60 * 5),
      registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8),
      capacity: 500,
      venue: "Open Air Theatre",
      createdById: adminId,
    },
    {
      title: "Machine Learning Workshop",
      description: "A hands-on workshop covering the basics of neural networks and deep learning using PyTorch.",
      category: "WORKSHOP" as any,
      bannerUrl: "/events/1.jpg",
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12),
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12 + 1000 * 60 * 60 * 3),
      registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      capacity: 40,
      venue: "Computer Lab 3",
      createdById: adminId,
    },
    {
      title: "Inter-College Basketball Finals",
      description: "Come support our university team as they face off against our rivals in the regional finals.",
      category: "SPORTS" as any,
      bannerUrl: "/events/1.jpg",
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15 + 1000 * 60 * 60 * 2.5),
      registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      capacity: 800,
      venue: "Indoor Stadium",
      createdById: adminId,
    },
    {
      title: "Annual Alumni Meet",
      description: "Connect with our esteemed alumni network. Great opportunity for networking and mentorship.",
      category: "SOCIAL" as any,
      bannerUrl: "/events/1.jpg",
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20 + 1000 * 60 * 60 * 4),
      registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
      capacity: 200,
      venue: "University Club",
      createdById: adminId,
    },
    {
      title: "Startup Pitch Competition",
      description: "Watch student founders pitch their innovative ideas to a panel of venture capitalists.",
      category: "ACADEMIC" as any,
      bannerUrl: "/events/1.jpg",
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25),
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25 + 1000 * 60 * 60 * 3),
      registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
      capacity: 100,
      venue: "Innovation Center",
      createdById: adminId,
    },
    {
      title: "Global Food Festival",
      description: "Experience cuisines from over 20 different countries prepared by international student groups.",
      category: "CULTURAL" as any,
      bannerUrl: "/events/1.jpg",
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28),
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28 + 1000 * 60 * 60 * 6),
      registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 27),
      capacity: 1000,
      venue: "Main Quad",
      createdById: adminId,
    },
    {
      title: "Design Thinking Bootcamp",
      description: "An intensive weekend bootcamp on applying design thinking principles to solve real-world problems.",
      category: "WORKSHOP" as any,
      bannerUrl: "/events/1.jpg",
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 32),
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 33 + 1000 * 60 * 60 * 8),
      registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28),
      capacity: 50,
      venue: "Design Studio",
      createdById: adminId,
    }
  ];

  for (const ev of events) {
    await prisma.event.create({
      data: ev
    });
  }
  console.log("✅ Created events");

  // Add Announcements
  const announcements = [
    {
      title: "Welcome to the new UniEvents Portal!",
      content: "We're excited to launch the new student dashboard where you can easily find and register for campus events. Stay tuned for more updates!",
      publishedById: adminId,
    },
    {
      title: "Library Extended Hours for Finals",
      content: "The main campus library will remain open 24/7 starting next Monday to support students during the final exam period.",
      publishedById: adminId,
    },
    {
      title: "Campus Shuttle Route Changes",
      content: "Please note that the North Campus shuttle route has been modified due to ongoing construction. Check the transport page for the updated map.",
      publishedById: adminId,
    },
    {
      title: "Call for Volunteers: Graduation Week",
      content: "We are looking for student volunteers to assist with graduation ceremonies. Free meals and a certificate of appreciation will be provided.",
      publishedById: adminId,
    },
    {
      title: "New Fitness Center Equipment",
      content: "The student recreation center has just installed 15 new treadmills and a new weightlifting rig. Come check it out!",
      publishedById: adminId,
    },
    {
      title: "Security Alert: Phishing Emails",
      content: "Be cautious of recent phishing emails claiming to be from the IT department. Never share your password or click on suspicious links.",
      publishedById: adminId,
    }
  ];

  for (const ann of announcements) {
    await prisma.announcement.create({
      data: ann
    });
  }
  console.log("✅ Created announcements");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
