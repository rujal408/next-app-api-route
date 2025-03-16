import { NextRequest, NextResponse } from "next/server";

/**
 * Type definition for the next middleware function in the chain
 * @returns Promise resolving to a NextResponse
 */
export type NextMiddleware = () => Promise<NextResponse>;

export type TCache = {
  setValue: (key: string, value: any) => void;
  getValue: (key: string) => any;
  removeValue: (key: string) => void;
};

/**
 * Request function type definition
 * @param req - Next.js request object
 * @param params - Next.js params object
 * @param next - Function to call the next middleware in the chain
 * @param cach - set and get cache
 * @returns Promise resolving to a NextResponse
 */

export type NextChain = (
  req: NextRequest,
  params: any,
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
    this.setValue = this.setValue.bind(this);
    this.getValue = this.getValue.bind(this);
    this.removeValue = this.removeValue.bind(this);
  }

  private setValue(key: string, value: any) {
    this.cache.set(key, value);
  }

  private getValue(key: string) {
    return this.cache.get(key);
  }

  private removeValue(key: string) {
    return this.cache.delete(key);
  }

  public use(...funcs: NextChain[]) {
    const cache = {
      setValue: this.setValue,
      getValue: this.getValue,
      removeValue: this.removeValue,
    };
    return async (req: NextRequest, params?: any) => {
      /**
       * Recursive middleware executor
       * @param index - Current middleware index
       * @returns Promise resolving to a NextResponse
       */
      const execute = async (index: number): Promise<NextResponse> => {
        if (index >= funcs.length) {
          return NextResponse.json(
            { error: "No handler found" },
            { status: 404 }
          );
        }

        const currentFunc = funcs[index];
        return currentFunc(
          req,
          params ? params : {},
          () => {
            return execute(index + 1);
          },
          cache
        );
      };

      return execute(0);
    };
  }
}

export default ApiRoute;
