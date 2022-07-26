"use strict";

var validator = require("validator");

var fs = require("fs"); // Importa modulo que borra archivo subido

var path = require("path"); // Importa modulo para sacar la ruta de un archivo en el sistema de archivos en el servidor

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
  upload: (req, res) => {
    // Configurar el modulo de conect multiparty router/article.js (hecho)

    // Recoger el fichero de la peticion enviada
    var file_name = "Imagen no subida"; // Valor por defecto

    if (!req.files) {
      // Ingresa al if si no se ingresa alguna foto
      return res.status(404).send({
        status: "error",
        message: file_name,
      });
    }

    // Conseguir el nombre y la extension del archivo
    /**
     * Esta informacion se obtuvo de cargar una imagen a modo de prueba
     * file0, nombre de lo que se va a enviar (En este caso una imagen)
     *
     * al almacenar la informacion del documento cargado, node lo rebautiza con un codigo unico (path)
     * Se debe segmentar dicho codigo para extraer unicamente dicho nombre
     */
    var file_path = req.files.file0.path;
    var file_split = file_path.split("\\"); // Corta segun el marcador indicado

    // Sacar nombre del archivo
    var file_name = file_split[2]; // Extrae unicamente el renombre del archivo renombrado y almacenado en upload/articles

    // Extension del fichero
    var extension_split = file_name.split("."); // De el re nombre divide en nombre y extension
    var file_ext = extension_split[1]; // Se extrae la extension del archivo

    // Comprobar la extension, solo imagenes, si es valido borrar el fichero
    if (
      file_ext != "png" &&
      file_ext != "jpg" &&
      file_ext != "jpeg" &&
      file_ext != "gif"
    ) {
      // Borrar el archivo subido si no cumple con la extension
      fs.unlink(file_path, (err) => {
        return res.status(200).send({
          status: "error",
          message: "La extension de la imagen no es valida",
        });
      }); // Borra todo el fichero relacionado con la direccion puntual del documento guardado
    } else {
      // Si todo es valido
      var articleId = req.params.id; // Sacando id del archivo en la base de datos (url)

      // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
      Article.findOneAndUpdate(
        { _id: articleId }, // Documento en la base de datos que quiero modificar
        { image: file_name }, // Espacio que quiero modificar
        { new: true }, // Que me enseñe el nuevo documento con los cambios
        (err, articleUpdated) => {
          // callBack function, evalua si se presentan errores o hubo exito en la modificacion

          if (err || !articleUpdated) {
            return res.status(500).send({
              status: "error",
              message: "error al guardar la imagen de articulo",
            });
          }

          return res.status(200).send({
            //fichero: req.files, // Extrae datos de la imagen almacenada en una carpeta local
            //split: file_split,
            //file_ext,
            status: "success",
            article: articleUpdated,
          });
        }
      );
    }
  },
  getImage: (req, res) => {
    var file = req.params.image; // Extrae el nombre de la imagen
    var pathFile = "./upload/articles/" + file; // Concatena el lugar de almacenamiento de las imagenes con el nombre de una imagen puntual

    fs.exists(pathFile, (exist) => {
      if (exist) {
        return res.sendFile(path.resolve(pathFile)); // Carga libreria path, retorna la imagen puntual
      } else {
        return res.status(404).send({
          status: "error",
          message: "La imagen no existe",
        });
      }
    });
  },
}; // End controller

module.exports = articleController;
