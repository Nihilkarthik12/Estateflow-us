import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Property } from "@/types";
import { BedDouble, Bath, Maximize2, MapPin, Search, SlidersHorizontal } from "lucide-react";
import ChatWidget from "@/components/chat/ChatWidget";

function formatPrice(price: number) {
  if (price >= 1e6) return `$${(price / 1e6).toFixed(price % 1e6 === 0 ? 0 : 1)}M`;
  if (price >= 1e3) return `$${(price / 1e3).toFixed(0)}K`;
  return `$${price.toLocaleString("en-US")}`;
}

const TYPE_LABELS: Record<string, string> = {
  "single-family":    "Single-Family",
  condo:              "Condo",
  townhouse:          "Townhouse",
  penthouse:          "Penthouse",
  studio:             "Studio",
  apartment:          "Apartment",
  "multi-family":     "Multi-Family",
  villa:              "Villa",
  commercial:         "Commercial",
  plot:               "Land",
};

// Fallback Unsplash images per property type — used when DB has no image
const TYPE_FALLBACK: Record<string, string> = {
  "single-family":  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=75",
  condo:            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=75",
  townhouse:        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=75",
  penthouse:        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=75",
  studio:           "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=75",
  apartment:        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=75",
  "multi-family":   "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=75",
  villa:            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=75",
  default:          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=75",
};

function getImage(property: Property): string {
  if (property.images?.[0]) return property.images[0];
  return TYPE_FALLBACK[property.property_type ?? ""] ?? TYPE_FALLBACK.default;
}

interface SearchParams {
  city?: string; type?: string; beds?: string; max_price?: string;
}

export default async function ListingsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("properties")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false });

  if (params.city)      query = query.ilike("city", `%${params.city}%`);
  if (params.type)      query = query.eq("property_type", params.type);
  if (params.beds)      query = query.gte("bedrooms", Number(params.beds));
  if (params.max_price) query = query.lte("price", Number(params.max_price));

  const { data: properties } = await query.limit(48);
  const count = properties?.length ?? 0;
  const hasFilters = !!(params.city || params.type || params.beds || params.max_price);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-black">E</span>
            </div>
            <span className="text-[17px] font-bold text-slate-900">
              Estate<span className="text-blue-600">Flow</span>
            </span>
          </Link>
          <Link
            href="/submit-lead"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Submit Inquiry
          </Link>
        </div>
      </header>

      {/* ── Hero bar ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
            Available Properties
          </h1>
          <p className="text-slate-500 text-sm">
            {count > 0 ? `${count} propert${count === 1 ? "y" : "ies"} available` : "No properties match your search"}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Filter bar ── */}
        <form method="GET" className="mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap gap-3 items-end">
            <div className="flex items-center gap-2 text-slate-400 self-center">
              <SlidersHorizontal size={16} />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Filter</span>
            </div>

            <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">City</label>
              <input
                name="city"
                defaultValue={params.city ?? ""}
                placeholder="Austin, Miami, NYC…"
                className="border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1 min-w-[150px]">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Type</label>
              <select
                name="type"
                defaultValue={params.type ?? ""}
                className="border border-slate-200 bg-slate-50 text-slate-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="">All Types</option>
                {Object.entries(TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1 min-w-[120px]">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Min Beds</label>
              <select
                name="beds"
                defaultValue={params.beds ?? ""}
                className="border border-slate-200 bg-slate-50 text-slate-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="">Any</option>
                {["1","2","3","4","5"].map(n => (
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1 min-w-[150px]">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Max Price</label>
              <input
                name="max_price"
                type="number"
                defaultValue={params.max_price ?? ""}
                placeholder="$5,000,000"
                className="border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div className="flex gap-2 items-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors h-[38px]"
              >
                <Search size={14} /> Search
              </button>
              {hasFilters && (
                <Link
                  href="/listings"
                  className="text-sm text-slate-400 hover:text-slate-700 border border-slate-200 rounded-lg px-3 py-2 h-[38px] flex items-center transition-colors bg-white"
                >
                  Clear
                </Link>
              )}
            </div>
          </div>
        </form>

        {/* ── Grid ── */}
        {count === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-400 mb-4 text-[15px]">No properties match your search.</p>
            <Link href="/listings" className="text-blue-600 text-sm font-semibold hover:underline">Clear filters</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(properties as Property[]).map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-[0_8px_32px_rgba(15,23,42,0.1)] hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImage(property)}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Type badge */}
                  {property.property_type && (
                    <span className="absolute top-3 left-3 text-[11px] font-bold bg-white/95 text-slate-700 px-2.5 py-1 rounded-full shadow-sm">
                      {TYPE_LABELS[property.property_type] ?? property.property_type}
                    </span>
                  )}
                  {/* Price overlay on hover */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-[15px] mb-1.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-[12px] text-slate-400 mb-3">
                    <MapPin size={11} className="shrink-0" />
                    <span className="line-clamp-1">{property.location}{property.city ? `, ${property.city}` : ""}</span>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-[12px] text-slate-500 mb-4 pb-4 border-b border-slate-100">
                    {(property.bedrooms ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <BedDouble size={12} className="text-blue-500" />
                        {property.bedrooms} Beds
                      </span>
                    )}
                    {(property.bathrooms ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <Bath size={12} className="text-blue-500" />
                        {property.bathrooms} Baths
                      </span>
                    )}
                    {(property.area ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <Maximize2 size={12} className="text-blue-500" />
                        {property.area.toLocaleString()} sqft
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                      {formatPrice(property.price)}
                    </span>
                    <Link
                      href={`/submit-lead?property=${encodeURIComponent(property.title)}`}
                      className="text-[12px] font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Inquire Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ChatWidget />

      {/* ── Footer CTA ── */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-600 text-[15px] mb-5 font-medium">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <Link
            href="/submit-lead"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Tell us your requirement →
          </Link>
        </div>
      </footer>

    </div>
  );
}
