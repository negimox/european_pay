import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/app/components/dashboard/EventCard";
import { ModeToggle } from "@/components/theme-toggle";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  EVENT_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  CATEGORY_COLORS,
  CATEGORY_BG_COLORS,
} from "@/config/categories";

export default async function RootPage() {
  const session = await getSession();
  if (session) {
    if (session.role === "ADMIN") redirect("/admin");
    redirect("/dashboard");
  }

  // Fetch upcoming events
  const upcomingEvents = await prisma.event.findMany({
    where: {
      startAt: {
        gte: new Date(),
      },
    },
    orderBy: {
      startAt: "asc",
    },
    take: 6,
    include: {
      _count: {
        select: { registrations: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col relative overflow-hidden">
      {/* Background Doodles & Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/15 dark:bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/15 dark:bg-secondary/5 blur-[120px]" />
        <svg
          className="absolute w-full h-full opacity-10 dark:opacity-[0.05] text-foreground"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="doodle-pattern"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M10 10 Q 20 20, 30 10 T 50 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="80" cy="20" r="3" fill="currentColor" />
              <rect
                x="20"
                y="70"
                width="8"
                height="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                transform="rotate(45 24 74)"
              />
              <path
                d="M70 80 L 90 90 M 90 80 L 70 90"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </pattern>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#doodle-pattern)"
          />
        </svg>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop bg-surface/80 backdrop-blur-md h-16 shadow-sm border-b border-outline-variant/30">
        <div className="flex items-center flex-1">
          <Link href="/" className="flex items-center gap-2 group select-none">
            <Image
              src="/web-app-manifest-512x512.png"
              alt="UniEvent Logo"
              width={24}
              height={24}
              className="pointer-events-none"
            />
            <span className="font-headline-sm text-[18px] font-bold text-primary group-hover:text-primary/80 transition-colors">
              UniEvents
            </span>
          </Link>
        </div>

        <div className="flex items-center justify-end gap-sm md:gap-md flex-1">
          <ModeToggle />
          <div className="flex items-center gap-2 ml-2">
            <Button variant="outline" className="rounded-full font-bold">
              <Link href="/login">Log in</Link>
            </Button>
            <Button className="rounded-full font-bold shadow-md hover:shadow-lg transition-shadow">
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full relative z-10 px-margin-mobile md:px-margin-desktop pb-20">
        {/* Hero Section */}
        <section className="w-full max-w-5xl pt-20 md:pt-28 pb-16 md:pb-24 flex flex-col items-center text-center">
          <h1 className="font-sans text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 mb-6 drop-shadow-sm pb-2">
            Find{" "}
            <span className="text-primary italic font-serif pr-2">fun</span>{" "}
            events
            <br />
            near you.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed mb-10">
            Connect with your campus community. Discover academic workshops,
            cultural festivals, sports tournaments, and everything in between.
          </p>
          <Button
            size="lg"
            className="rounded-full h-14 px-8 text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <Link href="/login">
              Explore Events
              <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </Button>
        </section>

        {/* Upcoming Events Carousel */}
        {upcomingEvents.length > 0 && (
          <section className="w-full max-w-7xl pt-10 pb-20">
            <div className="flex justify-between items-end mb-8 px-2 md:px-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                  Upcoming Events
                </h2>
                <p className="text-muted-foreground font-medium">
                  Don't miss out on what's happening next.
                </p>
              </div>
              <Button
                variant="ghost"
                className="hidden md:flex font-bold text-primary hover:bg-primary/10 rounded-full"
              >
                <Link href="/login">
                  View All{" "}
                  <span className="material-symbols-outlined ml-1 text-[20px]">
                    arrow_forward
                  </span>
                </Link>
              </Button>
            </div>

            <div className="px-2 md:px-12 w-full max-w-[100vw] md:max-w-none">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4 md:-ml-6">
                  {upcomingEvents.map((event) => (
                    <CarouselItem
                      key={event.id}
                      className="pl-4 md:pl-6 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3"
                    >
                      <Link
                        href="/login"
                        className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[20px]"
                      >
                        <EventCard
                          event={{
                            ...event,
                            startAt: event.startAt.toISOString(),
                            registrationDeadline:
                              event.registrationDeadline?.toISOString(),
                          }}
                        />
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="-left-12 h-12 w-12 border-2 hover:bg-surface hover:text-primary shadow-sm" />
                  <CarouselNext className="-right-12 h-12 w-12 border-2 hover:bg-surface hover:text-primary shadow-sm" />
                </div>
              </Carousel>
            </div>
            <div className="mt-8 flex justify-center md:hidden px-2">
              <Button
                variant="outline"
                className="w-full max-w-sm rounded-full font-bold h-12 border-2"
              >
                <Link href="/login">View All Events</Link>
              </Button>
            </div>
          </section>
        )}

        {/* Categories Section */}
        <section className="w-full max-w-7xl py-16 px-2 md:px-4 border-t border-outline-variant/30">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Browse by Category
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {EVENT_CATEGORIES.map((category) => {
              const label = CATEGORY_LABELS[category];
              const icon = CATEGORY_ICONS[category];
              const textColor = CATEGORY_COLORS[category];
              const bgColor = CATEGORY_BG_COLORS[category];

              return (
                <Link key={category} href="/login">
                  <div className="group relative overflow-hidden rounded-3xl border border-outline-variant/50 bg-surface-container-lowest p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer flex flex-col items-center text-center gap-4 hover:-translate-y-1">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${bgColor}`}
                    >
                      <span
                        className={`material-symbols-outlined text-[32px] ${textColor}`}
                      >
                        {icon}
                      </span>
                    </div>
                    <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-outline-variant/30 bg-surface-container-lowest py-8 z-10 relative">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 select-none opacity-80">
            <Image
              src="/web-app-manifest-512x512.png"
              alt="UniEvent Logo"
              width={20}
              height={20}
              className="grayscale"
            />
            <span className="font-headline-sm text-[16px] font-bold text-foreground tracking-tight">
              UniEvents
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            © {new Date().getFullYear()} UniEvents. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
