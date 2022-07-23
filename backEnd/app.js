"use strict";

// Cargar modulos de node para crear servidor
var express = require("express"); // Carga modulo de node
var bodyParser = require("body-parser"); // Recibe peticiones y los convierte en objetos utilizables por javaScript

// Ejecutar express (http)
var app = express(); // Variable en si que se exporta

// Cargar ficheros rutas
var article_routes = require("./routes/article");

// Cargar MiddLewares
app.use(bodyParser.urlencoded({ extended: false })); // Cargar y usar el body parser
app.use(bodyParser.json()); // Convertir objeto que llegue a utilizable por JavaScript

// Cargar CORS

// Añadir prefijos a rutas /cargar rutas
app.use("/api", article_routes);

// Exportar el modulo (fichero actual)
module.exports = app; // Extraer objeto fuera dle fichero
