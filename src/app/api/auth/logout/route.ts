import authApiRequest from "@/apiRequest/auth";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();

  const access_token = (await cookieStore).get("access_token")?.value;
  const refresh_token = (await cookieStore).get("refresh_token")?.value;

  (await cookieStore).delete("access_token");
  (await cookieStore).delete("refresh_token");

  if (!access_token || !refresh_token) {
    return Response.json(
      {
        message: "Not received token",
      },
      {
        status: 200,
      }
    );
  }

  try {
    const result = await authApiRequest.sLogout({
      refresh_token,
      access_token,
    });
    return Response.json(result.payload);
  } catch {
    return Response.json(
      {
        message: "Unknown error when call api logout backend",
      },
      {
        status: 200,
      }
    );
  }
}
