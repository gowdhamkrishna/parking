import { clerkMiddleware} from "@clerk/nextjs/server";
 
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
export default clerkMiddleware  ({
  publicRoutes: [
    "/",                 // Home page
    "/about",           // About page
    "/contact",         // Contact page
    "/api/public(.*)",  // Public API routes
    "/favicon.ico",     // Favicon
  ],
  ignoredRoutes: [
    "/((?!api|trpc))(_next|.+\\.[\\w]+$)", // Ignore static files
  ]
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};