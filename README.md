# `Usage Guide`

This package provides a simple way to define API routes with authentication and middleware support in a Next.js application. The code below demonstrates how to create middleware and handle HTTP requests.

## Installation

First, you need to install the package in your Next.js project:

```bash
npm install next-app-api-route
```

## Example Usage

```javascript
import ApiRoute, { NextMiddleware, TCache } from "next-app-api-route";
import { NextRequest, NextResponse } from "next/server";

const router = new ApiRoute();

// Middleware function to check authentication
async function middlewarefun(
  req: NextRequest,
  res: NextResponse,
  next: NextMiddleware,
  cache?: TCache
) {
  // Check if the request is authenticated (replace with actual authentication logic)
  const authenticated = false; // For demo purposes, authentication is false

  if (!authenticated) {
    // If not authenticated, return a 401 Unauthorized response
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  cache.setData("data", { id: 1 });

  // If authenticated, proceed to the next handler
  return next();
}

// Handler for GET requests
const getData = (
  req: NextRequest,
  res: NextResponse,
  next: NextMiddleware,
  cache?: TCache
) => {
  console.log(cache.getData("data")); // "{id:1}"
  return NextResponse.json({ message: "Success" });
};

// Handler for POST requests
const postData = (req: NextRequest, res: NextResponse) => {
  return NextResponse.json({ message: "Data created successfully" });
};

// Apply middleware to the GET route, followed by the handler function
export const GET = router.use(middlewarefun, getData);

// Apply the POST handler (no middleware applied here)
export const POST = router.use(postData);
```
