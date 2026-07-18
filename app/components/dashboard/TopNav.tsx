"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

interface TopNavProps {
  user?: {
    firstName: string;
    lastName: string | null;
    email: string;
  } | null;
}

export function TopNav({ user }: TopNavProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearch, setIsMobileSearch] = useState(false);

  const userName = user ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}` : "Student";
  const userInitials = user ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ""}`.toUpperCase() : "S";
  const userEmail = user?.email || "student@example.com";

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

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

            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-10 w-10 rounded-full shrink-0 outline-none flex items-center justify-center focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Avatar className="h-10 w-10 border-2 border-surface cursor-pointer">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userEmail}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard/settings")} className="cursor-pointer">
                  <span className="material-symbols-outlined mr-2 text-[18px]">settings</span>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                  <span className="material-symbols-outlined mr-2 text-[18px]">logout</span>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </header>
  );
}
