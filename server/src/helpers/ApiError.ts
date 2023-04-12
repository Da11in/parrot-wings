export class ApiError extends Error {
  code: number = 400;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}
