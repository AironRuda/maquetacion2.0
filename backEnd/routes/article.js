"use strict";

var express = require("express");
var articleController = require("../controllers/article");

var router = express.Router();

// Rutas de prueba
router.post("/datos-curso", articleController.datosCurso);
router.get("/test-de-controlador", articleController.test);

// Rustas utiles
router.post("/save", articleController.save);
router.get("/articles/:last?", articleController.getArticles); // parametro opcionalcon ?
router.get("/article/:id", articleController.getArticle); // Parametro obligatorio sin ?

module.exports = router;
