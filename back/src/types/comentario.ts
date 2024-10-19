import { Static, Type } from "@sinclair/typebox";

export const IdComentario = Type.Object({
  id_comentario: Type.Integer({
    description: "Identificador único de un comentario",
  }),
});
export type IdComentario = Static<typeof IdComentario>;

export const DescripcionComentario = Type.Object({
  descripcion: Type.String({
    description: "Descripcion de un comentario",
  }),
});
export type DescripcionComentario = Static<typeof DescripcionComentario>;

export const ComentarioSchema = Type.Object(
  {
    id_comentario: Type.Integer(),
    id_tema: Type.Integer(),
    id_usuario: Type.Integer(),
    fecha_ingresado: Type.String({
      description: "Fecha en la que se ingreso el comentario",
    }),
    descripcion: Type.String({ description: "Nombre del tema" }),
  },
  {
    examples: [
      {
        id_comentario: 1,
        id_tema: 1,
        id_usuario: 1,
        fecha_ingresado: "10/19/2024",
        descripcion: "La descripcion de un comentario",
      },
    ],
  }
);
export type ComentarioType = Static<typeof ComentarioSchema>;
