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
  const adminEmail = "admin@test.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("Admin1234", 12);
    const admin = await prisma.user.create({
      data: {
        firstName: "Campus",
        lastName: "Admin",
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
        firstName: "Demo",
        lastName: "Student",
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
  const baseEvents = [
    { title: "Tech Career Fair", desc: "Meet with top tech companies looking to hire students for internships and full-time roles. Bring your resumes!" },
    { title: "Campus Music Festival", desc: "Join us for an evening of live music performed by student bands. Food trucks will be available." },
    { title: "Machine Learning Workshop", desc: "A hands-on workshop covering the basics of neural networks and deep learning using PyTorch." },
    { title: "Inter-College Basketball Finals", desc: "Come support our university team as they face off against our rivals in the regional finals." },
    { title: "Annual Alumni Meet", desc: "Connect with our esteemed alumni network. Great opportunity for networking and mentorship." },
    { title: "Startup Pitch Competition", desc: "Watch student founders pitch their innovative ideas to a panel of venture capitalists." },
    { title: "Global Food Festival", desc: "Experience cuisines from over 20 different countries prepared by international student groups." },
    { title: "Design Thinking Bootcamp", desc: "An intensive weekend bootcamp on applying design thinking principles to solve real-world problems." },
    { title: "Hackathon 2026", desc: "48-hour coding marathon to build solutions for sustainability and social impact." },
    { title: "Mental Health Awareness Seminar", desc: "Guest speakers and interactive sessions on managing stress and maintaining mental wellbeing." },
    { title: "Robotics Exhibition", desc: "Showcase of autonomous robots and drones built by the engineering departments." },
    { title: "Photography Walk", desc: "Join the photography club for a guided photowalk around the historic parts of our campus." }
  ];
  const categories = ["TECHNICAL", "CULTURAL", "WORKSHOP", "SPORTS", "SOCIAL", "ACADEMIC"];
  const venues = ["Main Campus Hall", "Open Air Theatre", "Computer Lab 3", "Indoor Stadium", "University Club", "Innovation Center", "Main Quad", "Design Studio", "Library Auditorium", "Student Center"];
  
  const events: any[] = [];
  for (let i = 1; i <= 30; i++) {
    const base = baseEvents[i % baseEvents.length];
    const category = categories[i % categories.length];
    const venue = venues[i % venues.length];
    
    const daysOut = i + Math.floor(Math.random() * 5);
    const durationHours = 2 + Math.floor(Math.random() * 4);
    
    events.push({
      title: `${base.title} ${i}`,
      description: base.desc,
      category: category as any,
      bannerUrl: `/events/event-${i}.jpg`,
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * daysOut),
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * daysOut + 1000 * 60 * 60 * durationHours),
      registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * (daysOut - 2)),
      capacity: 50 + Math.floor(Math.random() * 450),
      venue: venue,
      createdById: adminId,
    });
  }

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
