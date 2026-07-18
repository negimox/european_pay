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
  // Add Events
  const events = [
    {
      title: "Tech Career Fair 2026",
      description: "Meet with top tech companies looking to hire students for internships and full-time roles.",
      category: "TECHNICAL" as any,
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 60 * 4),
      registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      capacity: 50,
      venue: "Main Campus Hall",
      createdById: adminId,
    },
    {
      title: "Campus Music Festival",
      description: "Join us for an evening of live music performed by student bands.",
      category: "CULTURAL" as any,
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10 + 1000 * 60 * 60 * 3),
      registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8),
      capacity: 100,
      venue: "Open Air Theatre",
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
  await prisma.announcement.create({
    data: {
      title: "Welcome to the new UniEvents Portal!",
      content: "We're excited to launch the new student dashboard where you can easily find and register for campus events. Stay tuned for more updates!",
      publishedById: adminId,
    }
  });
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
