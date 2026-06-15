import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { handleApiError, unauthorized } from "./api-error";
type ApiHandler = (
  req: NextRequest,
  context: { params: Promise<Record<string, string>>; userId: string }
) => Promise<NextResponse>;
export function withAuth(handler: ApiHandler) {
  return async (
    req: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ) => {
    try {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return handler(req, { ...context, userId: session.user.id });
    } catch (error) {
      return handleApiError(error);
    }
  };
}
