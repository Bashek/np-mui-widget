export type ErrorHandlerInterface = (error: Error, msg?: string) => void;

export const errorHandler: ErrorHandlerInterface = (error: Error, msg) => {
  console.error(error.message, msg); // eslint-disable-line
};
