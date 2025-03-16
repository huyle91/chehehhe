import { Role } from "@/constants/type";
import { decodeToken } from "@/lib/utils";
import { NextResponse, type NextRequest } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];
const rolePaths: Record<string, string> = {
  Admin: "/manage/a",
  Manager: "/manage/m",
  Staff: "/manage/s",
  Chef: "/manage/c",
};
// const homePath = "/";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // Chưa đăng nhập
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearToken", "true");
    return NextResponse.redirect(url);
  }

  if (refreshToken) {
    // Đã đăng nhập -> không cho vào trang login
    if (unAuthPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Đã đăng nhập nhưng accessToken hết hạn
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set("refresh_token", refreshToken);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // Kiểm tra role và quyền truy cập
    const role = decodeToken(refreshToken).role.name;

    //customer
    const isCustomerGoToMange =
      role === Role.Customer &&
      privatePaths.some((path) => pathname.startsWith(path));
    if (isCustomerGoToMange) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const allowedPath = rolePaths[role];
    // Nếu truy cập "/manage", giữ nguyên trang này
    if (pathname === "/manage" || pathname === "/manage/setting") {
      return NextResponse.next();
    }

    // Nếu truy cập sai đường dẫn so với role, chuyển hướng về "/manage"
    if (allowedPath && !pathname.startsWith(allowedPath)) {
      return NextResponse.redirect(new URL("/manage", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/login", "/guest/menu"],
};
