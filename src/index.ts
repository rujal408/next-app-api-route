import { NextRequest, NextResponse } from "next/server";

/**
 * Type definition for the next middleware function in the chain
 * @param data - Optional data to pass to the next middleware
 * @returns Promise resolving to a NextResponse
 */
export type NextMiddleware = (data?: any) => Promise<NextResponse>;

/**
 * Request function type definition
 * @param req - Next.js request object
 * @param res - Next.js response object
 * @param next - Function to call the next middleware in the chain
 * @param data - Optional data received from previous middleware
 * @returns Promise resolving to a NextResponse
 */
type RequestChain = (
  req: NextRequest,
  res: NextResponse,
  next: NextMiddleware,
  data?: any
) => Promise<NextResponse>;

/**
 * ApiRoute class for creating request chains with data passing capabilities
 */
class ApiRoute {
  use(...funcs: RequestChain[]) {
    return async (req: NextRequest, res: NextResponse) => {
      /**
       * Recursive middleware executor
       * @param index - Current middleware index
       * @param previousData - Data passed from previous middleware
       * @returns Promise resolving to a NextResponse
       */
      const execute = async (
        index: number,
        prev?: any
      ): Promise<NextResponse> => {
        if (index >= funcs.length) {
          return NextResponse.json(
            { error: "No handler found" },
            { status: 404 }
          );
        }

        const currentFunc = funcs[index];
        return currentFunc(
          req,
          res,
          (params) => execute(index + 1, params),
          prev
        );
      };

      return execute(0);
    };
  }
}

export default ApiRoute;
