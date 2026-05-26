-- ============================================================
-- EstateFlow AI — Single User Demo Seed Data
-- ============================================================
-- HOW TO USE:
-- 1. Sign up on the app to create your user account
-- 2. Get your user UUID from your profile (auth.users.id)
-- 3. Replace 'YOUR_USER_UUID' with that UUID
-- 4. Run this in Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Properties ──────────────────────────────────────────

INSERT INTO public.properties (title, price, location, city, description, bedrooms, bathrooms, area, status, property_type, furnishing, amenities, created_by) VALUES

('Prestige Park View — 3BHK', 8500000, 'OMR, Sholinganallur', 'Chennai', 'Spacious 3BHK in prime OMR corridor with stunning lake views. Ready to occupy. Metro connectivity within 500m.', 3, 2, 1450, 'available', 'Apartment', 'Semi-Furnished', ARRAY['Swimming Pool', 'Gym', 'Security', 'Covered Parking', 'Clubhouse', 'Power Backup'], 'YOUR_USER_UUID'),

('Sobha Windsor — 2BHK Premium', 6200000, 'Whitefield', 'Bangalore', 'Modern 2BHK with premium finishes in the heart of Whitefield IT hub. Walking distance to EPIP Zone.', 2, 2, 1180, 'available', 'Apartment', 'Unfurnished', ARRAY['Swimming Pool', 'Gym', 'Security', 'Landscaped Garden', 'Covered Parking'], 'YOUR_USER_UUID'),

('Villa Serena — Independent Villa', 22000000, 'Jubilee Hills', 'Hyderabad', 'Luxurious 4BHK independent villa with private pool and home theatre. Exclusive gated community with 24/7 security.', 4, 4, 3800, 'available', 'Villa', 'Fully Furnished', ARRAY['Private Pool', 'Home Theatre', 'Smart Home', 'Garden', '2 Covered Parking', 'Staff Quarters'], 'YOUR_USER_UUID'),

('Godrej Nest — 2BHK Compact', 4500000, 'Hinjewadi Phase 1', 'Pune', 'Well-designed 2BHK near Rajiv Gandhi IT Park. Excellent rental potential. RERA approved.', 2, 2, 980, 'available', 'Apartment', 'Unfurnished', ARRAY['Security', 'Power Backup', 'Covered Parking', 'Gymnasium'], 'YOUR_USER_UUID'),

('Brigade Lakefront — 4BHK Penthouse', 35000000, 'Electronic City Phase 1', 'Bangalore', 'Ultra-premium 4BHK penthouse with 360° city views, private terrace, and jacuzzi. One of a kind listing.', 4, 5, 4200, 'available', 'Penthouse', 'Fully Furnished', ARRAY['Private Terrace', 'Jacuzzi', 'Smart Home', 'Private Lift', 'Concierge', '3 Covered Parking'], 'YOUR_USER_UUID'),

('Purva 270° — 3BHK Corner', 9800000, 'Hebbal', 'Bangalore', '3BHK corner unit with panoramic lake and city views. IGBC Gold certified green building.', 3, 3, 1680, 'available', 'Apartment', 'Semi-Furnished', ARRAY['Swimming Pool', 'Tennis Court', 'Gym', 'Jogging Track', 'Security', 'EV Charging'], 'YOUR_USER_UUID'),

('TVS Emerald Haven — 1BHK Studio', 3200000, 'Perungudi', 'Chennai', 'Smart studio apartment ideal for IT professionals. Fully managed, 7-minute walk from Perungudi IT Park.', 1, 1, 620, 'available', 'Studio', 'Fully Furnished', ARRAY['Security', 'Power Backup', 'Laundry', 'Cafeteria'], 'YOUR_USER_UUID'),

('Casagrand Boulevard — 3BHK', 7800000, 'Pallavaram', 'Chennai', '3BHK in the upcoming Pallavaram-Thoraipakkam 200 feet road corridor. Great connectivity to airport and IT hubs.', 3, 2, 1390, 'reserved', 'Apartment', 'Unfurnished', ARRAY['Swimming Pool', 'Gym', 'Security', 'Covered Parking', 'Children Play Area'], 'YOUR_USER_UUID'),

('Mahindra Luminare — 3BHK', 18500000, 'DLF Phase 2', 'Gurugram', 'Ultra-luxury 3BHK in Gurugram''s most prestigious address. Floor-to-ceiling windows, Italian marble flooring.', 3, 3, 2400, 'available', 'Apartment', 'Fully Furnished', ARRAY['Infinity Pool', 'Spa', 'Concierge', 'Smart Home', 'Valet Parking', 'Wine Cellar'], 'YOUR_USER_UUID'),

('Adarsh Palm Retreat — Plot', 5500000, 'Whitefield Extension', 'Bangalore', 'BMRDA approved 1200 sqft residential plot in a gated villa community. All approvals in place.', 0, 0, 1200, 'upcoming', 'Plot', 'N/A', ARRAY['BMRDA Approved', 'Gated Community', 'Water Connection', 'Underground Electricity'], 'YOUR_USER_UUID');


-- ── Leads ────────────────────────────────────────────────

INSERT INTO public.leads (name, phone, email, raw_message, budget, location, property_type, urgency, buyer_intent, summary, status, source, ai_analyzed, notes) VALUES

('Rahul Sharma', '+91 98765 43210', 'rahul.sharma@gmail.com', 'Need a 3BHK apartment in Chennai under 90 lakhs near metro station. Moving from Delhi next month, need possession ASAP.', '₹90 Lakhs', 'Chennai', '3BHK Apartment', 'high', 'serious', 'Serious buyer looking for 3BHK in Chennai under ₹90L with immediate possession near metro', 'qualified', 'web_form', true, 'Relocating from Delhi. Has home loan pre-approved from SBI.'),

('Priya Nair', '+91 91234 56789', 'priya.nair@techcorp.com', 'Looking for a villa in Bangalore under 2 crore, preferably near IT parks. Whitefield or Electronic City preferred. Ready to visit sites this weekend.', '₹2 Crore', 'Bangalore, Whitefield', 'Villa', 'high', 'serious', 'High-intent buyer seeking villa in Bangalore IT corridor under ₹2Cr, ready for site visits', 'site_visit', 'whatsapp', true, 'Works at Infosys. Weekend site visit confirmed for Saturday.'),

('Arun Kumar', '+91 87654 32109', NULL, 'Need 2BHK in Hyderabad under 60 lakhs. Looking for investment purpose, good rental yield area preferred.', '₹60 Lakhs', 'Hyderabad', '2BHK Apartment', 'medium', 'researching', 'Investor looking for 2BHK in Hyderabad under ₹60L with good rental yield potential', 'contacted', 'referral', true, NULL),

('Divya Menon', '+91 99887 76655', 'divya.m@startup.io', 'Hi, I am looking for a 1BHK or studio in Chennai, specifically Perungudi or Sholinganallur. Budget around 35-40 lakhs. I work in TCS ILP so proximity to work is important.', '₹40 Lakhs', 'Chennai, Perungudi', '1BHK or Studio', 'medium', 'serious', 'TCS employee seeking 1BHK/studio in Chennai OMR under ₹40L near Perungudi', 'negotiation', 'web_form', true, 'Looking for self-use. Mentioned she has savings ready, no loan needed.'),

('Suresh Babu', '+91 93456 78901', NULL, 'Want to buy a plot in Bangalore outskirts, budget 50 lakhs. Can be Whitefield extension or Devanahalli. For future construction.', '₹50 Lakhs', 'Bangalore', 'Plot', 'low', 'researching', 'Long-term investor looking for plot in Bangalore outskirts under ₹50L for future construction', 'new', 'manual', true, NULL),

('Kavitha Rajan', '+91 88990 11223', 'kavitha.r@mnc.co', 'Looking for a 3BHK flat in Pune, Hinjewadi area, budget 80-90 lakhs. My husband works in Infosys Phase 1. We have 2 kids so good schools nearby is a must.', '₹90 Lakhs', 'Pune, Hinjewadi', '3BHK Apartment', 'medium', 'serious', 'Family buyer seeking 3BHK in Pune Hinjewadi under ₹90L, school proximity required', 'qualified', 'web_form', true, 'Family of 4. Priority: DPS or Euro school catchment area.'),

('Mohammed Farhan', '+91 76543 21098', NULL, 'Need penthouse or luxury apartment in Gurugram, DLF area. Budget 2-3 crore. Should have good amenities and security. For end use.', '₹3 Crore', 'Gurugram, DLF', 'Penthouse or Luxury Apartment', 'high', 'serious', 'HNI buyer looking for luxury penthouse/apartment in Gurugram DLF Phase 1-2 under ₹3Cr', 'contacted', 'referral', true, 'Very serious buyer. Met at property expo. Prefers in-person meetings.'),

('Ananya Singh', '+91 95123 45678', 'ananya.singh@law.in', 'Just exploring options for a 2BHK in Chennai or Bangalore. Budget flexible around 60-80L. Not in immediate rush, just want to understand the market.', '₹80 Lakhs', 'Chennai or Bangalore', '2BHK Apartment', 'low', 'comparing', 'Market explorer comparing 2BHK options in Chennai/Bangalore, flexible timeline and budget', 'new', 'web_form', true, NULL),

('Vijay Krishnamurthy', '+91 84567 89012', NULL, 'Looking for independent villa or bungalow in Coimbatore. Budget around 1 crore. Should have good connectivity to Tidel Park. 4 BHK minimum.', '₹1 Crore', 'Coimbatore', 'Villa or Bungalow', 'medium', 'researching', 'Buyer exploring 4BHK villa/bungalow options in Coimbatore near Tidel Park under ₹1Cr', 'new', 'whatsapp', true, NULL),

('Lakshmi Priya', '+91 78901 23456', 'lakshmi.p@healthcare.com', 'Hi, I was referred by my colleague Priya. Looking for 3BHK in Bangalore near Hebbal or Yelahanka. Budget 95 lakhs to 1 crore. Good hospital infrastructure important as I am a doctor.', '₹1 Crore', 'Bangalore, Hebbal', '3BHK Apartment', 'high', 'serious', 'Doctor referred by existing client, seeking 3BHK near Hebbal/Yelahanka under ₹1Cr', 'contacted', 'referral', true, 'Referred by Priya Nair (existing client). High trust, fast decision maker.');


-- ── Sample Visits ──────────────────────────────────────

INSERT INTO public.visits (visitor_name, visitor_phone, visitor_email, visit_date, visit_time, status, notes) VALUES
('Rahul Sharma', '+91 98765 43210', 'rahul.sharma@gmail.com', '2026-05-28', '10:00', 'scheduled', 'Interested in 3BHK properties in Chennai'),
('Priya Nair', '+91 91234 56789', 'priya.nair@techcorp.com', '2026-05-30', '15:00', 'scheduled', 'Looking at villas in Whitefield area');


-- ── Sample Notifications ──────────────────────────────────

INSERT INTO public.notifications (user_id, message, type, read, link) VALUES
('YOUR_USER_UUID', 'New lead received: Rahul Sharma — "Need a 3BHK apartment in Chennai under 90 lakhs near metro…"', 'lead', false, '/dashboard/leads'),
('YOUR_USER_UUID', 'Follow up with Suresh Babu — lead inactive for 3+ days.', 'follow_up', false, '/dashboard/leads'),
('YOUR_USER_UUID', 'AI analyzed 10 new leads successfully.', 'ai', true, '/dashboard/analytics'),
('YOUR_USER_UUID', 'Visit scheduled: Rahul Sharma on May 28, 10:00 AM', 'info', false, '/dashboard/visits');