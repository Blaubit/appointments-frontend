"use server";

import { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { getSession } from "@/actions/auth";
import { getServerAxios } from "@/lib/axios";

type TicketPayload = {
  subject: string;
  description: string;
  priority: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  sourceSystem: string;
  externalId: string;
};

export default async function submitTicket(
  payload: TicketPayload
): Promise<SuccessReponse<any> | ErrorResponse | any> {
  const session = await getSession();

  if (!session) {
    return {
      message: "Session not found. Please log in again.",
      status: 401,
    };
  }

  if (!parsedEnv.TICKETS_URL) {
    return {
      message: "Ticket service URL is not configured.",
      status: 500,
    };
  }

  try {
    const axiosInstance = getServerAxios(
      parsedEnv.TICKETS_URL,
      session || undefined
    );
    const url = `/tickets`;

    const response = await axiosInstance.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: unknown) {
    console.error("submitTicket error:", error);
    if (isAxiosError(error)) {
      return {
        message:
          (error as any).response?.data?.message || (error as any).message,
        code: (error as any).code,
        status: (error as any).response?.status,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
      };
    }
  }
}
