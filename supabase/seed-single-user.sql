-- ============================================================
-- EstateFlow AI — Single User Demo Seed Data (US)
-- ============================================================
-- HOW TO USE:
-- 1. Sign up on the app to create your user account
-- 2. Get your user UUID from your profile (auth.users.id)
-- 3. Replace 'YOUR_USER_UUID' with that UUID
-- 4. Run this in Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Properties ──────────────────────────────────────────

INSERT INTO public.properties (title, price, location, city, description, bedrooms, bathrooms, area, status, property_type, furnishing, amenities, created_by) VALUES

('Travis Heights Modern — 3 Bed', 639000, 'Travis Heights', 'Austin', 'Spacious 3 bed single-family in prime South Congress corridor with downtown skyline views. Move-in ready. Walkable to SoCo shops and restaurants.', 3, 2, 1850, 'available', 'Single-Family', 'Unfurnished', ARRAY['Pool', 'Central AC', 'Attached Garage', 'Fenced Yard', 'Smart Home', 'Solar Panels'], 'YOUR_USER_UUID'),

('Brickell Bay Condo — 2 Bed', 485000, 'Brickell', 'Miami', 'Modern 2 bed condo in the heart of Brickell with floor-to-ceiling windows and bay views. Steps from Brickell City Centre.', 2, 2, 1180, 'available', 'Condo', 'Furnished', ARRAY['Pool', 'Gym', 'Concierge', '24/7 Security', 'Covered Parking', 'Balcony'], 'YOUR_USER_UUID'),

('Beverly Grove Villa — 4 Bed', 2200000, 'Beverly Grove', 'Los Angeles', 'Luxurious 4 bed single-family with private pool and home theater. Exclusive neighborhood with gated entry and 24/7 patrol.', 4, 4, 3800, 'available', 'Single-Family', 'Furnished', ARRAY['Private Pool', 'Home Theater', 'Smart Home', 'Landscaped Yard', '2-Car Garage', 'Guest Suite'], 'YOUR_USER_UUID'),

('West Loop Loft — 2 Bed', 375000, 'West Loop', 'Chicago', 'Well-designed 2 bed loft near Fulton Market. Excellent rental potential. Exposed brick and 12ft ceilings.', 2, 2, 1080, 'available', 'Condo', 'Unfurnished', ARRAY['Gym', 'Rooftop Deck', 'Covered Parking', 'In-Unit Laundry'], 'YOUR_USER_UUID'),

('Tribeca Penthouse — 4 Bed', 3500000, 'Tribeca', 'New York', 'Ultra-premium 4 bed penthouse with 360° city views, private terrace, and soaking tub. One-of-a-kind listing in downtown Manhattan.', 4, 5, 4200, 'available', 'Penthouse', 'Furnished', ARRAY['Private Terrace', 'Doorman', 'Smart Home', 'Private Elevator', 'Concierge', 'Parking'], 'YOUR_USER_UUID'),

('Queen Anne View Home — 3 Bed', 880000, 'Queen Anne', 'Seattle', '3 bed corner home with panoramic Puget Sound and city views. Energy-efficient build with EV charging.', 3, 3, 1680, 'available', 'Single-Family', 'Unfurnished', ARRAY['Mountain Views', 'Heat Pump', 'Gym', 'EV Charging', 'Fenced Yard', 'Smart Home'], 'YOUR_USER_UUID'),

('Downtown Austin Studio', 320000, 'Downtown', 'Austin', 'Smart studio condo ideal for young professionals. Fully managed building, 7-minute walk to the tech corridor.', 1, 1, 620, 'available', 'Studio', 'Furnished', ARRAY['24/7 Security', 'Gym', 'In-Unit Laundry', 'Coffee Bar'], 'YOUR_USER_UUID'),

('Lakewood Craftsman — 3 Bed', 545000, 'Lakewood', 'Dallas', '3 bed Craftsman near White Rock Lake with great connectivity to downtown and DFW. Charming front porch and updated kitchen.', 3, 2, 1790, 'reserved', 'Single-Family', 'Unfurnished', ARRAY['Pool', 'Central AC', 'Attached Garage', 'Fenced Yard', 'Playground'], 'YOUR_USER_UUID'),

('Back Bay Brownstone — 3 Bed', 1850000, 'Back Bay', 'Boston', 'Ultra-luxury 3 bed brownstone in Boston''s most prestigious address. Floor-to-ceiling windows, Italian marble, and original detail.', 3, 3, 2400, 'available', 'Townhouse', 'Furnished', ARRAY['Roof Deck', 'Wine Cellar', 'Concierge', 'Smart Home', 'Garage Parking', 'Fireplace'], 'YOUR_USER_UUID'),

('Mueller Buildable Lot', 295000, 'Mueller', 'Austin', 'Build-ready 0.25-acre residential lot in a planned community. All utilities and approvals in place.', 0, 0, 10890, 'upcoming', 'Lot', 'N/A', ARRAY['Utilities Ready', 'Planned Community', 'Water Connection', 'Underground Electric'], 'YOUR_USER_UUID');


-- ── Leads ────────────────────────────────────────────────

INSERT INTO public.leads (name, phone, email, raw_message, budget, location, property_type, urgency, buyer_intent, summary, status, source, ai_analyzed, notes) VALUES

('James Wilson', '(512) 555-0142', 'james.wilson@gmail.com', 'Need a 3-bed single-family in Austin under $650K near good schools. Relocating from Denver next month, need to close ASAP.', 'Up to $650K', 'Austin, TX', '3 Bed Single-Family', 'high', 'serious', 'Serious buyer looking for a 3-bed in Austin under $650K with a fast close, near good schools', 'qualified', 'web_form', true, 'Relocating from Denver. Mortgage pre-approved with Wells Fargo.'),

('Emily Carter', '(305) 555-0188', 'emily.carter@techcorp.com', 'Looking for a condo in Miami under $1.2M, preferably near downtown. Brickell or Edgewater preferred. Ready to tour this weekend.', 'Up to $1.2M', 'Miami, FL', 'Condo', 'high', 'serious', 'High-intent buyer seeking a Miami condo near downtown under $1.2M, ready for showings', 'site_visit', 'sms', true, 'Works in tech. Weekend showing confirmed for Saturday.'),

('Michael Brown', '(602) 555-0119', NULL, 'Need a 2-bed condo in Phoenix under $400K. Looking for investment purpose, strong rental-yield area preferred.', 'Up to $400K', 'Phoenix, AZ', '2 Bed Condo', 'medium', 'researching', 'Investor looking for a 2-bed condo in Phoenix under $400K with good rental yield potential', 'contacted', 'referral', true, NULL),

('Jessica Davis', '(512) 555-0167', 'jessica.d@startup.io', 'Hi, I am looking for a 1-bed or studio in Austin, specifically downtown or South Congress. Budget around $300-350K. I work downtown so proximity matters.', 'Up to $350K', 'Austin, Downtown', '1 Bed or Studio', 'medium', 'serious', 'Downtown professional seeking a 1-bed/studio in Austin under $350K near work', 'negotiation', 'web_form', true, 'Buying for self-use. Has down payment ready, all cash possible.'),

('Robert Martinez', '(469) 555-0133', NULL, 'Want to buy a lot in the Austin suburbs, budget $300K. Could be Mueller or Leander. For future construction.', 'Up to $300K', 'Austin, TX', 'Lot', 'low', 'researching', 'Long-term investor looking for a buildable lot in the Austin area under $300K', 'new', 'manual', true, NULL),

('Sarah Johnson', '(312) 555-0175', 'sarah.j@company.com', 'Looking for a 3-bed home in Chicago, West Loop or Lincoln Park, budget $800-900K. My husband works downtown. We have 2 kids so good schools nearby is a must.', 'Up to $900K', 'Chicago, West Loop', '3 Bed Single-Family', 'medium', 'serious', 'Family buyer seeking a 3-bed in Chicago under $900K, school proximity required', 'qualified', 'web_form', true, 'Family of 4. Priority: top-rated school district.'),

('Christopher Lee', '(917) 555-0156', NULL, 'Need a penthouse or luxury condo in NYC, Tribeca or SoHo area. Budget $3-4M. Should have great amenities and security. For primary residence.', 'Up to $4M', 'New York, Tribeca', 'Penthouse or Luxury Condo', 'high', 'serious', 'HNW buyer looking for a luxury penthouse/condo in NYC Tribeca under $4M', 'contacted', 'referral', true, 'Very serious buyer. Met at a property event. Prefers in-person meetings.'),

('Ashley Garcia', '(213) 555-0148', 'ashley.garcia@law.com', 'Just exploring options for a 2-bed in LA or San Diego. Budget flexible around $600-800K. Not in a rush, just want to understand the market.', 'Up to $800K', 'Los Angeles or San Diego', '2 Bed Condo', 'low', 'comparing', 'Market explorer comparing 2-bed options in LA/San Diego, flexible timeline and budget', 'new', 'web_form', true, NULL),

('David Miller', '(206) 555-0191', NULL, 'Looking for a single-family home in Seattle, Queen Anne or Ballard. Budget around $900K. Good commute to South Lake Union needed. 3 bed minimum.', 'Up to $900K', 'Seattle, WA', '3 Bed Single-Family', 'medium', 'researching', 'Buyer exploring 3-bed single-family options in Seattle near South Lake Union under $900K', 'new', 'sms', true, NULL),

('Amanda White', '(617) 555-0124', 'amanda.white@healthcare.com', 'Hi, I was referred by my colleague Emily. Looking for a 3-bed in Boston near Back Bay or the South End. Budget $1.7M to $1.9M. Close to the hospitals is important since I am a physician.', 'Up to $1.9M', 'Boston, Back Bay', '3 Bed Townhouse', 'high', 'serious', 'Physician referred by an existing client, seeking a 3-bed near Back Bay under $1.9M', 'contacted', 'referral', true, 'Referred by Emily Carter (existing client). High trust, fast decision maker.');


-- ── Sample Showings ──────────────────────────────────────

INSERT INTO public.visits (visitor_name, visitor_phone, visitor_email, visit_date, visit_time, status, notes) VALUES
('James Wilson', '(512) 555-0142', 'james.wilson@gmail.com', '2026-05-28', '10:00', 'scheduled', 'Interested in 3-bed homes in Austin'),
('Emily Carter', '(305) 555-0188', 'emily.carter@techcorp.com', '2026-05-30', '15:00', 'scheduled', 'Touring condos in the Brickell area');


-- ── Sample Notifications ──────────────────────────────────

INSERT INTO public.notifications (user_id, message, type, read, link) VALUES
('YOUR_USER_UUID', 'New lead received: James Wilson — "Need a 3-bed single-family in Austin under $650K near good schools…"', 'lead', false, '/dashboard/leads'),
('YOUR_USER_UUID', 'Follow up with Robert Martinez — lead inactive for 3+ days.', 'follow_up', false, '/dashboard/leads'),
('YOUR_USER_UUID', 'AI analyzed 10 new leads successfully.', 'ai', true, '/dashboard/analytics'),
('YOUR_USER_UUID', 'Showing scheduled: James Wilson on May 28, 10:00 AM', 'info', false, '/dashboard/visits');
