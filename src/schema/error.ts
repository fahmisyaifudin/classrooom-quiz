import MessageResponse from "./response";

export default interface ErrorResponse extends MessageResponse {
  stack?: string;
}

export type AppError = {
  message: string;
  reason?: string;
};

export type AppResult<T> = T | AppError;
