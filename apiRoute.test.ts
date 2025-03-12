import { NextRequest, NextResponse } from "next/server";
import ApiRoute, { NextMiddleware, TCache } from "./src/index";

const mockReq = {} as NextRequest;

describe("ApiRoute", () => {
  describe("use", () => {
    it("should return the response from the middleware", async () => {
      const router = new ApiRoute();
      const postData = async (
        _: NextRequest,
        __: NextMiddleware,
        ___: TCache
      ) => {
        return NextResponse.json({ message: "Data created successfully" });
      };
      const POST = router.use(postData);
      const response = await POST(mockReq);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({ message: "Data created successfully" });
    });

    it("should return the response from the function even if we dont pass any argument in the function", async () => {
      const router = new ApiRoute();
      const postData = async () => {
        return NextResponse.json({ message: "Successful" });
      };
      const POST = router.use(postData);
      const response = await POST(mockReq);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({ message: "Successful" });
    });

    it("it should move from one function to another function when next is called", async () => {
      const router = new ApiRoute();

      const middleware = (_: NextRequest, next: NextMiddleware) => {
        return next();
      };

      const getData = async () => {
        return NextResponse.json({ message: "Got It!!" });
      };

      const GET = router.use(middleware, getData);
      const response = await GET(mockReq);
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({ message: "Got It!!" });
    });

    it("it should not move from one function to another function when not authenticated or check for error response status", async () => {
      const router = new ApiRoute();

      const middleware = async (_: NextRequest, next: NextMiddleware) => {
        const authenticated = false;
        if (authenticated) {
          return next();
        }

        return NextResponse.json(
          { message: "Not Authenticated!!" },
          { status: 401 }
        );
      };

      const getData = async () => {
        return NextResponse.json({ message: "Got It!!" });
      };

      const GET = router.use(middleware, getData);
      const response = await GET(mockReq);
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toEqual({ message: "Not Authenticated!!" });
    });
  });
});
