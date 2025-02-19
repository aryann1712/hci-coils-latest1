// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

// // This middleware protects admin routes. 
// export function middleware(request: NextRequest) {
//   // 1) Identify if the request path is for admin routes, e.g. /(admin)/...
//   //    We'll handle that in the matcher config below.

//   // 2) Read the token from cookies
//   const token = request.cookies.get("token")?.value; 
//   if (!token) {
//     // No token means user is not logged in => redirect
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // 3) Verify token & role
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     // e.g. decoded = { userId: "xxx", role: "admin", iat, exp }

//     // Check role
//     // If the user isn't admin or manager, redirect
//     if (decoded.role !== "admin" && decoded.role !== "manager") {
//       return NextResponse.redirect(new URL("/", request.url));
//     }

//     // If all good, allow request
//     return NextResponse.next();
//   } catch (err) {
//     // invalid or expired token
//     return NextResponse.redirect(new URL("/", request.url));
//   }
// }

// // 4) Configure which routes match the middleware
// export const config = {
//   matcher: [
//     // Protect everything under /(admin) 
//     // Adjust the pattern if your admin folder is named differently.
//     "/(admin)/(.*)",
//   ],
// };
