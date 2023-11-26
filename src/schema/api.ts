import { DbSchema } from "./database";
import { Type } from "@sinclair/typebox";
import { RecursiveStatic, Nullable } from "./generic";

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

const ProfileSchema = {
  read: {
    response: Type.Object({
      data: DbSchema["user"],
    }),
  },
};

const QuizCRUDSchema = {
  create: {
    body: Type.Object({
      description: Nullable(Type.String()),
      start: Type.String(),
      end: Type.String(),
      detail: Type.Array(
        Type.Object({
          topic_id: Type.Number(),
          qty: Type.Number(),
          difficulty: Type.Number(),
        })
      ),
    }),
    response: Type.Object({
      data: DefaultSuccessResponse,
    }),
  },
  read_many: {
    response: Type.Object({
      data: Type.Array(
        Type.Intersect([
          DbSchema["quiz"],
          Type.Object({
            name_created: Type.String(),
            qty: Type.Number(),
          }),
        ])
      ),
    }),
  },
  read_single: {
    params: {
      id: Type.Number(),
    },
    response: Type.Object({
      data: Type.Intersect([
        Type.Pick(DbSchema["quiz"], ["description", "start", "end"]),
        Type.Object({
          questions: Type.Array(
            Type.Object({
              question: Type.String(),
              answers: Type.Array(
                Type.Object({
                  id: Type.Number(),
                  answer: Type.String(),
                })
              ),
            })
          ),
        }),
      ]),
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
export type ProfileCRUD = RecursiveStatic<typeof ProfileSchema>;
export type QuizCRUD = RecursiveStatic<typeof QuizCRUDSchema>;
