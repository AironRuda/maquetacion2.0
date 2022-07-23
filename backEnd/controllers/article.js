"use strict";

var validator = require("validator");
var Article = require("../models/article");

var articleController = {
  datosCurso: (req, res) => {
    //MEtodo implementado
    return res.status(200).send({
      curso: "Master en frameworks",
      autor: "Airon Ruda",
      url: "AironRuda.com",
      metodo: "GET",
    });
  },
  test: (req, res) => {
    return res.status(200).send({
      message: "Accion test del controlador de articulos",
    });
  },
  save: (req, res) => {
    // Recoger parametros por post
    var params = req.body;
    console.log(params);
    // Validar datos
    try {
      var validate_title = !validator.isEmpty(params.title); // arroja true, cuando no esté vacio params title
      var validate_content = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(200).send({
        status: "error",
        message: "Faltan datos por enviar", // crea un tipo articulo segun modelo de articulo
      });
    }
    if (validate_title && validate_content) {
      // Crear el objeto a guardar
      var article = new Article(); //Instancias clase modelada

      // Asignar valores
      article.title = params.title;
      article.content = params.content;
      article.image = null;

      // Guardar el articulo
      article.save((err, articleStored) => {
        if (err || !articleStored) {
          return res.status(404).send({
            status: "error",
            message: "Articulo no se ha guardado",
          });
        }
        return res.status(200).send({
          status: "success",
          article: articleStored, // crea un tipo articulo segun modelo de articulo
        });
      });
      // Devolver respuesta
    } else {
      return res.status(200).send({
        status: "error",
        message: "Datos no validos",
      });
    }
  },
  getArticles: (req, res) => {
    var query = Article.find({});

    var last = req.params.last;
    if (last || last != undefined) {
      query.limit(5);
    }
    // Find para extraer datos
    query.sort("-_id").exec((err, articles) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error al devolver los articulos",
        });
      } else if (!articles) {
        return res.status(404).send({
          status: "error",
          message: "No hay articulos",
        });
      }
      return res.status(200).send({
        status: "success",
        articles,
      });
    });
  },
  getArticle: (req, res) => {
    return res.status(200).send({
      status: "success",
      message: "get un solo articulo"
    })
  }
}; // End controller

module.exports = articleController;
