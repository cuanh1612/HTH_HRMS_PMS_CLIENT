import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Nguyen Quang Hoang");
  return NextResponse.next();
}
