import { Static, TSchema, Type } from "@sinclair/typebox";

export type RecursiveStatic<Schemas> = {
  [Key in keyof Schemas]: Schemas[Key] extends TSchema
    ? ExpandDeep<Static<Schemas[Key]>>
    : RecursiveStatic<Schemas[Key]>;
};

export type ExpandDeep<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandDeep<O[K]> }
    : never
  : T;

export const Nullable = <T extends TSchema>(schema: T) =>
  Type.Union([{ ...schema, nullable: true }, Type.Null()]);
