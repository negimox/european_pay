"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TopNav() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearch, setIsMobileSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop bg-surface h-16 shadow-sm">
      {isMobileSearch ? (
        <div className="flex items-center w-full gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileSearch(false)}
            className="rounded-full shrink-0 text-on-surface-variant hover:bg-surface-container"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Button>
          <form
            onSubmit={handleSearch}
            data-slot="button-group"
            className="flex items-center w-full flex-1 -space-x-px"
          >
            <div className="relative flex-1 flex">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                search
              </span>
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-r-none pl-8 focus-visible:z-10"
              />
            </div>
            <Button
              type="submit"
              variant="outline"
              size="icon"
              className="rounded-l-none shrink-0 border-l-0"
            >
              <span className="material-symbols-outlined text-muted-foreground">
                search
              </span>
            </Button>
          </form>
        </div>
      ) : (
        <>
          <div className="flex items-center flex-1">
            <SidebarTrigger className="lg:hidden mr-2" />
          </div>

          <div className="hidden md:flex flex-[2] justify-center px-4 w-full">
            <form
              onSubmit={handleSearch}
              data-slot="button-group"
              className="relative w-full flex -space-x-px"
            >
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full flex-1 rounded-r-none focus-visible:z-10 bg-surface-container-lowest h-10"
              />
              <Button
                type="submit"
                variant="outline"
                className="rounded-l-none shrink-0 border-l-0 bg-surface-container-low hover:bg-surface-container transition-colors h-10 px-4"
              >
                <span className="material-symbols-outlined text-muted-foreground">
                  search
                </span>
              </Button>
            </form>
          </div>

          <div className="flex items-center justify-end gap-sm md:gap-md flex-1">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileSearch(true)}
              className="md:hidden rounded-full shrink-0 text-on-surface-variant hover:bg-surface-container"
            >
              <span className="material-symbols-outlined">search</span>
            </Button>

            <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border-2 border-surface cursor-pointer shrink-0">
              <Image
                src="/web-app-manifest-512x512.png"
                alt="Student Profile Picture"
                width={40}
                height={40}
                className="w-full h-full object-cover p-1"
              />
            </div>
          </div>
        </>
      )}
    </header>
  );
}
