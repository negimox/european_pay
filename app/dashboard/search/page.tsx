"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const router = useRouter();

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    // Search query
    if (query && !event.title.toLowerCase().includes(query.toLowerCase()) && !event.description.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    // Categories filter (just as an example, since 'Event' and 'Workshop' are categories we saw)
    if (selectedCategories.length > 0 && !selectedCategories.includes(event.category || 'Events')) {
      return false;
    }
    return true;
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop bg-surface-bright flex-1">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-xs font-label-md text-label-md text-on-surface-variant mb-lg">
        <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface font-medium truncate">Search</span>
      </nav>

      <div className="mb-lg">
        <h2 className="font-headline-lg text-headline-lg lg:text-display-lg text-on-surface font-bold">Search Results</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">
          Showing {filteredEvents.length} results {query && <span>for "<span className="font-semibold text-primary">{query}</span>"</span>}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-gutter">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-1/4">
          <Card className="bg-surface-container-lowest border-outline-variant shadow-sm sticky top-24">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-headline-md text-headline-md text-on-surface">Filters</CardTitle>
              <button 
                onClick={() => setSelectedCategories([])}
                className="font-label-sm text-label-sm text-secondary hover:underline"
              >
                Clear All
              </button>
            </CardHeader>
            
            <CardContent className="space-y-md pt-0">
              {/* Category Filter */}
              <div>
                <h4 className="font-label-md text-label-md font-semibold text-on-surface-variant mb-sm">Category</h4>
                <div className="space-y-sm flex flex-col">
                  {['Events', 'Announcements', 'Clubs'].map(cat => (
                    <label key={cat} className="flex items-center gap-sm cursor-pointer w-fit">
                      <Checkbox 
                        checked={selectedCategories.includes(cat)}
                        onCheckedChange={() => toggleCategory(cat)}
                      />
                      <span className="font-body-md text-body-md text-on-surface">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Date Filter */}
              <div>
                <h4 className="font-label-md text-label-md font-semibold text-on-surface-variant mb-sm">Date</h4>
                <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-sm font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary">
                  <option>Any Time</option>
                  <option>Upcoming</option>
                  <option>Past Week</option>
                  <option>Past Month</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Results List */}
        <div className="w-full lg:w-3/4 space-y-lg">
          <section>
            <h3 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant pb-sm mb-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-secondary">event</span>
              Events
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {loading ? (
                <div className="p-4 bg-surface-container-low rounded-xl h-[300px] animate-pulse w-full"></div>
              ) : filteredEvents.length === 0 ? (
                <p className="text-on-surface-variant">No events match your search.</p>
              ) : (
                filteredEvents.map(event => (
                  <Card key={event.id} onClick={() => router.push(`/dashboard/events/${event.id}`)} className="bg-surface-container-lowest border-outline-variant rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col group cursor-pointer p-0">
                    <div className="h-40 overflow-hidden relative bg-surface-container flex items-center justify-center">
                      <img src={event.bannerUrl || "/events/1.jpg"} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <Badge variant="secondary" className="absolute top-sm right-sm bg-surface-container-lowest/90 backdrop-blur-sm font-label-sm text-label-sm text-primary">
                        {new Date(event.startAt).toLocaleDateString()}
                      </Badge>
                    </div>
                    
                    <CardHeader className="p-4 pb-0 flex-1">
                      <div className="flex gap-sm mb-sm">
                        <Badge className="bg-primary-container text-on-primary-container font-label-sm text-label-sm hover:bg-primary-container/80">{event.category || 'Event'}</Badge>
                      </div>
                      <CardTitle className="font-headline-md text-headline-md text-on-surface mb-sm line-clamp-1">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="font-body-md text-body-md text-on-surface-variant mb-md line-clamp-2">{event.description}</p>
                    </CardContent>
                    
                    <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between border-t border-outline-variant/50">
                      <div className="flex items-center gap-sm text-on-surface-variant font-label-sm text-label-sm mt-4">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        <span className="truncate max-w-[120px]">{event.venue}</span>
                      </div>
                      <button className="text-secondary font-label-md text-label-md hover:underline mt-4">View Details</button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Search Results...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
