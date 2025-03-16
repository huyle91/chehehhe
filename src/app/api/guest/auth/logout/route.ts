import guestApiRequest from "@/apiRequest/guest";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();
 
    
    const { guestId } = body;
   

    if (!guestId) {
      console.error("Missing guestId in request body:", body);
      return Response.json(
        {
          message: "Không nhận được guest ID",
          status: "error",
        },
        { status: 400 }
      );
    }

    try {
   
      const response = await guestApiRequest.sLogout(guestId);
     
      // Delete auth cookies after successful logout
      cookieStore.delete("access_token");
      cookieStore.delete("refresh_token");
      cookieStore.delete("guestId");

      return Response.json(
        {
          message: "Đăng xuất thành công",
          status: "success",
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Backend API error details:", {
        error,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        stack: error?.stack
      });
      
      return Response.json(
        {
          message: "Lỗi khi gọi API đến server backend",
          error: error?.message || "Unknown error",
          status: "error",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Request parsing error details:", {
      error,
      message: error?.message,
      stack: error?.stack
    });
    
    return Response.json(
      {
        message: "Lỗi khi xử lý yêu cầu",
        error: error?.message || "Unknown error",
        status: "error",
      },
      { status: 400 }
    );
  }
}
