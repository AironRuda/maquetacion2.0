"use strict";

var validator = require("validator");
const article = require("../models/article");
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
    // Recoger el id de url
    var articleId = req.params.id;
    // Comprobar que existe
    if (!articleId || articleId == null) {
      return res.status(404).send({
        status: "error",
        message: "No existe el articulo",
      });
    }

    // Buscar articulo y generar respuesta
    Article.findById(articleId, (err, article) => {
      if (err || !article) {
        return res.status(404).send({
          status: "error",
          message: "Articulo no encontrado",
        });
      }
      return res.status(200).send({
        status: "success",
        article,
      });
    });
  },
  update: (req, res) => {
    // Recoger el id de articulo que viene por URL
    var articleId = req.params.id;

    // Recoger los datos que llegan por put
    var params = req.body;

    // Validar los datos
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(200).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }

    if (validate_title && validate_content) {
      // Find and update
      /**
       * Primer parametro, es a quien voy a modificar
       * Segundo parametro, que voy a modificar
       * Tercer parametro, cracion de nuevo objeto
       */
      Article.findOneAndUpdate(
        { _id: articleId },
        params,
        { nee: true },
        (err, articleUpdated) => {
          if (err) {
            return res.status(500).send({
              status: "error",
              message: "Error al actualizar",
            });
          }
          if (!articleUpdated) {
            return res.status(404).send({
              status: "error",
              message: "No existe el articulo",
            });
          }
          return res.status(500).send({
            status: "success",
            article: articleUpdated,
          });
        }
      );
    } else {
      return res.status(200).send({
        status: "error",
        message: "Validacion no correcta",
      });
    }

    // Dar respuesta
  },
  delete: (req, res) => {
    // Recoger id de la url
    var articleId = req.params.id;

    // Find and delete
    Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error al borrar",
        });
      }
      if (!articleRemoved) {
        return res.status(500).send({
          status: "error",
          message: "articulo a borrar no encontrado",
        });
      }
      return res.status(200).send({
        status: "succes",
        article: articleRemoved,
      });
    });

    return res.status(500).send({
      status: "error",
      message: "Error al actualizar",
    });
  },
}; // End controller

module.exports = articleController;
