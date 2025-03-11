import { NextRequest, NextResponse } from "next/server";
export type NextMiddleware = () => Promise<NextResponse>;

type Middleware = (
  req: NextRequest,
  res: NextResponse,
  next: NextMiddleware
) => Promise<NextResponse>;

class ApiRoute {
  use(...funcs: Middleware[]) {
    return async (req: NextRequest, res: NextResponse) => {
      const execute = async (index: number): Promise<NextResponse> => {
        if (index >= funcs.length) {
          return NextResponse.json(
            { error: "No handler found" },
            { status: 404 }
          );
        }

        const currentFunc = funcs[index];
        return currentFunc(req, res, () => execute(index + 1));
      };

      return execute(0);
    };
  }
}

export default ApiRoute;
