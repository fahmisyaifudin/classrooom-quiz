import { DbSchema } from "./database";
import { Type } from "@sinclair/typebox";
import { RecursiveStatic } from "./generic";

const DefaultSuccessResponse = Type.Object({
  message: Type.String(),
});

const BankSoalSchema = {
  read_many: {
    response: Type.Object({
      data: Type.Array(
        Type.Intersect([
          DbSchema["bank_soal"],
          Type.Object({
            topics: Type.Array(Type.String()),
          }),
        ])
      ),
    }),
  },
  create: {
    body: Type.Object({
      question: Type.String(),
      difficulty: Type.Optional(Type.Number()),
      topics: Type.Optional(Type.Array(Type.Number())),
      answers: Type.Array(
        Type.Object({
          answer: Type.String(),
          is_correct: Type.Boolean(),
        })
      ),
    }),
    response: DefaultSuccessResponse,
  },
  topic: {
    response: Type.Object({
      data: Type.Array(DbSchema["topic"]),
    }),
  },
};

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
export type BankSoalCRUD = RecursiveStatic<typeof BankSoalSchema>;
