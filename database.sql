CREATE DATABASE prochain ENCODING = 'UTF8' LOCALE = 'en_US.UTF-8';
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    content text NOT NULL,
    content_hash character(64),
    edited boolean DEFAULT false NOT NULL,
    time_posted timestamp without time zone
);

--
-- TOC entry 217 (class 1259 OID 16507)
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: nathansoh
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- TOC entry 3638 (class 0 OID 0)
-- Dependencies: 217
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nathansoh
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;

--
-- TOC entry 214 (class 1259 OID 16481)
-- Name: education; Type: TABLE; Schema: public; Owner: nathansoh
--

CREATE TABLE public.education (
    school_name character varying(50) NOT NULL,
    "start" date NOT NULL,
    "end" date,
    type character varying(50) NOT NULL,
    about text,
    id integer NOT NULL,
    verifiable boolean,
    user_address character varying(255) NOT NULL,
    field character varying(100)
);

--
-- TOC entry 221 (class 1259 OID 19884)
-- Name: education_id_seq; Type: SEQUENCE; Schema: public; Owner: nathansoh
--

CREATE SEQUENCE public.education_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- TOC entry 3639 (class 0 OID 0)
-- Dependencies: 221
-- Name: education_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nathansoh
--

ALTER SEQUENCE public.education_id_seq OWNED BY public.education.id;


--
-- TOC entry 213 (class 1259 OID 16464)
-- Name: experiences; Type: TABLE; Schema: public; Owner: nathansoh
--

CREATE TABLE public.experiences (
    "start" date NOT NULL,
    "end" date,
    title character varying(50) NOT NULL,
    about text,
    id integer NOT NULL,
    content_hash character(64),
    type character varying(50) NOT NULL,
    company_name character varying(100)
);


ALTER TABLE public.experiences OWNER TO nathansoh;

--
-- TOC entry 222 (class 1259 OID 19899)
-- Name: experiences_id_seq; Type: SEQUENCE; Schema: public; Owner: nathansoh
--

CREATE SEQUENCE public.experiences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- TOC entry 3640 (class 0 OID 0)
-- Dependencies: 222
-- Name: experiences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nathansoh
--

ALTER SEQUENCE public.experiences_id_seq OWNED BY public.experiences.id;

--
-- TOC entry 219 (class 1259 OID 19868)
-- Name: jobs; Type: TABLE; Schema: public; Owner: nathansoh
--

CREATE TABLE public.jobs (
    job_title character varying(75) NOT NULL,
    location character varying(75) NOT NULL,
    time_posted timestamp without time zone,
    employment_type character varying(20),
    job_level character varying(50),
    content_hash character(64),
    id integer NOT NULL,
    job_description text NOT NULL
);

--
-- TOC entry 220 (class 1259 OID 19871)
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: nathansoh
--

CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- TOC entry 3641 (class 0 OID 0)
-- Dependencies: 220
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nathansoh
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;

--
-- TOC entry 212 (class 1259 OID 16452)
-- Name: organisations; Type: TABLE; Schema: public; Owner: nathansoh
--

CREATE TABLE public.organisations (
    id integer NOT NULL,
    company_name character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    wallet_address character varying(255) NOT NULL,
    bio text,
    location character varying(75),
    industry character varying(50) NOT NULL,
    content_hash character(64)
);

--
-- TOC entry 211 (class 1259 OID 16451)
-- Name: organisations_id_seq; Type: SEQUENCE; Schema: public; Owner: nathansoh
--

CREATE SEQUENCE public.organisations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- TOC entry 3642 (class 0 OID 0)
-- Dependencies: 211
-- Name: organisations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nathansoh
--

ALTER SEQUENCE public.organisations_id_seq OWNED BY public.organisations.id;


--
-- TOC entry 216 (class 1259 OID 16499)
-- Name: posts; Type: TABLE; Schema: public; Owner: nathansoh
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    content text NOT NULL,
    time_posted timestamp without time zone,
    content_hash character(64),
    edited boolean DEFAULT false NOT NULL
);

--
-- TOC entry 215 (class 1259 OID 16498)
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: nathansoh
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- TOC entry 3643 (class 0 OID 0)
-- Dependencies: 215
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nathansoh
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- TOC entry 210 (class 1259 OID 16439)
-- Name: users; Type: TABLE; Schema: public; Owner: nathansoh
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    pronouns character varying(20),
    email character varying(255) NOT NULL,
    wallet_address character varying(255) NOT NULL,
    bio text,
    location character varying(75),
    content_hash character(64),
    about text
);

--
-- TOC entry 209 (class 1259 OID 16438)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: nathansoh
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- TOC entry 3644 (class 0 OID 0)
-- Dependencies: 209
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nathansoh
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3467 (class 2604 OID 16511)
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: nathansoh
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- TOC entry 3464 (class 2604 OID 19885)
-- Name: education id; Type: DEFAULT; Schema: public; Owner: nathansoh
--

ALTER TABLE ONLY public.education ALTER COLUMN id SET DEFAULT nextval('public.education_id_seq'::regclass);


--
-- TOC entry 3463 (class 2604 OID 19900)
-- Name: experiences id; Type: DEFAULT; Schema: public; Owner: nathansoh
--

ALTER TABLE ONLY public.experiences ALTER COLUMN id SET DEFAULT nextval('public.experiences_id_seq'::regclass);


--
-- TOC entry 3469 (class 2604 OID 19872)
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: nathansoh
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- TOC entry 3462 (class 2604 OID 16455)
-- Name: organisations id; Type: DEFAULT; Schema: public; Owner: nathansoh
--

ALTER TABLE ONLY public.organisations ALTER COLUMN id SET DEFAULT nextval('public.organisations_id_seq'::regclass);


--
-- TOC entry 3465 (class 2604 OID 16502)
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: nathansoh
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- TOC entry 3461 (class 2604 OID 16442)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: nathansoh
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3489 (class 2606 OID 16515)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: nathansoh
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 3485 (class 2606 OID 19887)
-- Name: education education_pkey; Type: CONSTRAINT; Schema: public; Owner: nathansoh
--

ALTER TABLE ONLY public.education
    ADD CONSTRAINT education_pkey PRIMARY KEY (id);


--
-- TOC entry 3483 (class 2606 OID 19902)
-- Name: experiences experiences_pkey; Type: CONSTRAINT; Schema: public; Owner: nathansoh
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_pkey PRIMARY KEY (id);


--
-- TOC entry 3491 (class 2606 OID 19874)
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: nathansoh
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- TOC entry 3477 (class 2606 OID 16461)
-- Name: organisations organisations_email_key; Type: CONSTRAINT; Schema: public; Owner: nathansoh
--

ALTER TABLE ONLY public.organisations
    ADD CONSTRAINT organisations_email_key UNIQUE (email);


--
-- TOC entry 3479 (class 2606 OID 16459)
-- Name: organisations organisations_pkey; Type: CONSTRAINT; Schema: public; Owner: nathansoh
--

ALTER TABLE ONLY public.organisations
    ADD CONSTRAINT organisations_pkey PRIMARY KEY (id);


--
-- TOC entry 3481 (class 2606 OID 16463)
-- Name: organisations organisations_wallet_address_key; Type: CONSTRAINT; Schema: public; Owner: nathansoh
--

ALTER TABLE ONLY public.organisations
    ADD CONSTRAINT organisations_wallet_address_key UNIQUE (wallet_address);


--
-- TOC entry 3487 (class 2606 OID 16506)
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: nathansoh
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- TOC entry 3471 (class 2606 OID 16448)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: nathansoh
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3473 (class 2606 OID 16446)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: nathansoh
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3475 (class 2606 OID 16450)
-- Name: users users_wallet_address_key; Type: CONSTRAINT; Schema: public; Owner: nathansoh
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_wallet_address_key UNIQUE (wallet_address);


--
-- TOC entry 3492 (class 2606 OID 19894)
-- Name: education education_user_address_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nathansoh
--

ALTER TABLE ONLY public.education
    ADD CONSTRAINT education_user_address_fkey FOREIGN KEY (user_address) REFERENCES public.users(wallet_address);


-- Completed on 2024-03-21 12:32:55 +08

--
-- PostgreSQL database dump complete
--

-- Completed on 2024-03-21 12:32:56 +08

--
-- PostgreSQL database cluster dump complete
--

