"use strict";

var express = require("express");
var articleController = require("../controllers/article");

var router = express.Router();

var multipart = require("connect-multiparty"); //Carga el modulo de multiparty
var md_upload = multipart({ uploadDir: "./upload/articles" }); // Funcionalidad que se ejecuta antes que el metodo asignado a la ruta, se debe crear el archivo

// Rutas de prueba
router.post("/datos-curso", articleController.datosCurso);
router.get("/test-de-controlador", articleController.test);

// Rustas utiles
router.post("/save", articleController.save);
router.get("/articles/:last?", articleController.getArticles); // parametro opcionalcon ?
router.get("/article/:id", articleController.getArticle); // Parametro obligatorio sin ?
router.put("/article/:id", articleController.update);
router.delete("/article/:id", articleController.delete);
router.post("/upload-image/:id", md_upload, articleController.upload); // Segundo parametro aplica midlewear
/**
 * Get, saca infrmacion de la base de datos
 * post, guardar o enviar informacion a la base de datos
 * put, se usa para actualizar
 * delete, belimina informacion de la base de datos
 */

module.exports = router;
