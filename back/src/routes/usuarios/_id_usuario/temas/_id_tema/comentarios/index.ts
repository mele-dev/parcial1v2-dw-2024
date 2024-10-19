import { FastifyPluginAsync } from "fastify";
import { Type } from "@sinclair/typebox";
import * as comentarioService from "../../../../../../services/comentarios.js";
import { IdTema } from "../../../../../../types/tema.js";
import {
  ComentarioSchema,
  ComentarioType,
} from "../../../../../../types/comentario.js";

const comentariosRoutes: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/", {
    schema: {
      summary: "Listado de comentarios de un tema.",
      tags: ["comentarios"],
      response: {
        200: {
          description: "Listado de comentarios de un tema.",
          content: {
            "application/json": {
              schema: Type.Array(ComentarioSchema),
            },
          },
        },
      },
    },
    onRequest: [fastify.verifyJWT, fastify.verifyAdmin],
    handler: async function (request, reply) {
      const { id_tema } = request.params as IdTema;
      return comentarioService.findAll(id_tema);
    },
  });

  fastify.post("/", {
    schema: {
      summary: "Crear un comentario",
      description: "Ruta para crear un comentario en una tarea.",
      security: [],
      tags: ["comentarios"],
      body: ComentarioSchema,
      response: {
        201: {
          description: "Creado correctamente",
          content: {
            "application/json": {
              schema: ComentarioSchema,
            },
          },
        },
      },
    },
    handler: async function (request, reply) {
      const { id_tema, id_usuario } = request.params as {
        id_tema: number;
        id_usuario: number;
      };
      const { descripcion } = request.body as ComentarioType;
      return comentarioService.create(id_tema, id_usuario, descripcion);
    },
  });
};

export default comentariosRoutes;
