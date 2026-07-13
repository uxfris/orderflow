export default class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "App Error";
  }

  static badRequest(message: string) {
    return new AppError(400, message);
  }

  static forbidden(message: string) {
    return new AppError(403, message);
  }
  static notFound(message: string) {
    return new AppError(404, message);
  }

  static conflict(message: string) {
    return new AppError(409, message);
  }

  static internal(message = "Internal Server Error") {
    return new AppError(500, message);
  }
  static unauthroized(message: string) {
    return new AppError(401, message);
  }
}
