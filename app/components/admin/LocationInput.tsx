"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function LocationInput({
  name,
  label,
  placeholder,
  value,
  onChange,
  onSelect,
}: {
  name: string;
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (val: string) => void;
  onSelect?: (
    coords: { lat: number; lon: number; name: string } | null,
  ) => void;
}) {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setQuery(value);
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query || query.length < 3) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
        );
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch (e) {
        console.error(e);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-2 relative" ref={wrapperRef}>
      <label className="text-sm font-medium text-foreground">{label} *</label>
      <div className="relative">
        <Input
          required
          name={name}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (onChange) onChange(e.target.value);
            if (onSelect && e.target.value === "") onSelect(null);
          }}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          className="pr-10 pl-10"
        />
        <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      {isOpen && results.length > 0 && (
        <div className="absolute z-[9999] w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-muted focus:bg-muted focus:outline-none transition-colors border-b border-border last:border-0 truncate"
              onClick={() => {
                setQuery(r.display_name);
                if (onChange) onChange(r.display_name);
                setIsOpen(false);
                if (onSelect) {
                  onSelect({
                    lat: parseFloat(r.lat),
                    lon: parseFloat(r.lon),
                    name: r.display_name,
                  });
                }
              }}
            >
              {r.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
