import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher([
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhook/clerk",
])

export default clerkMiddleware(async (auth, req) => {
    if (isPublicRoute(req)) return
    await auth.protect()
})

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ico|woff2?|ttf)).*)",
        "/(api|trpc)(.*)",
    ],
}