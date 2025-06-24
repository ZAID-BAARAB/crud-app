--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

-- Started on 2025-06-24 15:08:25

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 26360)
-- Name: _user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._user (
    id integer NOT NULL,
    email character varying(255),
    firstname character varying(255),
    lastname character varying(255),
    password character varying(255),
    role character varying(255),
    CONSTRAINT _user_role_check CHECK (((role)::text = ANY ((ARRAY['USER'::character varying, 'ADMIN'::character varying, 'MANAGER'::character varying])::text[])))
);


ALTER TABLE public._user OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 26343)
-- Name: _user_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public._user_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._user_seq OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 26344)
-- Name: book_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.book_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.book_seq OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 26369)
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id bigint NOT NULL,
    description character varying(255),
    name character varying(255),
    photo_url character varying(255),
    price double precision NOT NULL,
    stock_quantity real
);


ALTER TABLE public.product OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 26368)
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_id_seq OWNER TO postgres;

--
-- TOC entry 4821 (class 0 OID 0)
-- Dependencies: 221
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;


--
-- TOC entry 223 (class 1259 OID 26377)
-- Name: token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.token (
    id integer NOT NULL,
    expired boolean NOT NULL,
    revoked boolean NOT NULL,
    token character varying(255),
    token_type character varying(255),
    user_id integer,
    CONSTRAINT token_token_type_check CHECK (((token_type)::text = 'BEARER'::text))
);


ALTER TABLE public.token OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 26345)
-- Name: token_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.token_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.token_seq OWNER TO postgres;

--
-- TOC entry 4652 (class 2604 OID 26372)
-- Name: product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);


--
-- TOC entry 4812 (class 0 OID 26360)
-- Dependencies: 220
-- Data for Name: _user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._user (id, email, firstname, lastname, password, role) FROM stdin;
102	zaidadmin@mail.com	Admin	Admin	$2a$10$QnUyVAbNPN9NVp2wcUOKH.bkHWmagySRDMTtf7admv3a5bXI5Tq4q	ADMIN
103	client@mail.com	Client	Client	$2a$10$bEEj.2eS3cMQ2VnpIgi6JeMZBm40.RpXlojLfyrk/1eQ6dkh3PcNC	USER
202	baarabzaid42@gmail.com	Zaid baarab	\N	\N	USER
252	zaid@mail.com	test	name	$2a$10$ghsjYFCYiOQxLgkBA3QwQeoFDSNXvXNTcoGwY9jEuMr5RxRGnBNKO	USER
253	superclient@mail.com	client	User	$2a$10$TqirU1E3Kq6NaJGBOh.jF.V2Vk8E/0uBB.bRAUA3ctzSwMF9.3e/O	USER
302	doe@mail.com	John 	Doe	$2a$10$x72GSfPc0CKbkIDulRoT2uCv8lGxv38k/jIkG9z935TwItvim3oW6	USER
303	testuser@mail.com	yser	user	$2a$10$1n1VKLIYYRIYXhHe.FLzg.j9Lsx1MqcjdfvaUIk8qRihL7p2vVo0G	USER
\.


--
-- TOC entry 4814 (class 0 OID 26369)
-- Dependencies: 222
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (id, description, name, photo_url, price, stock_quantity) FROM stdin;
5	desc	Camera Full HD	https://res.cloudinary.com/dsgnuek6y/image/upload/v1750617794/hahnTestProductPhotos/1750617792562_camera%20full.jpg.jpg	7646	45
4	Description of a camera This is a good one	Canon Camera	https://res.cloudinary.com/dsgnuek6y/image/upload/v1750589540/hahnTestProductPhotos/1750589539255_camerra.jpg.jpg	288	66
3	Desc	Ear Podes	https://res.cloudinary.com/dsgnuek6y/image/upload/v1750773330/productPhotos/1750773328617_earPodes.jpg.jpg	233	33
2	high quality bag	Women Bag	https://res.cloudinary.com/dsgnuek6y/image/upload/v1750773525/productPhotos/1750773524466_bag.jpg.jpg	500	3
\.


--
-- TOC entry 4815 (class 0 OID 26377)
-- Dependencies: 223
-- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.token (id, expired, revoked, token, token_type, user_id) FROM stdin;
\.


--
-- TOC entry 4822 (class 0 OID 0)
-- Dependencies: 217
-- Name: _user_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public._user_seq', 351, true);


--
-- TOC entry 4823 (class 0 OID 0)
-- Dependencies: 218
-- Name: book_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.book_seq', 1, false);


--
-- TOC entry 4824 (class 0 OID 0)
-- Dependencies: 221
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_id_seq', 5, true);


--
-- TOC entry 4825 (class 0 OID 0)
-- Dependencies: 219
-- Name: token_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.token_seq', 801, true);


--
-- TOC entry 4656 (class 2606 OID 26367)
-- Name: _user _user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._user
    ADD CONSTRAINT _user_pkey PRIMARY KEY (id);


--
-- TOC entry 4658 (class 2606 OID 26376)
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- TOC entry 4660 (class 2606 OID 26384)
-- Name: token token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- TOC entry 4662 (class 2606 OID 26386)
-- Name: token uk_pddrhgwxnms2aceeku9s2ewy5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT uk_pddrhgwxnms2aceeku9s2ewy5 UNIQUE (token);


--
-- TOC entry 4663 (class 2606 OID 26387)
-- Name: token fkiblu4cjwvyntq3ugo31klp1c6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT fkiblu4cjwvyntq3ugo31klp1c6 FOREIGN KEY (user_id) REFERENCES public._user(id);


-- Completed on 2025-06-24 15:08:25

--
-- PostgreSQL database dump complete
--

