import { Type } from "@sinclair/typebox";
import {
  Generated,
  ColumnType,
  Selectable,
  Insertable,
  Updateable,
} from "kysely";
import { RecursiveStatic, ExpandDeep, Nullable } from "./generic";

const Student = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  address: Type.String(),
});

const Topic = Type.Object({
  id: Type.Number(),
  name: Type.String(),
});

const BankSoal = Type.Object({
  id: Type.Number(),
  question: Type.String(),
  difficulty: Type.Optional(Type.Number()),
});

const BankSoalAnswer = Type.Object({
  id: Type.Number(),
  bank_soal_id: Type.Number(),
  answer: Type.String(),
  is_correct: Type.Boolean(),
});

const BankSoalTopic = Type.Object({
  id: Type.Number(),
  bank_soal_id: Type.Number(),
  topic_id: Type.Number(),
});

const User = Type.Object({
  id: Type.Number(),
  auth_key: Type.String(),
  fullname: Type.String(),
  role: Type.Union([Type.Literal("student"), Type.Literal("lecturer")]),
});

const Quiz = Type.Object({
  id: Type.Number(),
  description: Nullable(Type.String()),
  start: Type.String(),
  end: Type.String(),
  created_by: Type.Number(),
});

const QuizSoal = Type.Object({
  id: Type.Number(),
  quiz_id: Type.Number(),
  bank_soal_id: Type.Number(),
});

type DefaultAutoCols = {
  id: Generated<number>;
  created_at: ColumnType<number, number | undefined, never>;
  updated_at: ColumnType<number, number | undefined, never>;
};

export const DbSchema = {
  student: Student,
  topic: Topic,
  bank_soal: BankSoal,
  bank_soal_answer: BankSoalAnswer,
  bank_soal_topic: BankSoalTopic,
  user: User,
  quiz: Quiz,
  quiz_soal: QuizSoal,
};

export type Db = RecursiveStatic<typeof DbSchema>;

export type Entities = {
  [Key in keyof Database]: Entity<Database[Key]>;
};

type Entity<T> = {
  table: T;
  select: ExpandDeep<Selectable<T>>;
  insert: ExpandDeep<Insertable<T>>;
  update: ExpandDeep<Updateable<T>>;
};

type Modify<T, R> = Omit<T, keyof R> & R;

export type Database = {
  student: Modify<Db["student"], DefaultAutoCols>;
  topic: Modify<Db["topic"], DefaultAutoCols>;
  bank_soal: Modify<Db["bank_soal"], DefaultAutoCols>;
  bank_soal_answer: Modify<Db["bank_soal_answer"], DefaultAutoCols>;
  bank_soal_topic: Modify<Db["bank_soal_topic"], DefaultAutoCols>;
  user: Modify<Db["user"], DefaultAutoCols>;
  quiz: Modify<Db["quiz"], DefaultAutoCols>;
  quiz_soal: Modify<Db["quiz_soal"], DefaultAutoCols>;
};
