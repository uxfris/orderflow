import "express";

declare global {
  namespace Express {
    interface UserPayload {
      sub: string;
      role: string;
    }
    interface Request {
      user?: UserPayload;
    }
    interface Response {
      success<T>(
        data: T,
        message?: string,
        status?: number,
        meta?: unknown,
      ): Response;
      error<T>(message: string, status: number, errors?: unknown): Response;
    }
  }
}
