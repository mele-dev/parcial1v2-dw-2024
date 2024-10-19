import { FastifyPluginAsync } from "fastify";
import * as comentarioService from "../../../../../../../services/comentarios.js";
import {
  ComentarioSchema,
  ComentarioType,
  DescripcionComentario,
} from "../../../../../../../types/comentario.js";
import { IdTema } from "../../../../../../../types/tema.js";

const comentariosRoutes: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/", {
    schema: {
      summary: "Obtener un comentario en especifico de un tema",
      tags: ["comentarios"],
    },
    onRequest: [fastify.verifyJWT],
    handler: async function (request, reply) {
      const { id_tema } = request.params as IdTema;
      return comentarioService.findAll(id_tema);
    },
  });

  fastify.delete("/", {
    schema: {
      summary: "Eliminar un comentario de una tarea",
      tags: ["comentarios"],
    },
    onRequest: [fastify.verifyJWT],
    handler: async function (request, reply) {
      const { id_tema, id_comentario } = request.params as {
        id_tema: number;
        id_comentario: number;
      };
      return comentarioService.erase(id_tema, id_comentario);
    },
  });

  fastify.put("/", {
    schema: {
      summary: "Modificar un comentario de una tarea",
      tags: ["comentarios"],
      body: DescripcionComentario,
    },
    onRequest: [fastify.verifyJWT],
    handler: async function (request, reply) {
      const { id_tema, id_comentario } = request.params as ComentarioType;
      const { descripcion } = request.body as ComentarioType;
      return comentarioService.modify(id_tema, id_comentario, descripcion);
    },
  });
};

export default comentariosRoutes;
