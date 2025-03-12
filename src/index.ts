import { NextRequest, NextResponse } from "next/server";

/**
 * Type definition for the next middleware function in the chain
 * @returns Promise resolving to a NextResponse
 */
export type NextMiddleware = () => Promise<NextResponse>;

export type TCache = {
  setValue: (key: string, value: any) => void;
  getValue: (key: string) => any;
};

/**
 * Request function type definition
 * @param req - Next.js request object
 * @param res - Next.js response object
 * @param next - Function to call the next middleware in the chain
 * @param cach - set and get cache
 * @returns Promise resolving to a NextResponse
 */
type RequestChain = (
  req: NextRequest,
  next: NextMiddleware,
  cache: TCache
) => Promise<NextResponse<unknown>>;

/**
 * ApiRoute class for creating request chains with data passing capabilities
 */
class ApiRoute {
  private cache: Map<string, any>;
  constructor() {
    this.cache = new Map();
  }

  private setValue(key: string, value: any) {
    this.cache.set(key, value);
  }

  public getValue(key: string) {
    return this.cache.get(key);
  }

  public use(...funcs: RequestChain[]) {
    return async (req: NextRequest) => {
      /**
       * Recursive middleware executor
       * @param index - Current middleware index
       * @param previousData - Data passed from previous middleware
       * @returns Promise resolving to a NextResponse
       */
      const execute = async (
        index: number,
        cach: TCache
      ): Promise<NextResponse> => {
        if (index >= funcs.length) {
          return NextResponse.json(
            { error: "No handler found" },
            { status: 404 }
          );
        }

        const currentFunc = funcs[index];
        return currentFunc(req, () => execute(index + 1, cach), cach);
      };

      return execute(0, {
        setValue: this.setValue,
        getValue: this.getValue,
      });
    };
  }
}

export default ApiRoute;
