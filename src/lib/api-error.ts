import { NextResponse } from "next/server";
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}
export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
  console.error("Unhandled API error:", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
export function notFound(message = "Resource not found") {
  throw new ApiError(404, message);
}
export function unauthorized(message = "Unauthorized") {
  throw new ApiError(401, message);
}
export function forbidden(message = "Forbidden") {
  throw new ApiError(403, message);
}
export function badRequest(message: string) {
  throw new ApiError(400, message);
}
