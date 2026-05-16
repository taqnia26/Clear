--
-- PostgreSQL database dump
--

\restrict cG5qQAn6vnDLUUgUq806HKX733kn1IajvlpUrXd2GjcWADcHVMASs9B4a1PBnza

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admins (id, username, password_hash, name, role, created_at) FROM stdin;
1	admin	admin123	مدير النظام	superadmin	2026-05-14 12:02:50.779935
2	receptionist	recep123	موظفة الاستقبال	receptionist	2026-05-14 12:02:50.779935
\.


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.appointments (id, patient_name_ar, patient_name_en, phone, email, service_id, service_name, doctor_id, doctor_name, appointment_date, appointment_time, status, notes_ar, notes_en, created_at) FROM stdin;
31	بدر الحربي	Badr Al-Harbi	+966502223344	badr@example.com	32	حقن البوتوكس	24	د. محمد الغامدي	2026-05-17	14:00	completed	\N	\N	2026-05-15 10:30:53.505167
33	خالد الجهني	Khalid Al-Juhani	+966504445566	\N	34	علاج الليزر للبشرة	26	د. خالد الزهراني	2026-05-20	16:00	pending	\N	\N	2026-05-15 10:30:53.505167
34	دانة الشمري	Dana Al-Shammari	+966505556677	dana@example.com	35	تجميل الأنف بدون جراحة	27	د. ليلى الشريف	2026-05-15	09:00	completed	\N	\N	2026-05-15 10:30:53.505167
35	سعد الدوسري	Saad Al-Dosari	+966506667788	\N	36	تبييض الأسنان بالليزر	28	د. عبدالرحمن القحطاني	2026-05-14	12:00	completed	\N	\N	2026-05-15 10:30:53.505167
36	لمى البلوي	Lama Al-Balwi	+966507778899	\N	37	نحت الجسم بالكرايو	23	د. سارة الأحمد	2026-05-22	13:00	pending	\N	\N	2026-05-15 10:30:53.505167
37	تركي القرني	Turki Al-Qarni	+966508889900	\N	38	تقويم الأسنان الشفاف	24	د. محمد الغامدي	2026-05-19	15:00	cancelled	\N	\N	2026-05-15 10:30:53.505167
30	هند المطيري	Hind Al-Mutairi	+966501112233	hind@example.com	31	ابتسامة هوليوود	23	د. سارة الأحمد	2026-05-16	10:00	completed	\N	\N	2026-05-15 10:30:53.505167
32	روان السبيعي	Rawan Al-Subaie	+966503334455	\N	33	زراعة الأسنان الفورية	25	د. نورة العمري	2026-05-18	11:00	completed	\N	\N	2026-05-15 10:30:53.505167
\.


--
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.doctors (id, name_ar, name_en, title_ar, title_en, specialty, bio_ar, bio_en, image_url, experience, active, created_at) FROM stdin;
23	د. سارة الأحمد	Dr. Sarah Al-Ahmad	استشارية تجميل الوجه	Facial Aesthetics Consultant	cosmetic	خبيرة في الحقن التجميلية والبوتوكس والفيلر مع أكثر من 12 عاماً من الخبرة في أرقى عيادات لندن وباريس.	Expert in cosmetic injections, Botox and fillers with over 12 years of experience in top clinics in London and Paris.	https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80	12	t	2026-05-15 10:30:53.505167
24	د. محمد الغامدي	Dr. Mohammed Al-Ghamdi	استشاري تقويم وزراعة الأسنان	Orthodontics & Implants Consultant	dental	متخصص في الابتسامة الهوليوودية وزراعة الأسنان الفورية، حاصل على زمالة الكلية الملكية البريطانية.	Specialist in Hollywood Smile and immediate dental implants, fellow of the Royal College of Surgeons.	https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80	15	t	2026-05-15 10:30:53.505167
25	د. نورة العمري	Dr. Noura Al-Omari	أخصائية الجلدية والليزر	Dermatology & Laser Specialist	both	خبيرة في علاجات الليزر والبشرة، تجمع بين أحدث التقنيات الأوروبية ولمسة فنية فريدة.	Laser and skincare expert, blending the latest European technologies with a unique artistic touch.	https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80	9	t	2026-05-15 10:30:53.505167
26	د. خالد الزهراني	Dr. Khalid Al-Zahrani	استشاري جراحات تجميل الأنف	Rhinoplasty Consultant	cosmetic	أحد أبرز جراحي تجميل الأنف في الخليج، تخرّج من جامعة هارفارد للطب.	One of the leading rhinoplasty surgeons in the Gulf, Harvard Medical School graduate.	https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80	18	t	2026-05-15 10:30:53.505167
27	د. ليلى الشريف	Dr. Layla Al-Sharif	أخصائية تبييض وتجميل الأسنان	Cosmetic Dentistry Specialist	dental	متخصصة في الفينير والابتسامة المثالية، عضو الأكاديمية الأمريكية لطب الأسنان التجميلي.	Veneers and perfect smile specialist, member of the American Academy of Cosmetic Dentistry.	https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80	10	t	2026-05-15 10:30:53.505167
28	د. عبدالرحمن القحطاني	Dr. Abdulrahman Al-Qahtani	استشاري نحت الجسم والليزر	Body Sculpting Consultant	cosmetic	رائد في تقنيات نحت الجسم بالليزر والموجات فوق الصوتية بدون جراحة.	Pioneer in non-surgical laser and ultrasound body sculpting techniques.	https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&q=80	14	t	2026-05-15 10:30:53.505167
\.


--
-- Data for Name: packages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.packages (id, name_ar, name_en, description_ar, description_en, original_price, discounted_price, discount_percent, image_url, valid_until, featured, active, created_at) FROM stdin;
16	باقة العروس الذهبية	Golden Bride Package	تشمل ابتسامة هوليوود + حقن البوتوكس + جلسة ليزر لبشرة مشرقة في يومك المميز.	Includes Hollywood Smile + Botox + Laser session for radiant skin on your special day.	8500.00	5900.00	30.00	https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80	2026-12-31	t	t	2026-05-15 10:30:53.505167
17	باقة الإطلالة الفاخرة	Luxe Look Package	حقن فيلر + بوتوكس + تنظيف بشرة عميق بأحدث التقنيات.	Filler + Botox + Deep facial cleansing with the latest technology.	4200.00	2900.00	31.00	https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80	2026-09-30	t	t	2026-05-15 10:30:53.505167
18	باقة الابتسامة الكاملة	Complete Smile Package	تنظيف + تبييض ليزر + 4 فينير أمامية لإطلالة هوليوودية.	Cleaning + Laser whitening + 4 front veneers for a Hollywood look.	6500.00	4500.00	31.00	https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1200&q=80	2026-10-31	t	t	2026-05-15 10:30:53.505167
19	باقة الشباب الدائم	Eternal Youth Package	بوتوكس كامل + ميزوثيرابي + جلستين ليزر تجديد بشرة.	Full Botox + Mesotherapy + 2 laser rejuvenation sessions.	5800.00	3900.00	33.00	https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&q=80	2026-11-30	t	t	2026-05-15 10:30:53.505167
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.services (id, name_ar, name_en, description_ar, description_en, category, image_url, duration_minutes, price_from, active, created_at) FROM stdin;
31	ابتسامة هوليوود	Hollywood Smile	تصميم ابتسامة مثالية باستخدام الفينير الإيطالي الفاخر، نتائج فورية تدوم سنوات.	Design a perfect smile using premium Italian veneers with instant, lasting results.	dental	https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1200&q=80	90	2500.00	t	2026-05-15 10:30:53.505167
33	زراعة الأسنان الفورية	Same-Day Dental Implants	زراعة فورية بزرعات سويسرية، استبدل أسنانك المفقودة في يوم واحد.	Immediate implants with Swiss-made fixtures — replace missing teeth in a single day.	dental	https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&q=80	120	3500.00	t	2026-05-15 10:30:53.505167
34	علاج الليزر للبشرة	Laser Skin Treatment	تجديد البشرة وإزالة التصبغات بأحدث أجهزة الليزر الألمانية.	Skin rejuvenation and pigmentation removal with the latest German laser devices.	cosmetic	https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=80	45	900.00	t	2026-05-15 10:30:53.505167
35	تجميل الأنف بدون جراحة	Non-Surgical Rhinoplasty	تعديل شكل الأنف بالفيلر بدون جراحة، نتائج فورية بدون فترة نقاهة.	Reshape your nose with fillers without surgery — instant results, no downtime.	cosmetic	https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&q=80	60	1800.00	t	2026-05-15 10:30:53.505167
36	تبييض الأسنان بالليزر	Laser Teeth Whitening	بياض ناصع بدرجات في جلسة واحدة باستخدام تقنية ZOOM الأمريكية.	Brilliant whiteness shades brighter in one session using American ZOOM technology.	dental	https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1200&q=80	60	800.00	t	2026-05-15 10:30:53.505167
37	نحت الجسم بالكرايو	Cryolipolysis Body Sculpting	تجميد الدهون العنيدة وإذابتها بشكل دائم بدون جراحة أو ألم.	Freeze and permanently eliminate stubborn fat without surgery or pain.	cosmetic	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80	75	1500.00	t	2026-05-15 10:30:53.505167
38	تقويم الأسنان الشفاف	Invisalign Clear Aligners	تقويم غير مرئي مريح وفعال، صمم خصيصاً لابتسامتك المثالية.	Comfortable invisible aligners, custom-designed for your perfect smile.	dental	https://images.unsplash.com/photo-1581585504064-89c5e62a3da6?w=1200&q=80	45	4500.00	t	2026-05-15 10:30:53.505167
\.


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.testimonials (id, patient_name, rating, comment_ar, comment_en, service_id, approved, created_at) FROM stdin;
22	أمل العتيبي	5	تجربتي في عيادة كلير كانت رائعة! د. سارة محترفة والنتائج فاقت توقعاتي. الفريق كله ودود ومتفهم.	My experience at Clear Clinic was amazing! Dr. Sarah is professional and the results exceeded my expectations. The whole team is friendly and understanding.	31	t	2026-05-15 10:30:53.505167
23	محمد الشهري	5	أفضل عيادة أسنان جربتها على الإطلاق. زراعة الأسنان كانت بدون أي ألم والنتيجة طبيعية 100%.	The best dental clinic I've ever tried. The dental implant was painless and the result is 100% natural.	32	t	2026-05-15 10:30:53.505167
24	ريم الفهد	5	حصلت على ابتسامة أحلامي في يومين فقط! شكراً للدكتورة ليلى وفريقها المميز.	Got the smile of my dreams in just 2 days! Thank you to Dr. Layla and her amazing team.	33	t	2026-05-15 10:30:53.505167
25	سلطان القحطاني	5	مكان فاخر، خدمة راقية، وأطباء على أعلى مستوى. أنصح كل من يبحث عن الجودة.	Luxurious place, premium service, and top-tier doctors. I recommend it to anyone seeking quality.	34	t	2026-05-15 10:30:53.505167
26	نوف الدوسري	4	نتيجة الفيلر كانت طبيعية جداً وملامحي صارت أحلى. التزام بالمواعيد ونظافة عالية.	The filler result was very natural and my features look prettier. Punctual appointments and high cleanliness.	35	t	2026-05-15 10:30:53.505167
27	فيصل العنزي	5	د. خالد فنان! عملية تجميل الأنف كانت ناجحة 100% والنتيجة طبيعية تماماً.	Dr. Khalid is an artist! The rhinoplasty was 100% successful and the result is completely natural.	36	t	2026-05-15 10:30:53.505167
\.


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admins_id_seq', 2, true);


--
-- Name: appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.appointments_id_seq', 37, true);


--
-- Name: doctors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.doctors_id_seq', 28, true);


--
-- Name: packages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.packages_id_seq', 19, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.services_id_seq', 38, true);


--
-- Name: testimonials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.testimonials_id_seq', 27, true);


--
-- PostgreSQL database dump complete
--

\unrestrict cG5qQAn6vnDLUUgUq806HKX733kn1IajvlpUrXd2GjcWADcHVMASs9B4a1PBnza

