"use server";

import axios, { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { getSession } from "@/actions/auth";

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
  try {
    const url = `${parsedEnv.TICKETS_URL}/tickets`;
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
    });
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        message: error.response?.data?.message || error.message,
        code: error.code,
        status: error.response?.status,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
      };
    }
  }
}
