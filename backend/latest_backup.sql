--
-- PostgreSQL database dump
--

\restrict W80pNBttWNHBdmW9ZbqaOqSYI7zW9pMvrW2DYJwbv5Qcu7aVDBqDWkCcPlPhKNu

-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: taras
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO taras;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: taras
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: taras
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO taras;

--
-- Name: hives; Type: TABLE; Schema: public; Owner: taras
--

CREATE TABLE public.hives (
    id integer NOT NULL,
    name character varying NOT NULL,
    location character varying NOT NULL,
    api_key character varying NOT NULL,
    created_at timestamp without time zone,
    user_id uuid NOT NULL
);


ALTER TABLE public.hives OWNER TO taras;

--
-- Name: hives_id_seq; Type: SEQUENCE; Schema: public; Owner: taras
--

CREATE SEQUENCE public.hives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hives_id_seq OWNER TO taras;

--
-- Name: hives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: taras
--

ALTER SEQUENCE public.hives_id_seq OWNED BY public.hives.id;


--
-- Name: sensor_readings; Type: TABLE; Schema: public; Owner: taras
--

CREATE TABLE public.sensor_readings (
    id integer NOT NULL,
    hive_id integer NOT NULL,
    temperature double precision NOT NULL,
    humidity double precision NOT NULL,
    pressure double precision NOT NULL,
    weight double precision,
    recorded_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sensor_readings OWNER TO taras;

--
-- Name: sensor_readings_id_seq; Type: SEQUENCE; Schema: public; Owner: taras
--

CREATE SEQUENCE public.sensor_readings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sensor_readings_id_seq OWNER TO taras;

--
-- Name: sensor_readings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: taras
--

ALTER SEQUENCE public.sensor_readings_id_seq OWNED BY public.sensor_readings.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: taras
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email character varying(320) NOT NULL,
    hashed_password character varying(1024) NOT NULL,
    is_active boolean NOT NULL,
    is_superuser boolean NOT NULL,
    is_verified boolean NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.users OWNER TO taras;

--
-- Name: hives id; Type: DEFAULT; Schema: public; Owner: taras
--

ALTER TABLE ONLY public.hives ALTER COLUMN id SET DEFAULT nextval('public.hives_id_seq'::regclass);


--
-- Name: sensor_readings id; Type: DEFAULT; Schema: public; Owner: taras
--

ALTER TABLE ONLY public.sensor_readings ALTER COLUMN id SET DEFAULT nextval('public.sensor_readings_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: taras
--

COPY public.alembic_version (version_num) FROM stdin;
5c9c9ed0d36b
\.


--
-- Data for Name: hives; Type: TABLE DATA; Schema: public; Owner: taras
--

COPY public.hives (id, name, location, api_key, created_at, user_id) FROM stdin;
1	string	string	aa1cbe16a17cc674f47bbcfd7969b97c	2026-04-22 18:30:49.975198	a9bf2f24-b251-4764-b802-615a0e23a61d
2	string	string	de155a7664c5b4971fbbad02c1f5b418	2026-04-22 18:34:26.063534	a9bf2f24-b251-4764-b802-615a0e23a61d
\.


--
-- Data for Name: sensor_readings; Type: TABLE DATA; Schema: public; Owner: taras
--

COPY public.sensor_readings (id, hive_id, temperature, humidity, pressure, weight, recorded_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: taras
--

COPY public.users (id, email, hashed_password, is_active, is_superuser, is_verified, name) FROM stdin;
a9bf2f24-b251-4764-b802-615a0e23a61d	user@example.com	$argon2id$v=19$m=65536,t=3,p=4$PPEfNxkXmMM9P/lYRuSDMA$i063xLRI1Z+fgcgTTjDvWSdyMOzPrtjYxvj7WI8FUyg	t	f	f	string
43d73a9d-78d8-4db0-9db1-4bb0734031db	agalchisak@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$cA7SC3tGXpgtGp+8LjQSGg$XiVdqJi2yVGgokIpJqFXwDhc0DKtAv2M6kIEfm7yuK4	t	f	f	Гальчишак Андрій
c37aea3c-81aa-4ec8-b918-d2730bf0cd8d	asdasd@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$JnxnNNJcOMjPVVp77cDooA$LhKhFqoMPnHPlc9VmL+XEZA7DtxEL5wYS9OmlqhiEWQ	t	f	f	Тарас
0633c132-7dfb-4280-ad72-5a6c50127a57	aaaaaa@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$6r6ZVcAyaYlbJmpczBjPng$K+7DNuH+n+RLq2Gl99cAvDjrMMrtzlvOG09fHM8Kj8k	t	f	f	Гурнічний
9cfe4901-3b66-480d-96ba-f18af7db0fd7	us6556er@example.com	$argon2id$v=19$m=65536,t=3,p=4$4fGIt9T2RKzhPpuytQAuvA$Phr09Rj/4CMeslFFo9ou9oYZEeCmwJS4CmoSqtAnXJ8	t	f	f	string
\.


--
-- Name: hives_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taras
--

SELECT pg_catalog.setval('public.hives_id_seq', 2, true);


--
-- Name: sensor_readings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taras
--

SELECT pg_catalog.setval('public.sensor_readings_id_seq', 1, false);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: taras
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: hives hives_pkey; Type: CONSTRAINT; Schema: public; Owner: taras
--

ALTER TABLE ONLY public.hives
    ADD CONSTRAINT hives_pkey PRIMARY KEY (id);


--
-- Name: sensor_readings sensor_readings_pkey; Type: CONSTRAINT; Schema: public; Owner: taras
--

ALTER TABLE ONLY public.sensor_readings
    ADD CONSTRAINT sensor_readings_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: taras
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_sensor_readings_hive_id; Type: INDEX; Schema: public; Owner: taras
--

CREATE INDEX ix_sensor_readings_hive_id ON public.sensor_readings USING btree (hive_id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: taras
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: hives hives_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taras
--

ALTER TABLE ONLY public.hives
    ADD CONSTRAINT hives_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: taras
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict W80pNBttWNHBdmW9ZbqaOqSYI7zW9pMvrW2DYJwbv5Qcu7aVDBqDWkCcPlPhKNu

