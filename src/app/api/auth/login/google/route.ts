import authApiRequest from "@/apiRequest/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { HttpError } from "@/lib/http";

export async function POST(req: Request) {
  const body = (await req.json()) as { email: string };
  const cookieStore = cookies();
  try {
    const { payload } = await authApiRequest.sLoginGoogle(body);
    const access_token = payload?.data.access_token;
    const refresh_token = payload?.data.refresh_token;
    const decodedAccessToken = jwt.decode(access_token) as {
      exp: number;
    };
    const decodedRefreshToken = jwt.decode(refresh_token) as {
      exp: number;
    };
    (await cookieStore).set("access_token", access_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });
    (await cookieStore).set("refresh_token", refresh_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    });
    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          message: "Unknown error",
        },
        {
          status: 500,
        }
      );
    }
  }
}
