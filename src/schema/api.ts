import { DbSchema } from "./database";
import { Type } from "@sinclair/typebox";
import { RecursiveStatic } from "./generic";

const DefaultSuccessResponse = Type.Object({
  message: Type.String(),
});

const StudentCRUDSchema = {
  read_many: {
    response: Type.Object({
      data: Type.Array(DbSchema["student"]),
    }),
  },
  read_single: {
    params: {
      id: Type.Number(),
    },
    response: Type.Object({
      data: DbSchema["student"],
    }),
  },
  create: {
    body: Type.Pick(DbSchema["student"], ["name", "address"]),
    response: DefaultSuccessResponse,
  },
  update: {
    params: {
      id: Type.Number(),
    },
    body: Type.Partial(DbSchema["student"]),
    response: DefaultSuccessResponse,
  },
  delete: {
    params: {
      id: Type.Number(),
    },
    response: DefaultSuccessResponse,
  },
};

export type StudentCRUD = RecursiveStatic<typeof StudentCRUDSchema>;
