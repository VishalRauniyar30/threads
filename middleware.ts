import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Define matchers for public and ignored routes
const isPublicRoute = createRouteMatcher(['/' ,'/api/webhook/clerk', '/sign-in(.*)', '/sign-up(.*)', '/api/uploadthing'])
const isIgnoredRoute = createRouteMatcher(["/api/webhook/clerk"])

export default clerkMiddleware(async (auth, req) => {
    // Skip authentication for public routes
    if(isPublicRoute(req)){
        return
    }

    // Skip authentication entirely for ignored routes
    if(isIgnoredRoute(req)){
        return
    }
    // Protect all other routes
    await auth.protect()
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}