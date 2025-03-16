import authApiRequest from "@/apiRequest/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { HttpError } from "@/lib/http";

export async function POST() {
  const cookieStore = cookies();
  const refresh_token = (await cookieStore).get("refresh_token")?.value;

  if (!refresh_token) {
    return Response.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
  try {
    const { payload } = await authApiRequest.sRefreshToken({
      refresh_token,
    });

    const decodedAccessToken = jwt.decode(payload.data.access_token) as {
      exp: number;
    };
    const decodedRefreshToken = jwt.decode(payload.data.refresh_token) as {
      exp: number;
    };
    (await cookieStore).set("access_token", payload.data.access_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });
    (await cookieStore).set("refresh_token", payload.data.refresh_token, {
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
          status: 401,
        }
      );
    }
  }
}
