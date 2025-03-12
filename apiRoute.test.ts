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
  });
});
