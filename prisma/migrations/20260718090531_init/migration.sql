-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('ACTIVE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('ACADEMIC', 'CULTURAL', 'SPORTS', 'TECHNICAL', 'WORKSHOP', 'SOCIAL', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bannerUrl" TEXT,
    "category" "EventCategory" NOT NULL DEFAULT 'OTHER',
    "venue" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "registrationDeadline" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registrations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'ACTIVE',
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "publishedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "events_createdById_idx" ON "events"("createdById");

-- CreateIndex
CREATE INDEX "events_category_idx" ON "events"("category");

-- CreateIndex
CREATE INDEX "events_startAt_idx" ON "events"("startAt");

-- CreateIndex
CREATE INDEX "events_registrationDeadline_idx" ON "events"("registrationDeadline");

-- CreateIndex
CREATE INDEX "registrations_userId_idx" ON "registrations"("userId");

-- CreateIndex
CREATE INDEX "registrations_eventId_idx" ON "registrations"("eventId");

-- CreateIndex
CREATE INDEX "registrations_status_idx" ON "registrations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "registrations_userId_eventId_key" ON "registrations"("userId", "eventId");

-- CreateIndex
CREATE INDEX "announcements_publishedById_idx" ON "announcements"("publishedById");

-- CreateIndex
CREATE INDEX "announcements_createdAt_idx" ON "announcements"("createdAt");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_publishedById_fkey" FOREIGN KEY ("publishedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
