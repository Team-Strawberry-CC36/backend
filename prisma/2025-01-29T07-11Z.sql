--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--

DROP DATABASE IF EXISTS "jappuri";
DROP DATABASE IF EXISTS "temp";




--
--


--
--

--
-- Database "jappuri" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6 (Debian 16.6-1.pgdg120+1)
-- Dumped by pg_dump version 16.6 (Debian 16.6-1.pgdg120+1)

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
-- Name: jappuri; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE "jappuri" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF8';


\connect "jappuri"

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
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


--
-- Name: EtiquetteStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE "public"."EtiquetteStatus" AS ENUM (
    'ALLOWED',
    'NOT_ALLOWED',
    'NEUTRAL'
);


--
-- Name: HelpfullnessLevel; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE "public"."HelpfullnessLevel" AS ENUM (
    'UP',
    'DOWN'
);


--
-- Name: PlaceType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE "public"."PlaceType" AS ENUM (
    'SHRINE',
    'ONSEN',
    'RESTAURANT'
);


SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: Etiquette; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."Etiquette" (
    "id" integer NOT NULL,
    "label" character varying(255) NOT NULL,
    "place_type" "public"."PlaceType" NOT NULL
);


--
-- Name: Etiquette_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."Etiquette_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Etiquette_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."Etiquette_id_seq" OWNED BY "public"."Etiquette"."id";


--
-- Name: Etiquette_per_experiences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."Etiquette_per_experiences" (
    "id" integer NOT NULL,
    "experience_id" integer NOT NULL,
    "place_etiquette_id" integer NOT NULL
);


--
-- Name: Etiquette_per_experiences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."Etiquette_per_experiences_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Etiquette_per_experiences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."Etiquette_per_experiences_id_seq" OWNED BY "public"."Etiquette_per_experiences"."id";


--
-- Name: Experiences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."Experiences" (
    "id" integer NOT NULL,
    "place_id" integer NOT NULL,
    "user_id" "text" NOT NULL,
    "experience" "text" NOT NULL,
    "visited_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "edited_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Experiences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."Experiences_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Experiences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."Experiences_id_seq" OWNED BY "public"."Experiences"."id";


--
-- Name: Helpfullness; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."Helpfullness" (
    "id" integer NOT NULL,
    "user_id" "text" NOT NULL,
    "experience_id" integer NOT NULL,
    "status" "public"."HelpfullnessLevel" NOT NULL
);


--
-- Name: Helpfullness_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."Helpfullness_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Helpfullness_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."Helpfullness_id_seq" OWNED BY "public"."Helpfullness"."id";


--
-- Name: Place_etiquettes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."Place_etiquettes" (
    "id" integer NOT NULL,
    "place_id" integer NOT NULL,
    "etiquette_id" integer NOT NULL,
    "status" "public"."EtiquetteStatus" NOT NULL
);


--
-- Name: Place_etiquettes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."Place_etiquettes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Place_etiquettes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."Place_etiquettes_id_seq" OWNED BY "public"."Place_etiquettes"."id";


--
-- Name: Places; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."Places" (
    "id" integer NOT NULL,
    "place_type" "public"."PlaceType" NOT NULL,
    "google_place_id" character varying(255) NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "edited_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Places_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."Places_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Places_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."Places_id_seq" OWNED BY "public"."Places"."id";


--
-- Name: Users_accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."Users_accounts" (
    "id" character varying(255) NOT NULL,
    "username" character varying(255) NOT NULL,
    "created_at" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Votes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."Votes" (
    "id" integer NOT NULL,
    "user_id" "text" NOT NULL,
    "place_etiquette_id" integer NOT NULL,
    "status" "public"."EtiquetteStatus" NOT NULL
);


--
-- Name: Votes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."Votes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Votes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."Votes_id_seq" OWNED BY "public"."Votes"."id";


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."_prisma_migrations" (
    "id" character varying(36) NOT NULL,
    "checksum" character varying(64) NOT NULL,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) NOT NULL,
    "logs" "text",
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "applied_steps_count" integer DEFAULT 0 NOT NULL
);


--
-- Name: Etiquette id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Etiquette" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Etiquette_id_seq"'::"regclass");


--
-- Name: Etiquette_per_experiences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Etiquette_per_experiences" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Etiquette_per_experiences_id_seq"'::"regclass");


--
-- Name: Experiences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Experiences" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Experiences_id_seq"'::"regclass");


--
-- Name: Helpfullness id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Helpfullness" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Helpfullness_id_seq"'::"regclass");


--
-- Name: Place_etiquettes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Place_etiquettes" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Place_etiquettes_id_seq"'::"regclass");


--
-- Name: Places id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Places" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Places_id_seq"'::"regclass");


--
-- Name: Votes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Votes" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Votes_id_seq"'::"regclass");


--
-- Data for Name: Etiquette; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."Etiquette" ("id", "label", "place_type") FROM stdin;
1	Tattoos	ONSEN
2	Reservations	ONSEN
3	Time slot booking	ONSEN
4	Towels provided	ONSEN
5	Swimwear	ONSEN
6	Tie up long hair	ONSEN
7	Children	ONSEN
8	Taking photos	SHRINE
9	Coin offerings	SHRINE
10	Clap your hands during prayer	SHRINE
11	Touching sacred objects or ropes (shimenawa)	SHRINE
12	Food and drinks	SHRINE
13	Reservation	RESTAURANT
14	Shoes	RESTAURANT
15	Smoking	RESTAURANT
16	Children	RESTAURANT
17	Pets	RESTAURANT
\.


--
-- Data for Name: Etiquette_per_experiences; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."Etiquette_per_experiences" ("id", "experience_id", "place_etiquette_id") FROM stdin;
1	1	51
2	1	52
3	1	55
4	2	65
5	2	67
6	2	70
7	3	80
8	3	79
9	3	78
10	4	86
11	4	85
12	4	87
13	5	90
14	5	91
15	13	108
16	13	107
17	14	114
18	14	115
19	14	117
20	15	120
21	15	119
22	16	173
23	16	174
24	21	176
25	21	177
26	28	162
27	29	85
28	29	87
29	29	86
30	30	51
31	30	53
32	31	90
33	31	93
34	32	56
35	32	51
36	33	85
37	33	86
38	34	93
39	35	50
40	36	85
41	36	86
42	37	90
43	37	93
44	38	51
45	39	50
46	40	87
47	41	93
48	41	94
50	43	50
51	44	89
52	45	92
53	46	54
54	47	93
55	48	228
59	52	337
60	52	341
61	53	441
62	54	451
63	54	452
64	54	450
65	55	472
66	55	470
67	55	471
\.


--
-- Data for Name: Experiences; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."Experiences" ("id", "place_id", "user_id", "experience", "visited_at", "created_at", "edited_at") FROM stdin;
1	8	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	The private atmosphere created by the time slots was wonderful. Everyone arrived promptly for their designated time, which kept the flow organized and ensured a serene experience for all. I also noticed that guests were mindful of their allotted time and left punctually, making the system work seamlessly.	2024-12-02 00:00:00	2024-12-11 02:31:44.946	2024-12-11 02:31:44.946
2	10	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	Hoshinoyado exceeded my expectations, especially with the attention to detail in their amenities. One thing I really appreciated was the high-quality towels provided. Upon check-in, I received both a small towel for use in the bathing area and a large towel for drying off afterward.	2024-11-20 00:00:00	2024-12-11 02:36:15.29	2024-12-11 02:36:15.29
3	12	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	I had a wonderful experience at Yunoka and I was pleased to find that they are accommodating to guests with tattoos, as long as you cover them appropriately. The staff kindly provided a small adhesive cover for my tattoo, which allowed me to enjoy the baths without any concerns.\nIf you have tattoos, I recommend bringing a cover-up or asking the staff for assistance. With a little preparation, you can fully enjoy the beauty and tranquility of this onsen.	2024-12-01 00:00:00	2024-12-11 02:38:22.916	2024-12-11 02:38:22.916
4	13	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	One of the highlights was participating in the traditional prayer ritual. After purifying my hands and mouth at the temizuya (water pavilion), I approached the main shrine to offer my respects. Following the custom, I tossed a coin into the offering box, bowed twice, clapped my hands twice, and bowed again. The sound of the claps echoing in the peaceful surroundings felt deeply symbolic and grounding.	2024-12-07 00:00:00	2024-12-11 02:43:25.602	2024-12-11 02:43:25.602
5	14	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	The process was smooth and well-organized. The staff provided slippers for walking to your table, and your shoes are stored neatly in a designated area. It felt like stepping into a more intimate and respectful space, which made the meal even more enjoyable.	2024-11-03 00:00:00	2024-12-11 02:46:48.003	2024-12-11 02:46:48.003
13	16	zaMWKHqPZihRJjUF4nAWQrS7fDe2	The baths were clean and spacious, and the temperature was just right—not too hot for younger visitors. There was also a family changing area, which made it much easier to manage with kids in tow.\nIt was heartwarming to see how other visitors respected the family-friendly atmosphere, making it comfortable for both parents and kids to relax and enjoy the experience. My child loved the outdoor bath and the novelty of trying something so unique.	2024-11-20 00:00:00	2024-12-11 03:08:26.972	2024-12-11 03:08:26.972
14	18	zaMWKHqPZihRJjUF4nAWQrS7fDe2	My visit to Izumo Taisha was a serene and culturally enriching experience. The shrine grounds were beautifully maintained, with lush greenery and a tranquil atmosphere that invited reflection and prayer.\n\nOne important aspect of the shrine visit was the shimenawa—the sacred rope placed around certain areas or objects to signify purity. It's crucial to remember that touching the shimenawa is strictly forbidden. The rope marks a sacred boundary, and it’s essential to respect its significance in the shrine’s traditions. While I observed some visitors admiring it from a distance, everyone maintained a respectful attitude toward it, which added to the peaceful ambiance.	2024-11-17 00:00:00	2024-12-11 03:11:56.542	2024-12-11 03:11:56.542
15	19	zaMWKHqPZihRJjUF4nAWQrS7fDe2	I had high hopes for dining at there, but unfortunately, my visit was a letdown. Upon arriving, I was informed that the restaurant only accepts guests with reservations. Despite the fact that there were plenty of empty tables, the staff were firm in enforcing this policy and wouldn’t make any exceptions, even for a small party like mine.\n\nI understand that reservations help manage seating, but it was frustrating to have traveled all the way there without being told about the strict reservation-only policy in advance. The website and signage weren’t clear, and I was left feeling disappointed and inconvenienced.	2024-09-18 00:00:00	2024-12-11 03:13:21.011	2024-12-11 03:13:42.585
16	27	zaMWKHqPZihRJjUF4nAWQrS7fDe2	I had an incredible meal at [Restaurant Name] and couldn’t be more impressed. From the moment we walked in, the staff made us feel welcome and ensured we were comfortably seated. The ambiance was perfect—charming yet elegant, with a cozy atmosphere that encouraged relaxation.	2024-11-29 00:00:00	2024-12-11 03:18:06.979	2024-12-11 03:18:06.979
21	28	zaMWKHqPZihRJjUF4nAWQrS7fDe2	They deliver an unforgettable yakiniku experience with great food and a fun, hands-on dining style. Perfect for groups or anyone looking to enjoy high-quality grilled meat in a relaxed, vibrant setting. I’ll definitely be back!	2024-10-19 00:00:00	2024-12-11 03:19:32.983	2024-12-11 03:19:32.983
29	13	OquB0j8w2rgokp8fSPhovhyf1Bi2	The shrine is well-maintained and offers a sense of tranquility. I loved the opportunity to learn about the history and significance of the site.	2024-12-10 00:00:00	2024-12-11 05:10:22.055	2024-12-11 05:10:22.055
30	8	OquB0j8w2rgokp8fSPhovhyf1Bi2	I had such a peaceful time at the onsen. The water was soothing, and the staff was incredibly friendly. It was the perfect way to unwind after a long day of sightseeing.	2024-12-07 00:00:00	2024-12-11 05:12:10.753	2024-12-11 05:12:10.753
31	14	OquB0j8w2rgokp8fSPhovhyf1Bi2	This is one of the best Japanese restaurants I’ve been to. The tempura was perfectly crispy, and the sashimi was so fresh. The service was impeccable as well.	2024-10-17 00:00:00	2024-12-11 05:14:15.668	2024-12-11 05:14:15.668
32	8	xEESMrrVZkWGfzOj2VKB1u7QaDX2	The onsen was disappointing. The facilities were outdated, and the water didn’t seem as clean as I had expected. It wasn't the relaxing experience I was hoping for.	2024-11-24 00:00:00	2024-12-11 05:16:26.749	2024-12-11 05:16:26.749
33	13	xEESMrrVZkWGfzOj2VKB1u7QaDX2	This shrine is a hidden gem. The architecture is breathtaking, and the view from the top is amazing. The peaceful environment made it a great place to meditate.	2024-12-01 00:00:00	2024-12-11 05:17:47.741	2024-12-11 05:17:47.741
34	14	xEESMrrVZkWGfzOj2VKB1u7QaDX2	I didn’t enjoy my meal here. The rice in the sushi was mushy, and the miso soup was too salty. The restaurant was also very noisy, which made it hard to enjoy the meal.	2024-11-23 00:00:00	2024-12-11 05:19:29.291	2024-12-11 05:19:29.291
35	8	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	I was really looking forward to visiting this onsen, but I was turned away because of my tattoos. I understand that some onsens have rules about tattoos due to cultural reasons, but it felt unfair and outdated, especially since my tattoos are small and personal. There was no clear explanation or alternative offered, and it left me feeling embarrassed and excluded. It’s disappointing that they don’t accommodate international visitors better, given how common tattoos are globally now.	2024-12-01 00:00:00	2024-12-11 05:23:53.036	2024-12-11 05:23:53.036
36	13	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	Unfortunately, my visit to the shrine was underwhelming. The place was crowded and not as serene as I had hoped. The staff seemed uninterested in engaging with visitors.	2024-11-22 00:00:00	2024-12-11 05:25:54.481	2024-12-11 05:25:54.481
37	14	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	A fantastic dining experience! The sushi rolls were amazing!!	2024-11-07 00:00:00	2024-12-11 05:27:50.738	2024-12-11 05:27:50.738
38	8	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	We were allowed to make reservations. It was nice and easy to do. Thanks for a great stay. If you need to make a reservation, just go to the front desk and they will help you. Don't just try to go into the onsen without a reservation otherwise the owner might get upset.	2024-12-09 00:00:00	2024-12-11 05:31:27.869	2024-12-11 05:31:27.869
39	8	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	I was surprised by the tattoo policy. I have tattoos on my arm, but they let me in without any complaints. I expected they would ask me to cover up because I saw some other people covering their tattoos, but no one said anything.	2024-12-06 00:00:00	2024-12-11 05:43:15.455	2024-12-11 05:43:15.455
40	13	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	I think I clapped my hands too loudly. It seemed to annoy other people praying next to me. So, even though I saw people clapping their hands, make sure you don't clap too loudly. Enjoyable place otherwise!	2024-12-09 00:00:00	2024-12-11 05:45:33.407	2024-12-11 05:45:33.407
41	14	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	Whoever said children are not allowed is wrong. Children are absolutely allowed. There were kids practically running around the place. Bring your whole family, kids, and parents and grandparents!  Don't bring dogs. Though I did hear that guide dogs are allowed... not sure about that to be honest.	2024-12-03 00:00:00	2024-12-11 05:48:49.045	2024-12-11 05:48:49.045
43	8	d19bMa6rfEQS00borVgIEpfH49P2	Some people had tattoos, but they were covered up. Other people had tattoos that weren't covered up. I think the owner should make the policy clear because some Japanese people looked nervous when I had my tattoos out.	2024-12-09 00:00:00	2024-12-11 05:53:50.312	2024-12-11 05:53:50.312
44	13	d19bMa6rfEQS00borVgIEpfH49P2	I saw a monk ask someone not to eat, but I saw lots of people eating around the shrine. Not sure what the policy is, but I guess if a monk is telling people not to eat, then it is probably best not to eat.	2024-12-03 00:00:00	2024-12-11 05:56:18.899	2024-12-11 05:56:18.899
45	14	d19bMa6rfEQS00borVgIEpfH49P2	Whatever you do, do not try to light up a crafty fag unless you're outside. I tried during dessert and I got kicked out.	2024-12-10 00:00:00	2024-12-11 05:59:45.148	2024-12-11 05:59:45.148
46	8	2xR2s6rSvMeO1bBgMJdhAQ1zN632	People were laughing at me and I think it was because I was wearing my swimming costume. I had never been to an onsen, so I wasn't sure what to do. Don't wear swimwear inside an onsen. Be prepared to get comfortable with being naked in front of everyone.	2024-12-02 00:00:00	2024-12-11 06:02:59.519	2024-12-11 06:02:59.519
47	14	2xR2s6rSvMeO1bBgMJdhAQ1zN632	Amazing place. Definitely recommend to anyone who loves Japan. It's very welcoming for children and they provide great meals that even kids can enjoy Japanese culture without being too overwhelmed by it all.	2024-12-09 00:00:00	2024-12-11 06:08:06.57	2024-12-11 06:08:06.57
48	36	NktMSwswcyRgUrmtZcsLR6uRDju2	Very proffesional. you can were swimsuit if you are not ready	2024-12-11 00:00:00	2024-12-11 08:29:35.712	2024-12-11 08:29:35.712
52	53	fmkwCCii7ve1qpwkU5nyGx5f8Fz2	When we went there earlier this week, photos seemed to be welcome in most areas. I can't be sure, but I would avoid eating on the premises.	2024-12-03 00:00:00	2024-12-12 04:53:44.999	2024-12-12 04:53:44.999
28	25	zOMqdBvvhKOoTUF2CaVtXOqG0Lr2	Towels are available to rent for a fee! Those who cannot be bothered to bring their own can rest easy!	2024-12-11 00:00:00	2024-12-11 04:10:18.3	2024-12-11 08:45:19.037
53	69	dRw8f3rRaFTdBNMJcm2ICN3OC013	I like shrine and this is most favorite shrine in Japan.	2024-09-14 00:00:00	2024-12-16 11:38:00.882	2024-12-16 11:38:00.882
54	71	dRw8f3rRaFTdBNMJcm2ICN3OC013	This shrine is most popular things at Japan. 	2024-01-16 00:00:00	2024-12-16 11:44:11.733	2024-12-16 11:44:11.733
55	75	dRw8f3rRaFTdBNMJcm2ICN3OC013	This Onsen has many kind of onsen. For example, carbonic acid hot springs, medicinal spring etc.\nAnd this facility is near from stations.	2024-11-12 00:00:00	2024-12-16 11:58:03.247	2024-12-16 11:58:03.247
\.


--
-- Data for Name: Helpfullness; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."Helpfullness" ("id", "user_id", "experience_id", "status") FROM stdin;
1	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	1	UP
2	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	2	UP
3	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	3	UP
4	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	4	UP
5	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	5	UP
6	zaMWKHqPZihRJjUF4nAWQrS7fDe2	13	UP
7	zaMWKHqPZihRJjUF4nAWQrS7fDe2	14	UP
88	zOMqdBvvhKOoTUF2CaVtXOqG0Lr2	4	UP
11	zaMWKHqPZihRJjUF4nAWQrS7fDe2	16	UP
12	zaMWKHqPZihRJjUF4nAWQrS7fDe2	21	UP
13	zaMWKHqPZihRJjUF4nAWQrS7fDe2	1	UP
14	zaMWKHqPZihRJjUF4nAWQrS7fDe2	4	UP
15	zaMWKHqPZihRJjUF4nAWQrS7fDe2	5	UP
16	OquB0j8w2rgokp8fSPhovhyf1Bi2	1	UP
17	OquB0j8w2rgokp8fSPhovhyf1Bi2	4	UP
90	NktMSwswcyRgUrmtZcsLR6uRDju2	4	UP
18	OquB0j8w2rgokp8fSPhovhyf1Bi2	29	DOWN
19	OquB0j8w2rgokp8fSPhovhyf1Bi2	5	DOWN
20	OquB0j8w2rgokp8fSPhovhyf1Bi2	31	UP
21	xEESMrrVZkWGfzOj2VKB1u7QaDX2	30	UP
22	xEESMrrVZkWGfzOj2VKB1u7QaDX2	32	DOWN
23	xEESMrrVZkWGfzOj2VKB1u7QaDX2	1	DOWN
25	xEESMrrVZkWGfzOj2VKB1u7QaDX2	4	UP
26	xEESMrrVZkWGfzOj2VKB1u7QaDX2	33	UP
29	xEESMrrVZkWGfzOj2VKB1u7QaDX2	31	DOWN
28	xEESMrrVZkWGfzOj2VKB1u7QaDX2	5	DOWN
30	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	1	UP
31	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	30	DOWN
32	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	32	UP
33	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	35	UP
34	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	4	UP
35	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	33	DOWN
36	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	29	UP
37	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	36	UP
38	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	5	UP
39	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	31	DOWN
40	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	34	UP
41	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	37	UP
42	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	38	UP
43	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	1	UP
44	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	35	UP
46	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	30	DOWN
47	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	32	DOWN
48	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	39	UP
49	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	36	UP
50	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	33	DOWN
51	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	40	UP
52	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	5	DOWN
53	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	34	DOWN
54	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	37	DOWN
56	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	41	UP
57	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	31	DOWN
59	d19bMa6rfEQS00borVgIEpfH49P2	39	UP
60	d19bMa6rfEQS00borVgIEpfH49P2	1	DOWN
61	d19bMa6rfEQS00borVgIEpfH49P2	35	DOWN
62	d19bMa6rfEQS00borVgIEpfH49P2	30	DOWN
63	d19bMa6rfEQS00borVgIEpfH49P2	32	DOWN
64	d19bMa6rfEQS00borVgIEpfH49P2	43	UP
66	d19bMa6rfEQS00borVgIEpfH49P2	36	DOWN
67	d19bMa6rfEQS00borVgIEpfH49P2	40	DOWN
68	d19bMa6rfEQS00borVgIEpfH49P2	29	DOWN
69	d19bMa6rfEQS00borVgIEpfH49P2	44	UP
65	d19bMa6rfEQS00borVgIEpfH49P2	4	DOWN
70	d19bMa6rfEQS00borVgIEpfH49P2	41	UP
71	d19bMa6rfEQS00borVgIEpfH49P2	45	UP
72	2xR2s6rSvMeO1bBgMJdhAQ1zN632	1	DOWN
73	2xR2s6rSvMeO1bBgMJdhAQ1zN632	39	UP
74	2xR2s6rSvMeO1bBgMJdhAQ1zN632	46	UP
75	2xR2s6rSvMeO1bBgMJdhAQ1zN632	44	UP
76	2xR2s6rSvMeO1bBgMJdhAQ1zN632	40	UP
78	2xR2s6rSvMeO1bBgMJdhAQ1zN632	41	UP
79	2xR2s6rSvMeO1bBgMJdhAQ1zN632	47	UP
80	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	38	UP
81	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	43	UP
82	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	44	UP
83	NktMSwswcyRgUrmtZcsLR6uRDju2	48	UP
92	NktMSwswcyRgUrmtZcsLR6uRDju2	44	UP
94	fmkwCCii7ve1qpwkU5nyGx5f8Fz2	4	UP
95	fmkwCCii7ve1qpwkU5nyGx5f8Fz2	44	UP
97	fmkwCCii7ve1qpwkU5nyGx5f8Fz2	29	DOWN
\.


--
-- Data for Name: Place_etiquettes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."Place_etiquettes" ("id", "place_id", "etiquette_id", "status") FROM stdin;
1	1	1	ALLOWED
2	1	2	ALLOWED
3	1	3	ALLOWED
4	1	4	ALLOWED
5	1	5	ALLOWED
6	1	6	ALLOWED
7	1	7	ALLOWED
8	2	1	ALLOWED
9	2	2	ALLOWED
10	2	3	ALLOWED
11	2	4	ALLOWED
12	2	5	ALLOWED
13	2	6	ALLOWED
14	2	7	ALLOWED
15	3	1	ALLOWED
16	3	2	ALLOWED
17	3	3	ALLOWED
18	3	4	ALLOWED
19	3	5	ALLOWED
20	3	6	ALLOWED
21	3	7	ALLOWED
22	4	1	ALLOWED
23	4	2	ALLOWED
24	4	3	ALLOWED
25	4	4	ALLOWED
26	4	5	ALLOWED
27	4	6	ALLOWED
28	4	7	ALLOWED
29	5	1	ALLOWED
30	5	2	ALLOWED
31	5	3	ALLOWED
32	5	4	ALLOWED
33	5	5	ALLOWED
34	5	6	ALLOWED
35	5	7	ALLOWED
36	6	1	ALLOWED
37	6	2	ALLOWED
38	6	3	ALLOWED
39	6	4	ALLOWED
40	6	5	ALLOWED
41	6	6	ALLOWED
42	6	7	ALLOWED
43	7	1	ALLOWED
44	7	2	ALLOWED
45	7	3	ALLOWED
46	7	4	ALLOWED
47	7	5	ALLOWED
48	7	6	ALLOWED
49	7	7	ALLOWED
50	8	1	ALLOWED
51	8	2	ALLOWED
52	8	3	ALLOWED
53	8	4	ALLOWED
54	8	5	ALLOWED
55	8	6	ALLOWED
56	8	7	ALLOWED
57	9	1	ALLOWED
58	9	2	ALLOWED
59	9	3	ALLOWED
60	9	4	ALLOWED
61	9	5	ALLOWED
62	9	6	ALLOWED
63	9	7	ALLOWED
64	10	1	ALLOWED
65	10	2	ALLOWED
66	10	3	ALLOWED
67	10	4	ALLOWED
68	10	5	ALLOWED
69	10	6	ALLOWED
70	10	7	ALLOWED
71	11	1	ALLOWED
72	11	2	ALLOWED
73	11	3	ALLOWED
74	11	4	ALLOWED
75	11	5	ALLOWED
76	11	6	ALLOWED
77	11	7	ALLOWED
78	12	1	ALLOWED
79	12	2	ALLOWED
80	12	3	ALLOWED
81	12	4	ALLOWED
82	12	5	ALLOWED
83	12	6	ALLOWED
84	12	7	ALLOWED
85	13	8	ALLOWED
86	13	9	ALLOWED
87	13	10	ALLOWED
88	13	11	ALLOWED
89	13	12	ALLOWED
90	14	13	ALLOWED
91	14	14	ALLOWED
92	14	15	ALLOWED
93	14	16	ALLOWED
94	14	17	ALLOWED
95	15	1	ALLOWED
96	15	2	ALLOWED
97	15	3	ALLOWED
98	15	4	ALLOWED
99	15	5	ALLOWED
100	15	6	ALLOWED
101	15	7	ALLOWED
102	16	1	ALLOWED
103	16	2	ALLOWED
104	16	3	ALLOWED
105	16	4	ALLOWED
106	16	5	ALLOWED
107	16	6	ALLOWED
108	16	7	ALLOWED
109	17	8	ALLOWED
110	17	9	ALLOWED
111	17	10	ALLOWED
112	17	11	ALLOWED
113	17	12	ALLOWED
114	18	8	ALLOWED
115	18	9	ALLOWED
116	18	10	ALLOWED
117	18	11	ALLOWED
118	18	12	ALLOWED
119	19	13	ALLOWED
120	19	14	ALLOWED
121	19	15	ALLOWED
122	19	16	ALLOWED
123	19	17	ALLOWED
124	20	1	ALLOWED
125	20	2	ALLOWED
126	20	3	ALLOWED
127	20	4	ALLOWED
128	20	5	ALLOWED
129	20	6	ALLOWED
130	20	7	ALLOWED
131	21	1	ALLOWED
132	21	2	ALLOWED
133	21	3	ALLOWED
134	21	4	ALLOWED
135	21	5	ALLOWED
136	21	6	ALLOWED
137	21	7	ALLOWED
138	22	1	ALLOWED
139	22	2	ALLOWED
140	22	3	ALLOWED
141	22	4	ALLOWED
142	22	5	ALLOWED
143	22	6	ALLOWED
144	22	7	ALLOWED
145	23	1	ALLOWED
146	23	2	ALLOWED
147	23	3	ALLOWED
148	23	4	ALLOWED
149	23	5	ALLOWED
150	23	6	ALLOWED
151	23	7	ALLOWED
152	24	1	ALLOWED
153	24	2	ALLOWED
154	24	3	ALLOWED
155	24	4	ALLOWED
156	24	5	ALLOWED
157	24	6	ALLOWED
158	24	7	ALLOWED
159	25	1	ALLOWED
160	25	2	ALLOWED
161	25	3	ALLOWED
162	25	4	ALLOWED
163	25	5	ALLOWED
164	25	6	ALLOWED
165	25	7	ALLOWED
166	26	13	ALLOWED
167	26	14	ALLOWED
168	26	15	ALLOWED
169	26	16	ALLOWED
170	26	17	ALLOWED
171	27	13	ALLOWED
172	27	14	ALLOWED
173	27	15	ALLOWED
174	27	16	ALLOWED
175	27	17	ALLOWED
176	28	13	ALLOWED
177	28	14	ALLOWED
178	28	15	ALLOWED
179	28	16	ALLOWED
180	28	17	ALLOWED
181	29	1	ALLOWED
182	29	2	ALLOWED
183	29	3	ALLOWED
184	29	4	ALLOWED
185	29	5	ALLOWED
186	29	6	ALLOWED
187	29	7	ALLOWED
188	30	1	ALLOWED
189	30	2	ALLOWED
190	30	3	ALLOWED
191	30	4	ALLOWED
192	30	5	ALLOWED
193	30	6	ALLOWED
194	30	7	ALLOWED
195	31	13	ALLOWED
196	31	14	ALLOWED
197	31	15	ALLOWED
198	31	16	ALLOWED
199	31	17	ALLOWED
200	32	8	ALLOWED
201	32	9	ALLOWED
202	32	10	ALLOWED
203	32	11	ALLOWED
204	32	12	ALLOWED
205	33	8	ALLOWED
206	33	9	ALLOWED
207	33	10	ALLOWED
208	33	11	ALLOWED
209	33	12	ALLOWED
210	34	1	ALLOWED
211	34	2	ALLOWED
212	34	3	ALLOWED
213	34	4	ALLOWED
214	34	5	ALLOWED
215	34	6	ALLOWED
216	34	7	ALLOWED
217	35	1	ALLOWED
218	35	2	ALLOWED
219	35	3	ALLOWED
220	35	4	ALLOWED
221	35	5	ALLOWED
222	35	6	ALLOWED
223	35	7	ALLOWED
224	36	1	ALLOWED
225	36	2	ALLOWED
226	36	3	ALLOWED
227	36	4	ALLOWED
228	36	5	ALLOWED
229	36	6	ALLOWED
230	36	7	ALLOWED
231	37	1	ALLOWED
232	37	2	ALLOWED
233	37	3	ALLOWED
234	37	4	ALLOWED
235	37	5	ALLOWED
236	37	6	ALLOWED
237	37	7	ALLOWED
238	38	1	ALLOWED
239	38	2	ALLOWED
240	38	3	ALLOWED
241	38	4	ALLOWED
242	38	5	ALLOWED
243	38	6	ALLOWED
244	38	7	ALLOWED
245	39	1	ALLOWED
246	39	2	ALLOWED
247	39	3	ALLOWED
248	39	4	ALLOWED
249	39	5	ALLOWED
250	39	6	ALLOWED
251	39	7	ALLOWED
252	40	1	ALLOWED
253	40	2	ALLOWED
254	40	3	ALLOWED
255	40	4	ALLOWED
256	40	5	ALLOWED
257	40	6	ALLOWED
258	40	7	ALLOWED
259	41	1	ALLOWED
260	41	2	ALLOWED
261	41	3	ALLOWED
262	41	4	ALLOWED
263	41	5	ALLOWED
264	41	6	ALLOWED
265	41	7	ALLOWED
266	42	1	ALLOWED
267	42	2	ALLOWED
268	42	3	ALLOWED
269	42	4	ALLOWED
270	42	5	ALLOWED
271	42	6	ALLOWED
272	42	7	ALLOWED
273	43	1	ALLOWED
274	43	2	ALLOWED
275	43	3	ALLOWED
276	43	4	ALLOWED
277	43	5	ALLOWED
278	43	6	ALLOWED
279	43	7	ALLOWED
280	44	1	ALLOWED
281	44	2	ALLOWED
282	44	3	ALLOWED
283	44	4	ALLOWED
284	44	5	ALLOWED
285	44	6	ALLOWED
286	44	7	ALLOWED
287	45	1	ALLOWED
288	45	2	ALLOWED
289	45	3	ALLOWED
290	45	4	ALLOWED
291	45	5	ALLOWED
292	45	6	ALLOWED
293	45	7	ALLOWED
294	46	1	ALLOWED
295	46	2	ALLOWED
296	46	3	ALLOWED
297	46	4	ALLOWED
298	46	5	ALLOWED
299	46	6	ALLOWED
300	46	7	ALLOWED
301	47	1	ALLOWED
302	47	2	ALLOWED
303	47	3	ALLOWED
304	47	4	ALLOWED
305	47	5	ALLOWED
306	47	6	ALLOWED
307	47	7	ALLOWED
308	48	1	ALLOWED
309	48	2	ALLOWED
310	48	3	ALLOWED
311	48	4	ALLOWED
312	48	5	ALLOWED
313	48	6	ALLOWED
314	48	7	ALLOWED
315	49	1	ALLOWED
316	49	2	ALLOWED
317	49	3	ALLOWED
318	49	4	ALLOWED
319	49	5	ALLOWED
320	49	6	ALLOWED
321	49	7	ALLOWED
322	50	8	ALLOWED
323	50	9	ALLOWED
324	50	10	ALLOWED
325	50	11	ALLOWED
326	50	12	ALLOWED
327	51	13	ALLOWED
328	51	14	ALLOWED
329	51	15	ALLOWED
330	51	16	ALLOWED
331	51	17	ALLOWED
332	52	8	ALLOWED
333	52	9	ALLOWED
334	52	10	ALLOWED
335	52	11	ALLOWED
336	52	12	ALLOWED
337	53	8	ALLOWED
338	53	9	ALLOWED
339	53	10	ALLOWED
340	53	11	ALLOWED
341	53	12	ALLOWED
342	54	8	ALLOWED
343	54	9	ALLOWED
344	54	10	ALLOWED
345	54	11	ALLOWED
346	54	12	ALLOWED
347	55	8	ALLOWED
348	55	9	ALLOWED
349	55	10	ALLOWED
350	55	11	ALLOWED
351	55	12	ALLOWED
352	56	8	ALLOWED
353	56	9	ALLOWED
354	56	10	ALLOWED
355	56	11	ALLOWED
356	56	12	ALLOWED
357	57	1	ALLOWED
358	57	2	ALLOWED
359	57	3	ALLOWED
360	57	4	ALLOWED
361	57	5	ALLOWED
362	57	6	ALLOWED
363	57	7	ALLOWED
364	58	1	ALLOWED
365	58	2	ALLOWED
366	58	3	ALLOWED
367	58	4	ALLOWED
368	58	5	ALLOWED
369	58	6	ALLOWED
370	58	7	ALLOWED
371	59	1	ALLOWED
372	59	2	ALLOWED
373	59	3	ALLOWED
374	59	4	ALLOWED
375	59	5	ALLOWED
376	59	6	ALLOWED
377	59	7	ALLOWED
378	60	1	ALLOWED
379	60	2	ALLOWED
380	60	3	ALLOWED
381	60	4	ALLOWED
382	60	5	ALLOWED
383	60	6	ALLOWED
384	60	7	ALLOWED
385	61	1	ALLOWED
386	61	2	ALLOWED
387	61	3	ALLOWED
388	61	4	ALLOWED
389	61	5	ALLOWED
390	61	6	ALLOWED
391	61	7	ALLOWED
392	62	1	ALLOWED
393	62	2	ALLOWED
394	62	3	ALLOWED
395	62	4	ALLOWED
396	62	5	ALLOWED
397	62	6	ALLOWED
398	62	7	ALLOWED
399	63	8	ALLOWED
400	63	9	ALLOWED
401	63	10	ALLOWED
402	63	11	ALLOWED
403	63	12	ALLOWED
404	64	1	ALLOWED
405	64	2	ALLOWED
406	64	3	ALLOWED
407	64	4	ALLOWED
408	64	5	ALLOWED
409	64	6	ALLOWED
410	64	7	ALLOWED
411	65	1	ALLOWED
412	65	2	ALLOWED
413	65	3	ALLOWED
414	65	4	ALLOWED
415	65	5	ALLOWED
416	65	6	ALLOWED
417	65	7	ALLOWED
418	66	1	ALLOWED
419	66	2	ALLOWED
420	66	3	ALLOWED
421	66	4	ALLOWED
422	66	5	ALLOWED
423	66	6	ALLOWED
424	66	7	ALLOWED
425	67	1	ALLOWED
426	67	2	ALLOWED
427	67	3	ALLOWED
428	67	4	ALLOWED
429	67	5	ALLOWED
430	67	6	ALLOWED
431	67	7	ALLOWED
432	68	1	ALLOWED
433	68	2	ALLOWED
434	68	3	ALLOWED
435	68	4	ALLOWED
436	68	5	ALLOWED
437	68	6	ALLOWED
438	68	7	ALLOWED
439	69	8	ALLOWED
440	69	9	ALLOWED
441	69	10	ALLOWED
442	69	11	ALLOWED
443	69	12	ALLOWED
444	70	8	ALLOWED
445	70	9	ALLOWED
446	70	10	ALLOWED
447	70	11	ALLOWED
448	70	12	ALLOWED
449	71	8	ALLOWED
450	71	9	ALLOWED
451	71	10	ALLOWED
452	71	11	ALLOWED
453	71	12	ALLOWED
454	72	8	ALLOWED
455	72	9	ALLOWED
456	72	10	ALLOWED
457	72	11	ALLOWED
458	72	12	ALLOWED
459	73	8	ALLOWED
460	73	9	ALLOWED
461	73	10	ALLOWED
462	73	11	ALLOWED
463	73	12	ALLOWED
464	74	8	ALLOWED
465	74	9	ALLOWED
466	74	10	ALLOWED
467	74	11	ALLOWED
468	74	12	ALLOWED
469	75	1	ALLOWED
470	75	2	ALLOWED
471	75	3	ALLOWED
472	75	4	ALLOWED
473	75	5	ALLOWED
474	75	6	ALLOWED
475	75	7	ALLOWED
476	76	8	ALLOWED
477	76	9	ALLOWED
478	76	10	ALLOWED
479	76	11	ALLOWED
480	76	12	ALLOWED
481	77	8	ALLOWED
482	77	9	ALLOWED
483	77	10	ALLOWED
484	77	11	ALLOWED
485	77	12	ALLOWED
486	78	8	ALLOWED
487	78	9	ALLOWED
488	78	10	ALLOWED
489	78	11	ALLOWED
490	78	12	ALLOWED
491	79	1	ALLOWED
492	79	2	ALLOWED
493	79	3	ALLOWED
494	79	4	ALLOWED
495	79	5	ALLOWED
496	79	6	ALLOWED
497	79	7	ALLOWED
498	80	1	ALLOWED
499	80	2	ALLOWED
500	80	3	ALLOWED
501	80	4	ALLOWED
502	80	5	ALLOWED
503	80	6	ALLOWED
504	80	7	ALLOWED
505	81	1	ALLOWED
506	81	2	ALLOWED
507	81	3	ALLOWED
508	81	4	ALLOWED
509	81	5	ALLOWED
510	81	6	ALLOWED
511	81	7	ALLOWED
512	82	1	ALLOWED
513	82	2	ALLOWED
514	82	3	ALLOWED
515	82	4	ALLOWED
516	82	5	ALLOWED
517	82	6	ALLOWED
518	82	7	ALLOWED
519	83	8	ALLOWED
520	83	9	ALLOWED
521	83	10	ALLOWED
522	83	11	ALLOWED
523	83	12	ALLOWED
524	84	8	ALLOWED
525	84	9	ALLOWED
526	84	10	ALLOWED
527	84	11	ALLOWED
528	84	12	ALLOWED
529	85	8	ALLOWED
530	85	9	ALLOWED
531	85	10	ALLOWED
532	85	11	ALLOWED
533	85	12	ALLOWED
534	86	8	ALLOWED
535	86	9	ALLOWED
536	86	10	ALLOWED
537	86	11	ALLOWED
538	86	12	ALLOWED
539	87	1	ALLOWED
540	87	2	ALLOWED
541	87	3	ALLOWED
542	87	4	ALLOWED
543	87	5	ALLOWED
544	87	6	ALLOWED
545	87	7	ALLOWED
546	88	1	ALLOWED
547	88	2	ALLOWED
548	88	3	ALLOWED
549	88	4	ALLOWED
550	88	5	ALLOWED
551	88	6	ALLOWED
552	88	7	ALLOWED
553	89	1	ALLOWED
554	89	2	ALLOWED
555	89	3	ALLOWED
556	89	4	ALLOWED
557	89	5	ALLOWED
558	89	6	ALLOWED
559	89	7	ALLOWED
560	90	1	ALLOWED
561	90	2	ALLOWED
562	90	3	ALLOWED
563	90	4	ALLOWED
564	90	5	ALLOWED
565	90	6	ALLOWED
566	90	7	ALLOWED
567	91	1	ALLOWED
568	91	2	ALLOWED
569	91	3	ALLOWED
570	91	4	ALLOWED
571	91	5	ALLOWED
572	91	6	ALLOWED
573	91	7	ALLOWED
574	92	1	ALLOWED
575	92	2	ALLOWED
576	92	3	ALLOWED
577	92	4	ALLOWED
578	92	5	ALLOWED
579	92	6	ALLOWED
580	92	7	ALLOWED
581	93	1	ALLOWED
582	93	2	ALLOWED
583	93	3	ALLOWED
584	93	4	ALLOWED
585	93	5	ALLOWED
586	93	6	ALLOWED
587	93	7	ALLOWED
588	94	1	ALLOWED
589	94	2	ALLOWED
590	94	3	ALLOWED
591	94	4	ALLOWED
592	94	5	ALLOWED
593	94	6	ALLOWED
594	94	7	ALLOWED
595	95	8	ALLOWED
596	95	9	ALLOWED
597	95	10	ALLOWED
598	95	11	ALLOWED
599	95	12	ALLOWED
600	96	13	ALLOWED
601	96	14	ALLOWED
602	96	15	ALLOWED
603	96	16	ALLOWED
604	96	17	ALLOWED
605	97	13	ALLOWED
606	97	14	ALLOWED
607	97	15	ALLOWED
608	97	16	ALLOWED
609	97	17	ALLOWED
\.


--
-- Data for Name: Places; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."Places" ("id", "place_type", "google_place_id", "created_at", "edited_at") FROM stdin;
1	ONSEN	ChIJAVOOAbsB5TQRjKBJ1csS2x4	2024-12-11 01:53:27.314	2024-12-11 01:53:27.314
2	ONSEN	ChIJD-NXSlfmHWARuw6_LrpGHSA	2024-12-11 02:08:03.405	2024-12-11 02:08:03.405
3	ONSEN	ChIJm1GD0v3mHWAR0blyr7sCEWo	2024-12-11 02:08:09.946	2024-12-11 02:08:09.946
4	ONSEN	ChIJAQCQdqvnHWARZ7EFbUX1XcU	2024-12-11 02:08:19.121	2024-12-11 02:08:19.121
5	ONSEN	ChIJhSOEelTmHWARE6-9i2kVdNQ	2024-12-11 02:08:23.061	2024-12-11 02:08:23.061
6	ONSEN	ChIJsZgcLgDnHWAROidQiPBhIMA	2024-12-11 02:27:02.426	2024-12-11 02:27:02.426
7	ONSEN	ChIJS3yPzwPnHWARJfYLYMwL2-c	2024-12-11 02:27:06.034	2024-12-11 02:27:06.034
8	ONSEN	ChIJA9EwTarnHWARmQ3xkazUY_U	2024-12-11 02:27:08.602	2024-12-11 02:27:08.602
9	ONSEN	ChIJnzahTQCkH2ARzv-dO19Rkao	2024-12-11 02:34:37.871	2024-12-11 02:34:37.871
10	ONSEN	ChIJ08Rd79WmH2AR_qgiz5HTc_s	2024-12-11 02:34:41.304	2024-12-11 02:34:41.304
11	ONSEN	ChIJx205FtCuH2ARkUYihqISO9E	2024-12-11 02:36:33.962	2024-12-11 02:36:33.962
12	ONSEN	ChIJnaGVfEGyH2ARpbhFcGybBJk	2024-12-11 02:36:37.382	2024-12-11 02:36:37.382
13	SHRINE	ChIJaQiTNRmMGGARRIdlDDuf8BQ	2024-12-11 02:41:57.878	2024-12-11 02:41:57.878
14	RESTAURANT	ChIJo4MXONqMGGARUXyT8zCPxnI	2024-12-11 02:44:40.691	2024-12-11 02:44:40.691
15	ONSEN	ChIJ3xELpQ69AWAR1lv3GJzY44k	2024-12-11 02:59:43.039	2024-12-11 02:59:43.039
16	ONSEN	ChIJJ7TljMLnHWARhKn9_xI8iqk	2024-12-11 03:07:50.847	2024-12-11 03:07:50.847
17	SHRINE	ChIJ07GXRJpcVzUR6891mtVjl3c	2024-12-11 03:09:18.778	2024-12-11 03:09:18.778
18	SHRINE	ChIJPRlWKpRcVzUR74S6_K5qanA	2024-12-11 03:09:29.125	2024-12-11 03:09:29.125
19	RESTAURANT	ChIJ_yjwhNR2A2ARff0CgRHIJ2c	2024-12-11 03:12:15.32	2024-12-11 03:12:15.32
20	ONSEN	ChIJ-8Hv1dtgGGARKrasdoxD4XM	2024-12-11 03:15:55.57	2024-12-11 03:15:55.57
21	ONSEN	ChIJ5a1keOlfGGARk7w73Ny8YdU	2024-12-11 03:16:17.533	2024-12-11 03:16:17.533
22	ONSEN	ChIJ12KJiy5eGGARx5mSWuWAia0	2024-12-11 03:16:19.75	2024-12-11 03:16:19.75
23	ONSEN	ChIJtWXoKKJgGGARlUvoM0Bm-b4	2024-12-11 03:16:29.751	2024-12-11 03:16:29.751
24	ONSEN	ChIJZ9Uw1I9fGGARug_wh6m0yDg	2024-12-11 03:16:33.596	2024-12-11 03:16:33.596
25	ONSEN	ChIJNY2jGy1eGGARdS9pd3Njt6I	2024-12-11 03:16:37.407	2024-12-11 03:16:37.407
26	RESTAURANT	ChIJbQoUyUWPGGARugqYxqULNw4	2024-12-11 03:16:48.409	2024-12-11 03:16:48.409
27	RESTAURANT	ChIJtXwpdyqNGGARWeeu76y-IEE	2024-12-11 03:16:53.146	2024-12-11 03:16:53.146
28	RESTAURANT	ChIJ9bFAjKSOGGARqsl1Ru2ZQs0	2024-12-11 03:18:32.921	2024-12-11 03:18:32.921
29	ONSEN	ChIJz4Fb1_OPGGARGEIVVGIuUtk	2024-12-11 05:04:11.729	2024-12-11 05:04:11.729
30	ONSEN	ChIJnepn-wKMGGARhcMjmjbpsvs	2024-12-11 05:04:14.611	2024-12-11 05:04:14.611
31	RESTAURANT	ChIJVbZOnrbyGGARzSe1BTQULvI	2024-12-11 05:05:12.756	2024-12-11 05:05:12.756
32	SHRINE	ChIJw7n09rmMGGARNfx8WUEX9go	2024-12-11 05:30:07.155	2024-12-11 05:30:07.155
33	SHRINE	ChIJsyv0pLqMGGARO-cDLT1bCeU	2024-12-11 05:30:09.811	2024-12-11 05:30:09.811
34	ONSEN	ChIJrRhc_R_zGGARFRwwN2m94Oo	2024-12-11 08:28:43.923	2024-12-11 08:28:43.923
35	ONSEN	ChIJl4yHVBnyGGAR1AeEbT4DGJw	2024-12-11 08:28:53.248	2024-12-11 08:28:53.248
36	ONSEN	ChIJRwn2XCaNGGARII-6woQjTiA	2024-12-11 08:29:04.982	2024-12-11 08:29:04.982
37	ONSEN	ChIJC962IfrtGGARv5l7q5OnilU	2024-12-11 08:29:50.999	2024-12-11 08:29:50.999
38	ONSEN	ChIJnXveuAXzGGARkxhb15e-UH4	2024-12-11 08:30:06.987	2024-12-11 08:30:06.987
39	ONSEN	ChIJ4dp-zJ-MGGARfBlYKC5tHxc	2024-12-11 08:41:55.495	2024-12-11 08:41:55.495
40	ONSEN	ChIJJ8L_6dqMGGAR-ibwhw6hN8A	2024-12-11 08:42:41.342	2024-12-11 08:42:41.342
41	ONSEN	ChIJVVWpw5nyGGAREdFx6ZQ3uXs	2024-12-11 08:42:50.054	2024-12-11 08:42:50.054
42	ONSEN	ChIJndIVjLDyGGARhbvuQi7wIb0	2024-12-11 08:42:54.951	2024-12-11 08:42:54.951
43	ONSEN	ChIJ70LPxyiNGGARhio04pjPcQg	2024-12-11 08:42:57.061	2024-12-11 08:42:57.061
44	ONSEN	ChIJ-0tAIpiOGGARkARnNsXzZW8	2024-12-11 08:42:59.229	2024-12-11 08:42:59.229
45	ONSEN	ChIJkY4i9-aMGGAREeJTfchRKao	2024-12-11 08:49:17.052	2024-12-11 08:49:17.052
46	ONSEN	ChIJKwjZjbfyGGARmI7SBp0mTJg	2024-12-11 08:53:42.553	2024-12-11 08:53:42.553
47	ONSEN	ChIJs5I4DLPyGGARaMmk4rMJUq0	2024-12-11 08:53:44.113	2024-12-11 08:53:44.113
48	ONSEN	ChIJdeaRCw7zGGARh9kNJDQb97c	2024-12-11 08:57:00.552	2024-12-11 08:57:00.552
49	ONSEN	ChIJw7QLesLzGGARWtBBnsJ5LPA	2024-12-11 08:57:37.684	2024-12-11 08:57:37.684
50	SHRINE	ChIJq6rLn6GHGGARQZJJ2HOi78g	2024-12-11 09:02:08.025	2024-12-11 09:02:08.025
51	RESTAURANT	ChIJ90K_-NhFGGARTRGfolU1Hy0	2024-12-11 13:04:09.522	2024-12-11 13:04:09.522
52	SHRINE	ChIJLZDIomWNGGARbohjX63eZbw	2024-12-12 04:52:06.258	2024-12-12 04:52:06.258
53	SHRINE	ChIJG8QTPg-NGGARC0yJgdMd61Q	2024-12-12 04:52:08.488	2024-12-12 04:52:08.488
54	SHRINE	ChIJa9cuxPeNGGARPJFSYg8tHMc	2024-12-12 04:52:10.366	2024-12-12 04:52:10.366
55	SHRINE	ChIJfek7cl-NGGARNtlVf5sUMMU	2024-12-12 04:52:11.846	2024-12-12 04:52:11.846
56	SHRINE	ChIJiVvc68aNGGARC42Rkxw8GlY	2024-12-12 04:52:21.296	2024-12-12 04:52:21.296
57	ONSEN	ChIJ1xsWTmLtGGARbLmhqXaVtDY	2024-12-12 05:04:13.521	2024-12-12 05:04:13.521
58	ONSEN	ChIJD9FcFTLxGGARXB20_5ZCBIY	2024-12-12 11:08:49.025	2024-12-12 11:08:49.025
59	ONSEN	ChIJ0dvy49oGAWARdwj138sJjZk	2024-12-12 11:12:06.48	2024-12-12 11:12:06.48
60	ONSEN	ChIJiXYuFVQHAWARv4ErnOay9FE	2024-12-12 11:12:11.163	2024-12-12 11:12:11.163
61	ONSEN	ChIJP4t0EF0HAWARIbfe4n0m6ZU	2024-12-12 11:12:13.489	2024-12-12 11:12:13.489
62	ONSEN	ChIJ3570ZiuTGGARRfRi0TQ-aDM	2024-12-12 11:14:24.227	2024-12-12 11:14:24.227
63	SHRINE	ChIJq6q63UOMGGAR7zYBKd7iI3I	2024-12-12 11:19:10.42	2024-12-12 11:19:10.42
64	ONSEN	ChIJq00t_DmfH2AREqnXA8PCmes	2024-12-13 02:58:12.463	2024-12-13 02:58:12.463
65	ONSEN	ChIJ__8TvDCfH2ARy5GI_enEve8	2024-12-13 02:58:31.703	2024-12-13 02:58:31.703
66	ONSEN	ChIJTX6GKTGfH2AR09lEdUPQ8sg	2024-12-13 02:58:38.719	2024-12-13 02:58:38.719
67	ONSEN	ChIJAchLvDefH2AR1yHZnHqkMeY	2024-12-13 02:58:41.738	2024-12-13 02:58:41.738
68	ONSEN	ChIJu8WRKc2YH2ARfKxAUgHTX9o	2024-12-16 11:30:51.765	2024-12-16 11:30:51.765
69	SHRINE	ChIJAQCxLRmMGGARwuZGIsWgmAc	2024-12-16 11:34:20.998	2024-12-16 11:34:20.998
70	SHRINE	ChIJpy-QRHuSGGARPiE1TBpn7Ew	2024-12-16 11:39:01.208	2024-12-16 11:39:01.208
71	SHRINE	ChIJXZEkanySGGAREhNuK2MoAOk	2024-12-16 11:39:07.38	2024-12-16 11:39:07.38
72	SHRINE	ChIJAQAMd8GOGGAR945X-Jjf2ug	2024-12-16 11:40:39.017	2024-12-16 11:40:39.017
73	SHRINE	ChIJA8RvD8GOGGARdoKfX1LNAcQ	2024-12-16 11:40:43.013	2024-12-16 11:40:43.013
74	SHRINE	ChIJfYGDFACPGGARhL9IIZ2mpwc	2024-12-16 11:40:45.216	2024-12-16 11:40:45.216
75	ONSEN	ChIJVVVZHpqTGGARYFrfyOEF7ls	2024-12-16 11:50:16.23	2024-12-16 11:50:16.23
76	SHRINE	ChIJZXzuXfeTGGARVL2un_SWRp0	2024-12-18 11:20:20.014	2024-12-18 11:20:20.014
77	SHRINE	ChIJhWDQx2KSGGARaRBR8CfR4CY	2024-12-18 11:20:22.647	2024-12-18 11:20:22.647
78	SHRINE	ChIJAYEiB4yTGGAReRnmmhb_3oc	2024-12-21 11:25:17	2024-12-21 11:25:17
79	ONSEN	ChIJATISkqsHAWARJCBTJcUFJYI	2025-01-15 09:48:22.575	2025-01-15 09:48:22.575
80	ONSEN	ChIJ7fG6ObAIAWARB740mrwDbj8	2025-01-15 09:48:40.738	2025-01-15 09:48:40.738
81	ONSEN	ChIJVSsR2bEIAWARZsSeuqhAc4E	2025-01-15 09:48:43.366	2025-01-15 09:48:43.366
82	ONSEN	ChIJ9YjdGroIAWAR-MhOlVbFUQs	2025-01-15 09:48:45.204	2025-01-15 09:48:45.204
83	SHRINE	ChIJ2XYZP5QIAWARMTCC19cXwjA	2025-01-15 09:50:31.509	2025-01-15 09:50:31.509
84	SHRINE	ChIJB_vchdMIAWARujTEUIZlr2I	2025-01-15 09:50:44.625	2025-01-15 09:50:44.625
85	SHRINE	ChIJTUtCoWAJAWARzuvtKsWrepE	2025-01-15 09:50:47.688	2025-01-15 09:50:47.688
86	SHRINE	ChIJpbc3sdMIAWARfGM3GT_7XJo	2025-01-15 09:50:57.271	2025-01-15 09:50:57.271
87	ONSEN	ChIJ7zk7BO_2GGARQP_MzAhnRsU	2025-01-22 02:53:25.748	2025-01-22 02:53:25.748
88	ONSEN	ChIJG9sk4UpYGGARJeQHxAhjLD0	2025-01-22 02:53:36.048	2025-01-22 02:53:36.048
89	ONSEN	ChIJSXNF4XlbGGARxSMRcLnAEAI	2025-01-22 02:53:38.506	2025-01-22 02:53:38.506
90	ONSEN	ChIJ3dgYaVdPGGARItdl6tjQM6Y	2025-01-22 02:53:40.087	2025-01-22 02:53:40.087
91	ONSEN	ChIJgag02gNQGGARyhJBZ9LPuoY	2025-01-22 02:53:41.489	2025-01-22 02:53:41.489
92	ONSEN	ChIJr9RvPGNZGGARV36XRN8G8vQ	2025-01-22 02:54:28.538	2025-01-22 02:54:28.538
93	ONSEN	ChIJ1WIcfQ5cGGARUUrnxKUxwgY	2025-01-22 02:54:37.631	2025-01-22 02:54:37.631
94	ONSEN	ChIJdwZUhumsGWARWtdo6E9VHEQ	2025-01-22 02:55:23.943	2025-01-22 02:55:23.943
95	SHRINE	ChIJFfmjzV1TGGARr8ZqyeEflC0	2025-01-22 02:56:34.668	2025-01-22 02:56:34.668
96	RESTAURANT	ChIJEaFmc11cGGARpYy-dyux2hc	2025-01-22 02:57:01.292	2025-01-22 02:57:01.292
97	RESTAURANT	ChIJ34-dBfZcGGARwWhxKiwuwEA	2025-01-22 02:57:03.442	2025-01-22 02:57:03.442
\.


--
-- Data for Name: Users_accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."Users_accounts" ("id", "username", "created_at") FROM stdin;
NktMSwswcyRgUrmtZcsLR6uRDju2	brian	2024-12-11 02:07:51.977
FeX0RYW28aa4tz0aHxsowDSUS623	Brian	2024-12-11 02:10:11.39
r0lYz04rx9QslskpLbTLJRq3jWD3	DanielParsonsFake	2024-12-11 02:11:10.456
OquB0j8w2rgokp8fSPhovhyf1Bi2	Andy	2024-12-11 02:19:52.489
xEESMrrVZkWGfzOj2VKB1u7QaDX2	Brian	2024-12-11 02:22:26.125
qOxXUXDwyOTpZxpMO1AkuFUXaQb2	Daniel	2024-12-11 02:23:31.795
nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	Peter	2024-12-11 02:24:57.286
zaMWKHqPZihRJjUF4nAWQrS7fDe2	Aichan	2024-12-11 03:07:38.637
zOMqdBvvhKOoTUF2CaVtXOqG0Lr2	Andy	2024-12-11 04:09:51.311
d19bMa6rfEQS00borVgIEpfH49P2	TouristMan	2024-12-11 05:38:31.517
2xR2s6rSvMeO1bBgMJdhAQ1zN632	Japanlover	2024-12-11 05:39:26.144
Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	TokyoKing	2024-12-11 05:40:22.566
oQI8sTj3cpViJwFsD8sv0tMXtoh2	DanielParsons	2024-12-11 12:14:09.713
fmkwCCii7ve1qpwkU5nyGx5f8Fz2	Kyle	2024-12-12 04:51:48.172
XPQeRQMgDXPadkfpsNa5Wtz0x1s1	sivani	2024-12-12 11:08:05.495
gyammqsYAZROE7nm9XjWhWklYbv1	Musashi117	2024-12-12 11:10:47.576
tNth6gWe0ygkCWA2z9zUbfVHyws1	rdrummond	2024-12-12 22:12:16.184
dRw8f3rRaFTdBNMJcm2ICN3OC013	masaaaan	2024-12-13 02:56:22.062
I0Qtpd41FvTi6zFyafiKmzWalLN2	zaho	2025-01-15 09:47:30.344
XH9ezfPjBnZUsUGzu9J5C11RmRy2	hayakawa	2025-01-22 02:52:53.023
\.


--
-- Data for Name: Votes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."Votes" ("id", "user_id", "place_etiquette_id", "status") FROM stdin;
1	zaMWKHqPZihRJjUF4nAWQrS7fDe2	176	ALLOWED
2	zaMWKHqPZihRJjUF4nAWQrS7fDe2	177	NOT_ALLOWED
3	zaMWKHqPZihRJjUF4nAWQrS7fDe2	178	NOT_ALLOWED
4	zaMWKHqPZihRJjUF4nAWQrS7fDe2	179	ALLOWED
5	zaMWKHqPZihRJjUF4nAWQrS7fDe2	180	NOT_ALLOWED
6	zaMWKHqPZihRJjUF4nAWQrS7fDe2	102	NOT_ALLOWED
7	zaMWKHqPZihRJjUF4nAWQrS7fDe2	103	ALLOWED
8	zaMWKHqPZihRJjUF4nAWQrS7fDe2	104	ALLOWED
9	zaMWKHqPZihRJjUF4nAWQrS7fDe2	105	ALLOWED
10	zaMWKHqPZihRJjUF4nAWQrS7fDe2	106	NOT_ALLOWED
11	zaMWKHqPZihRJjUF4nAWQrS7fDe2	107	ALLOWED
12	zaMWKHqPZihRJjUF4nAWQrS7fDe2	108	ALLOWED
13	zaMWKHqPZihRJjUF4nAWQrS7fDe2	114	ALLOWED
14	zaMWKHqPZihRJjUF4nAWQrS7fDe2	115	ALLOWED
15	zaMWKHqPZihRJjUF4nAWQrS7fDe2	116	ALLOWED
16	zaMWKHqPZihRJjUF4nAWQrS7fDe2	117	NOT_ALLOWED
17	zaMWKHqPZihRJjUF4nAWQrS7fDe2	118	NOT_ALLOWED
18	zaMWKHqPZihRJjUF4nAWQrS7fDe2	114	ALLOWED
19	zaMWKHqPZihRJjUF4nAWQrS7fDe2	115	ALLOWED
20	zaMWKHqPZihRJjUF4nAWQrS7fDe2	116	ALLOWED
21	zaMWKHqPZihRJjUF4nAWQrS7fDe2	117	NOT_ALLOWED
22	zaMWKHqPZihRJjUF4nAWQrS7fDe2	118	NOT_ALLOWED
23	zaMWKHqPZihRJjUF4nAWQrS7fDe2	114	ALLOWED
24	zaMWKHqPZihRJjUF4nAWQrS7fDe2	115	ALLOWED
25	zaMWKHqPZihRJjUF4nAWQrS7fDe2	116	NOT_ALLOWED
26	zaMWKHqPZihRJjUF4nAWQrS7fDe2	117	ALLOWED
27	zaMWKHqPZihRJjUF4nAWQrS7fDe2	118	NOT_ALLOWED
28	zaMWKHqPZihRJjUF4nAWQrS7fDe2	171	ALLOWED
29	zaMWKHqPZihRJjUF4nAWQrS7fDe2	172	ALLOWED
30	zaMWKHqPZihRJjUF4nAWQrS7fDe2	173	NOT_ALLOWED
31	zaMWKHqPZihRJjUF4nAWQrS7fDe2	174	ALLOWED
32	zaMWKHqPZihRJjUF4nAWQrS7fDe2	175	NOT_ALLOWED
33	zaMWKHqPZihRJjUF4nAWQrS7fDe2	119	ALLOWED
34	zaMWKHqPZihRJjUF4nAWQrS7fDe2	120	NOT_ALLOWED
35	zaMWKHqPZihRJjUF4nAWQrS7fDe2	121	NOT_ALLOWED
36	zaMWKHqPZihRJjUF4nAWQrS7fDe2	122	NOT_ALLOWED
37	zaMWKHqPZihRJjUF4nAWQrS7fDe2	123	NOT_ALLOWED
38	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	50	ALLOWED
39	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	51	ALLOWED
40	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	52	NOT_ALLOWED
41	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	53	ALLOWED
42	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	54	NOT_ALLOWED
43	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	55	NOT_ALLOWED
44	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	56	NOT_ALLOWED
45	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	64	NOT_ALLOWED
46	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	65	ALLOWED
47	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	66	NOT_ALLOWED
48	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	67	NOT_ALLOWED
49	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	68	NOT_ALLOWED
50	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	69	ALLOWED
51	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	70	ALLOWED
52	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	78	ALLOWED
53	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	79	ALLOWED
54	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	80	NOT_ALLOWED
55	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	81	ALLOWED
56	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	82	ALLOWED
57	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	83	NOT_ALLOWED
58	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	84	NOT_ALLOWED
59	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	85	ALLOWED
60	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	86	ALLOWED
61	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	87	ALLOWED
62	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	88	NOT_ALLOWED
63	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	89	NOT_ALLOWED
64	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	90	ALLOWED
65	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	91	ALLOWED
66	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	92	NOT_ALLOWED
67	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	93	ALLOWED
68	nSqtnG2p0VVUnPoWcfiLBMvQ9yo2	94	NOT_ALLOWED
69	zaMWKHqPZihRJjUF4nAWQrS7fDe2	50	ALLOWED
70	zaMWKHqPZihRJjUF4nAWQrS7fDe2	51	ALLOWED
71	zaMWKHqPZihRJjUF4nAWQrS7fDe2	52	NOT_ALLOWED
72	zaMWKHqPZihRJjUF4nAWQrS7fDe2	53	ALLOWED
73	zaMWKHqPZihRJjUF4nAWQrS7fDe2	54	ALLOWED
74	zaMWKHqPZihRJjUF4nAWQrS7fDe2	55	ALLOWED
75	zaMWKHqPZihRJjUF4nAWQrS7fDe2	56	ALLOWED
76	zaMWKHqPZihRJjUF4nAWQrS7fDe2	50	ALLOWED
77	zaMWKHqPZihRJjUF4nAWQrS7fDe2	51	ALLOWED
78	zaMWKHqPZihRJjUF4nAWQrS7fDe2	52	NOT_ALLOWED
79	zaMWKHqPZihRJjUF4nAWQrS7fDe2	53	NOT_ALLOWED
80	zaMWKHqPZihRJjUF4nAWQrS7fDe2	54	NOT_ALLOWED
81	zaMWKHqPZihRJjUF4nAWQrS7fDe2	55	ALLOWED
82	zaMWKHqPZihRJjUF4nAWQrS7fDe2	56	NOT_ALLOWED
83	zaMWKHqPZihRJjUF4nAWQrS7fDe2	85	ALLOWED
84	zaMWKHqPZihRJjUF4nAWQrS7fDe2	86	ALLOWED
85	zaMWKHqPZihRJjUF4nAWQrS7fDe2	87	ALLOWED
86	zaMWKHqPZihRJjUF4nAWQrS7fDe2	88	NOT_ALLOWED
87	zaMWKHqPZihRJjUF4nAWQrS7fDe2	89	ALLOWED
88	zaMWKHqPZihRJjUF4nAWQrS7fDe2	90	ALLOWED
89	zaMWKHqPZihRJjUF4nAWQrS7fDe2	91	ALLOWED
90	zaMWKHqPZihRJjUF4nAWQrS7fDe2	92	NOT_ALLOWED
91	zaMWKHqPZihRJjUF4nAWQrS7fDe2	93	ALLOWED
92	zaMWKHqPZihRJjUF4nAWQrS7fDe2	94	NOT_ALLOWED
93	OquB0j8w2rgokp8fSPhovhyf1Bi2	50	ALLOWED
94	OquB0j8w2rgokp8fSPhovhyf1Bi2	51	NOT_ALLOWED
95	OquB0j8w2rgokp8fSPhovhyf1Bi2	52	NOT_ALLOWED
96	OquB0j8w2rgokp8fSPhovhyf1Bi2	53	ALLOWED
97	OquB0j8w2rgokp8fSPhovhyf1Bi2	54	NOT_ALLOWED
98	OquB0j8w2rgokp8fSPhovhyf1Bi2	55	NOT_ALLOWED
99	OquB0j8w2rgokp8fSPhovhyf1Bi2	56	NOT_ALLOWED
100	OquB0j8w2rgokp8fSPhovhyf1Bi2	85	ALLOWED
101	OquB0j8w2rgokp8fSPhovhyf1Bi2	86	ALLOWED
102	OquB0j8w2rgokp8fSPhovhyf1Bi2	87	ALLOWED
103	OquB0j8w2rgokp8fSPhovhyf1Bi2	88	ALLOWED
104	OquB0j8w2rgokp8fSPhovhyf1Bi2	89	ALLOWED
107	OquB0j8w2rgokp8fSPhovhyf1Bi2	92	NOT_ALLOWED
106	OquB0j8w2rgokp8fSPhovhyf1Bi2	91	ALLOWED
105	OquB0j8w2rgokp8fSPhovhyf1Bi2	90	NOT_ALLOWED
109	OquB0j8w2rgokp8fSPhovhyf1Bi2	94	NOT_ALLOWED
108	OquB0j8w2rgokp8fSPhovhyf1Bi2	93	ALLOWED
117	xEESMrrVZkWGfzOj2VKB1u7QaDX2	85	ALLOWED
118	xEESMrrVZkWGfzOj2VKB1u7QaDX2	86	ALLOWED
119	xEESMrrVZkWGfzOj2VKB1u7QaDX2	87	NOT_ALLOWED
120	xEESMrrVZkWGfzOj2VKB1u7QaDX2	88	ALLOWED
121	xEESMrrVZkWGfzOj2VKB1u7QaDX2	89	ALLOWED
122	xEESMrrVZkWGfzOj2VKB1u7QaDX2	90	NOT_ALLOWED
123	xEESMrrVZkWGfzOj2VKB1u7QaDX2	91	NOT_ALLOWED
124	xEESMrrVZkWGfzOj2VKB1u7QaDX2	92	NOT_ALLOWED
125	xEESMrrVZkWGfzOj2VKB1u7QaDX2	93	NOT_ALLOWED
126	xEESMrrVZkWGfzOj2VKB1u7QaDX2	94	NOT_ALLOWED
127	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	50	NOT_ALLOWED
128	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	51	ALLOWED
129	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	52	NOT_ALLOWED
130	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	53	NOT_ALLOWED
131	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	54	ALLOWED
132	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	55	ALLOWED
133	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	56	ALLOWED
134	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	85	NOT_ALLOWED
135	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	86	ALLOWED
136	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	87	ALLOWED
137	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	88	NOT_ALLOWED
138	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	89	ALLOWED
139	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	90	ALLOWED
140	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	91	ALLOWED
141	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	92	NOT_ALLOWED
142	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	93	ALLOWED
143	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	94	NOT_ALLOWED
144	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	205	ALLOWED
145	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	206	NOT_ALLOWED
146	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	207	ALLOWED
147	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	208	NOT_ALLOWED
148	qOxXUXDwyOTpZxpMO1AkuFUXaQb2	209	NOT_ALLOWED
110	xEESMrrVZkWGfzOj2VKB1u7QaDX2	50	NOT_ALLOWED
114	xEESMrrVZkWGfzOj2VKB1u7QaDX2	54	NOT_ALLOWED
111	xEESMrrVZkWGfzOj2VKB1u7QaDX2	51	ALLOWED
113	xEESMrrVZkWGfzOj2VKB1u7QaDX2	53	NOT_ALLOWED
112	xEESMrrVZkWGfzOj2VKB1u7QaDX2	52	NOT_ALLOWED
115	xEESMrrVZkWGfzOj2VKB1u7QaDX2	55	NOT_ALLOWED
116	xEESMrrVZkWGfzOj2VKB1u7QaDX2	56	ALLOWED
149	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	50	NOT_ALLOWED
150	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	51	ALLOWED
151	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	52	ALLOWED
152	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	53	ALLOWED
153	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	54	NOT_ALLOWED
154	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	55	ALLOWED
155	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	56	ALLOWED
156	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	85	ALLOWED
157	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	86	NOT_ALLOWED
158	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	87	ALLOWED
159	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	88	NOT_ALLOWED
160	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	89	NOT_ALLOWED
161	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	90	ALLOWED
162	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	91	ALLOWED
163	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	92	NOT_ALLOWED
164	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	93	ALLOWED
165	Xr9sBVGjZFdsYZf6eSO4SdMQ7u13	94	NOT_ALLOWED
183	d19bMa6rfEQS00borVgIEpfH49P2	90	ALLOWED
184	d19bMa6rfEQS00borVgIEpfH49P2	91	ALLOWED
185	d19bMa6rfEQS00borVgIEpfH49P2	92	NOT_ALLOWED
186	d19bMa6rfEQS00borVgIEpfH49P2	93	ALLOWED
187	d19bMa6rfEQS00borVgIEpfH49P2	94	NOT_ALLOWED
188	2xR2s6rSvMeO1bBgMJdhAQ1zN632	50	ALLOWED
189	2xR2s6rSvMeO1bBgMJdhAQ1zN632	51	ALLOWED
174	d19bMa6rfEQS00borVgIEpfH49P2	53	ALLOWED
171	d19bMa6rfEQS00borVgIEpfH49P2	50	ALLOWED
176	d19bMa6rfEQS00borVgIEpfH49P2	55	ALLOWED
175	d19bMa6rfEQS00borVgIEpfH49P2	54	NOT_ALLOWED
172	d19bMa6rfEQS00borVgIEpfH49P2	51	ALLOWED
173	d19bMa6rfEQS00borVgIEpfH49P2	52	ALLOWED
177	d19bMa6rfEQS00borVgIEpfH49P2	56	ALLOWED
178	d19bMa6rfEQS00borVgIEpfH49P2	85	ALLOWED
179	d19bMa6rfEQS00borVgIEpfH49P2	86	ALLOWED
180	d19bMa6rfEQS00borVgIEpfH49P2	87	ALLOWED
181	d19bMa6rfEQS00borVgIEpfH49P2	88	NOT_ALLOWED
182	d19bMa6rfEQS00borVgIEpfH49P2	89	NOT_ALLOWED
190	2xR2s6rSvMeO1bBgMJdhAQ1zN632	52	NOT_ALLOWED
191	2xR2s6rSvMeO1bBgMJdhAQ1zN632	53	ALLOWED
192	2xR2s6rSvMeO1bBgMJdhAQ1zN632	54	NOT_ALLOWED
193	2xR2s6rSvMeO1bBgMJdhAQ1zN632	55	ALLOWED
194	2xR2s6rSvMeO1bBgMJdhAQ1zN632	56	ALLOWED
195	2xR2s6rSvMeO1bBgMJdhAQ1zN632	85	ALLOWED
196	2xR2s6rSvMeO1bBgMJdhAQ1zN632	86	ALLOWED
197	2xR2s6rSvMeO1bBgMJdhAQ1zN632	87	ALLOWED
198	2xR2s6rSvMeO1bBgMJdhAQ1zN632	88	NOT_ALLOWED
199	2xR2s6rSvMeO1bBgMJdhAQ1zN632	89	NOT_ALLOWED
200	2xR2s6rSvMeO1bBgMJdhAQ1zN632	90	ALLOWED
201	2xR2s6rSvMeO1bBgMJdhAQ1zN632	91	ALLOWED
202	2xR2s6rSvMeO1bBgMJdhAQ1zN632	92	NOT_ALLOWED
203	2xR2s6rSvMeO1bBgMJdhAQ1zN632	93	ALLOWED
204	2xR2s6rSvMeO1bBgMJdhAQ1zN632	94	NOT_ALLOWED
167	zOMqdBvvhKOoTUF2CaVtXOqG0Lr2	86	ALLOWED
205	NktMSwswcyRgUrmtZcsLR6uRDju2	238	NEUTRAL
206	NktMSwswcyRgUrmtZcsLR6uRDju2	239	NEUTRAL
207	NktMSwswcyRgUrmtZcsLR6uRDju2	240	NEUTRAL
208	NktMSwswcyRgUrmtZcsLR6uRDju2	241	ALLOWED
166	zOMqdBvvhKOoTUF2CaVtXOqG0Lr2	85	ALLOWED
168	zOMqdBvvhKOoTUF2CaVtXOqG0Lr2	87	ALLOWED
170	zOMqdBvvhKOoTUF2CaVtXOqG0Lr2	89	NOT_ALLOWED
169	zOMqdBvvhKOoTUF2CaVtXOqG0Lr2	88	NOT_ALLOWED
209	NktMSwswcyRgUrmtZcsLR6uRDju2	242	NEUTRAL
210	NktMSwswcyRgUrmtZcsLR6uRDju2	243	NEUTRAL
211	NktMSwswcyRgUrmtZcsLR6uRDju2	244	NEUTRAL
212	NktMSwswcyRgUrmtZcsLR6uRDju2	224	NEUTRAL
213	NktMSwswcyRgUrmtZcsLR6uRDju2	225	NEUTRAL
214	NktMSwswcyRgUrmtZcsLR6uRDju2	226	NEUTRAL
215	NktMSwswcyRgUrmtZcsLR6uRDju2	227	ALLOWED
216	NktMSwswcyRgUrmtZcsLR6uRDju2	228	NEUTRAL
217	NktMSwswcyRgUrmtZcsLR6uRDju2	229	NEUTRAL
218	NktMSwswcyRgUrmtZcsLR6uRDju2	230	NEUTRAL
219	NktMSwswcyRgUrmtZcsLR6uRDju2	224	NEUTRAL
220	NktMSwswcyRgUrmtZcsLR6uRDju2	225	NEUTRAL
221	NktMSwswcyRgUrmtZcsLR6uRDju2	226	NEUTRAL
222	NktMSwswcyRgUrmtZcsLR6uRDju2	227	NEUTRAL
223	NktMSwswcyRgUrmtZcsLR6uRDju2	228	NEUTRAL
224	NktMSwswcyRgUrmtZcsLR6uRDju2	229	ALLOWED
225	NktMSwswcyRgUrmtZcsLR6uRDju2	230	NEUTRAL
226	NktMSwswcyRgUrmtZcsLR6uRDju2	85	NEUTRAL
227	NktMSwswcyRgUrmtZcsLR6uRDju2	86	NEUTRAL
228	NktMSwswcyRgUrmtZcsLR6uRDju2	87	ALLOWED
229	NktMSwswcyRgUrmtZcsLR6uRDju2	88	NEUTRAL
230	NktMSwswcyRgUrmtZcsLR6uRDju2	89	NEUTRAL
231	oQI8sTj3cpViJwFsD8sv0tMXtoh2	259	ALLOWED
232	oQI8sTj3cpViJwFsD8sv0tMXtoh2	260	NOT_ALLOWED
233	oQI8sTj3cpViJwFsD8sv0tMXtoh2	261	NEUTRAL
234	oQI8sTj3cpViJwFsD8sv0tMXtoh2	262	NEUTRAL
235	oQI8sTj3cpViJwFsD8sv0tMXtoh2	263	NEUTRAL
236	oQI8sTj3cpViJwFsD8sv0tMXtoh2	264	NEUTRAL
237	oQI8sTj3cpViJwFsD8sv0tMXtoh2	265	NEUTRAL
238	fmkwCCii7ve1qpwkU5nyGx5f8Fz2	337	ALLOWED
239	fmkwCCii7ve1qpwkU5nyGx5f8Fz2	338	ALLOWED
240	fmkwCCii7ve1qpwkU5nyGx5f8Fz2	339	ALLOWED
241	fmkwCCii7ve1qpwkU5nyGx5f8Fz2	340	NOT_ALLOWED
242	fmkwCCii7ve1qpwkU5nyGx5f8Fz2	341	NOT_ALLOWED
243	fmkwCCii7ve1qpwkU5nyGx5f8Fz2	399	ALLOWED
244	fmkwCCii7ve1qpwkU5nyGx5f8Fz2	400	ALLOWED
245	fmkwCCii7ve1qpwkU5nyGx5f8Fz2	401	NOT_ALLOWED
246	fmkwCCii7ve1qpwkU5nyGx5f8Fz2	402	NOT_ALLOWED
247	fmkwCCii7ve1qpwkU5nyGx5f8Fz2	403	NOT_ALLOWED
248	XH9ezfPjBnZUsUGzu9J5C11RmRy2	546	NOT_ALLOWED
249	XH9ezfPjBnZUsUGzu9J5C11RmRy2	547	NEUTRAL
250	XH9ezfPjBnZUsUGzu9J5C11RmRy2	548	NEUTRAL
251	XH9ezfPjBnZUsUGzu9J5C11RmRy2	549	NEUTRAL
252	XH9ezfPjBnZUsUGzu9J5C11RmRy2	550	NEUTRAL
253	XH9ezfPjBnZUsUGzu9J5C11RmRy2	551	NEUTRAL
254	XH9ezfPjBnZUsUGzu9J5C11RmRy2	552	NEUTRAL
255	XH9ezfPjBnZUsUGzu9J5C11RmRy2	546	NOT_ALLOWED
256	XH9ezfPjBnZUsUGzu9J5C11RmRy2	547	NEUTRAL
257	XH9ezfPjBnZUsUGzu9J5C11RmRy2	548	NEUTRAL
258	XH9ezfPjBnZUsUGzu9J5C11RmRy2	549	NEUTRAL
259	XH9ezfPjBnZUsUGzu9J5C11RmRy2	550	NEUTRAL
260	XH9ezfPjBnZUsUGzu9J5C11RmRy2	551	NEUTRAL
261	XH9ezfPjBnZUsUGzu9J5C11RmRy2	552	NEUTRAL
262	XH9ezfPjBnZUsUGzu9J5C11RmRy2	605	ALLOWED
263	XH9ezfPjBnZUsUGzu9J5C11RmRy2	606	ALLOWED
264	XH9ezfPjBnZUsUGzu9J5C11RmRy2	607	NOT_ALLOWED
265	XH9ezfPjBnZUsUGzu9J5C11RmRy2	608	NEUTRAL
266	XH9ezfPjBnZUsUGzu9J5C11RmRy2	609	NEUTRAL
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count") FROM stdin;
5fa2df04-749a-444f-972d-f2af7ce58348	e6538e6a1eb85fd698109b63d4387329e560e1ae462351b835dc1a3d7d881fd2	2024-12-11 01:49:06.275166+00	20241127023640_schema_version1	\N	\N	2024-12-11 01:49:06.041531+00	1
9ac16885-ff78-4ea4-a96c-b2ebcc66971f	83c271b14be481b7d53b56f380451bfa2f1232e9312087f99d3eb9ce07b36b90	2024-12-11 01:49:06.341046+00	20241128073957_vote_table_inserted	\N	\N	2024-12-11 01:49:06.284851+00	1
9cfffda7-cfe3-4629-9db0-4d46144f8e41	b111bd2671097efb58112cf79d3ce3458f5e0012012bd4b263e4bc7a1dcbc6dc	2024-12-11 01:49:06.541644+00	20241130003731_update_schema_v2	\N	\N	2024-12-11 01:49:06.34471+00	1
\.


--
-- Name: Etiquette_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."Etiquette_id_seq"', 17, true);


--
-- Name: Etiquette_per_experiences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."Etiquette_per_experiences_id_seq"', 67, true);


--
-- Name: Experiences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."Experiences_id_seq"', 55, true);


--
-- Name: Helpfullness_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."Helpfullness_id_seq"', 97, true);


--
-- Name: Place_etiquettes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."Place_etiquettes_id_seq"', 609, true);


--
-- Name: Places_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."Places_id_seq"', 97, true);


--
-- Name: Votes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."Votes_id_seq"', 266, true);


--
-- Name: Etiquette_per_experiences Etiquette_per_experiences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Etiquette_per_experiences"
    ADD CONSTRAINT "Etiquette_per_experiences_pkey" PRIMARY KEY ("id");


--
-- Name: Etiquette Etiquette_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Etiquette"
    ADD CONSTRAINT "Etiquette_pkey" PRIMARY KEY ("id");


--
-- Name: Experiences Experiences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Experiences"
    ADD CONSTRAINT "Experiences_pkey" PRIMARY KEY ("id");


--
-- Name: Helpfullness Helpfullness_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Helpfullness"
    ADD CONSTRAINT "Helpfullness_pkey" PRIMARY KEY ("id");


--
-- Name: Place_etiquettes Place_etiquettes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Place_etiquettes"
    ADD CONSTRAINT "Place_etiquettes_pkey" PRIMARY KEY ("id");


--
-- Name: Places Places_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Places"
    ADD CONSTRAINT "Places_pkey" PRIMARY KEY ("id");


--
-- Name: Users_accounts Users_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Users_accounts"
    ADD CONSTRAINT "Users_accounts_pkey" PRIMARY KEY ("id");


--
-- Name: Votes Votes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Votes"
    ADD CONSTRAINT "Votes_pkey" PRIMARY KEY ("id");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."_prisma_migrations"
    ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");


--
-- Name: Places_google_place_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Places_google_place_id_key" ON "public"."Places" USING "btree" ("google_place_id");


--
-- Name: Etiquette_per_experiences Etiquette_per_experiences_experience_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Etiquette_per_experiences"
    ADD CONSTRAINT "Etiquette_per_experiences_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "public"."Experiences"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Etiquette_per_experiences Etiquette_per_experiences_place_etiquette_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Etiquette_per_experiences"
    ADD CONSTRAINT "Etiquette_per_experiences_place_etiquette_id_fkey" FOREIGN KEY ("place_etiquette_id") REFERENCES "public"."Place_etiquettes"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Experiences Experiences_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Experiences"
    ADD CONSTRAINT "Experiences_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "public"."Places"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Experiences Experiences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Experiences"
    ADD CONSTRAINT "Experiences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users_accounts"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Helpfullness Helpfullness_experience_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Helpfullness"
    ADD CONSTRAINT "Helpfullness_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "public"."Experiences"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Helpfullness Helpfullness_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Helpfullness"
    ADD CONSTRAINT "Helpfullness_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users_accounts"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Place_etiquettes Place_etiquettes_etiquette_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Place_etiquettes"
    ADD CONSTRAINT "Place_etiquettes_etiquette_id_fkey" FOREIGN KEY ("etiquette_id") REFERENCES "public"."Etiquette"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Place_etiquettes Place_etiquettes_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Place_etiquettes"
    ADD CONSTRAINT "Place_etiquettes_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "public"."Places"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Votes Votes_place_etiquette_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Votes"
    ADD CONSTRAINT "Votes_place_etiquette_id_fkey" FOREIGN KEY ("place_etiquette_id") REFERENCES "public"."Place_etiquettes"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Votes Votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Votes"
    ADD CONSTRAINT "Votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users_accounts"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

--
-- Database "temp" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6 (Debian 16.6-1.pgdg120+1)
-- Dumped by pg_dump version 16.6 (Debian 16.6-1.pgdg120+1)

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
-- Name: temp; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE "temp" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF8';


\connect "temp"

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
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

