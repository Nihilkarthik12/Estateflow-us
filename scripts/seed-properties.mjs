import { createClient } from "@supabase/supabase-js";

// Reads credentials from env — set these before running:
//   NEXT_PUBLIC_SB_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SB_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "Missing env vars. Set NEXT_PUBLIC_SB_URL and SUPABASE_SERVICE_ROLE_KEY before running."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const properties = [
  {
    title: "Luxury 3 Bed Home — Travis Heights",
    price: 639000,
    location: "Travis Heights",
    city: "Austin",
    description:
      "Spacious 3 bed single-family in the heart of Travis Heights with downtown skyline views. Chef's kitchen, hardwood floors, and premium finishes throughout. Walkable to South Congress shops and dining.",
    bedrooms: 3, bathrooms: 2, area: 1850,
    amenities: ["Pool", "Central AC", "Garage", "Fenced Yard", "Smart Home", "Solar Panels"],
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"],
    status: "available", property_type: "single-family", furnishing: "unfurnished",
  },
  {
    title: "Premium 2 Bed Condo — Brickell",
    price: 485000,
    location: "Brickell",
    city: "Miami",
    description:
      "Modern 2 bed condo in prime Brickell. Walking distance to Brickell City Centre and the Metromover. Fully fitted kitchen, wide balcony with bay view.",
    bedrooms: 2, bathrooms: 2, area: 1180,
    amenities: ["Gym", "Covered Parking", "24/7 Security", "Pool", "Concierge", "Clubhouse"],
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"],
    status: "available", property_type: "condo", furnishing: "furnished",
  },
  {
    title: "4 Bed Single-Family Villa — Beverly Grove",
    price: 2200000,
    location: "Beverly Grove",
    city: "Los Angeles",
    description:
      "Exquisite 4 bed single-family in Beverly Grove, one of LA's most desirable neighborhoods. Private yard, private pool, 2-car garage, fully automated smart home. Move-in ready.",
    bedrooms: 4, bathrooms: 4, area: 4200,
    amenities: ["Private Pool", "Gym", "Garage", "Security", "Home Theater", "Landscaped Yard"],
    images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"],
    status: "available", property_type: "single-family", furnishing: "furnished",
  },
  {
    title: "Studio Condo — Downtown",
    price: 320000,
    location: "Downtown",
    city: "Austin",
    description:
      "Stylish studio condo in downtown Austin. Perfect for young professionals. Fully furnished with designer pieces, high-speed internet, and concierge service.",
    bedrooms: 1, bathrooms: 1, area: 620,
    amenities: ["Covered Parking", "Security", "Gym", "In-Unit Laundry", "Rooftop Deck"],
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"],
    status: "available", property_type: "studio", furnishing: "furnished",
  },
  {
    title: "2 Bed Loft — West Loop",
    price: 375000,
    location: "West Loop",
    city: "Chicago",
    description:
      "Move-in ready 2 bed loft near Fulton Market. Bright open layout with exposed brick and 12ft ceilings. Building with full amenities and secure entry.",
    bedrooms: 2, bathrooms: 2, area: 1080,
    amenities: ["Covered Parking", "Security", "Gym", "Rooftop Deck", "In-Unit Laundry"],
    images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80"],
    status: "available", property_type: "condo", furnishing: "unfurnished",
  },
  {
    title: "3 Bed Penthouse — Tribeca",
    price: 3500000,
    location: "Tribeca",
    city: "New York",
    description:
      "Stunning top-floor penthouse in Tribeca with 360-degree city views. Private terrace of 800 sq ft, imported flooring, chef's kitchen. One-of-a-kind unit.",
    bedrooms: 3, bathrooms: 3, area: 2200,
    amenities: ["Doorman", "Gym", "Covered Parking", "Security", "Private Elevator", "Roof Deck", "Concierge"],
    images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"],
    status: "available", property_type: "penthouse", furnishing: "furnished",
  },
];

const { data, error } = await supabase.from("properties").insert(properties).select();
if (error) console.error("Error:", error.message);
else console.log(`✅ Inserted ${data.length} properties successfully`);
