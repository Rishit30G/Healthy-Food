import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const maintenanceMode = process.env.MAINTENANCE === "true";
    const url = req.nextUrl.clone();

    // Redirect all users to /maintenance when maintenance is enabled
    if (maintenanceMode && !url.pathname.startsWith("/maintenance")) {
        return NextResponse.redirect(new URL("/maintenance", req.url));
    }

    // Prevent access to /maintenance when maintenance mode is off
    if (!maintenanceMode && url.pathname.startsWith("/maintenance")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/maintenance"], // Apply middleware to home and maintenance pages
};