"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = Schema({
  // Definicion de estructura de informacion almacenada en la base de datos
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
  image: String,
});

module.exports = mongoose.model("Article", ArticleSchema); // Definicion de nombre de tipos y estructura de los tipos almacenados

// creacion de coleccion en la base de datos
/**
 * crea coleccion pluralizando el tipo "articles", guarda documentos de este tipo dentro de la coleccion
 */
