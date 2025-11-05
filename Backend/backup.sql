-- PostgreSQL database dump
-- Database: ecoresiduos_db
-- User: admin

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Crear tipo enum
CREATE TYPE public.tipo_transaccion_enum AS ENUM (
    'entrega',
    'evento',
    'canje'
);

ALTER TYPE public.tipo_transaccion_enum OWNER TO admin;

-- Crear tablas
CREATE TABLE public.contenedores (
    id_contenedor SERIAL PRIMARY KEY,
    latitud NUMERIC(9,6) NOT NULL,
    longitud NUMERIC(9,6) NOT NULL,
    materiales_aceptados VARCHAR(255) NOT NULL,
    dias_horarios_recoleccion TEXT
);

CREATE TABLE public.eventos_ambientales (
    id_evento SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    fecha TIMESTAMP NOT NULL,
    ubicacion TEXT,
    puntos_otorgados INTEGER
);

CREATE TABLE public.usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    "contraseña" TEXT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.puntos_ecologicos (
    id_transaccion SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES public.usuarios(id_usuario),
    tipo_transaccion public.tipo_transaccion_enum NOT NULL,
    puntos INTEGER NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_referencia INTEGER
);

-- Datos iniciales (vacío, puedes agregar después)
