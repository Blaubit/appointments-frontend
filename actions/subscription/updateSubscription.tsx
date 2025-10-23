"use server";

import axios, { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { Subscription } from "@/types";
import { getSession } from "@/actions/auth";

type UpdateSubscriptionData = {
  id?: string; // Optional, in case you want to update an existing subscription
  companyId: string;
  planId: string;
  endDate: string;
  status: "active" | "cancelled";
};

export async function updateSubscription(
  data: UpdateSubscriptionData
): Promise<SuccessReponse<Subscription> | ErrorResponse> {
  const session = await getSession();

  if (!session) {
    return {
      message: "Session not found. Please log in again.",
      status: 401,
    };
  }

  try {
    const url = `${parsedEnv.API_URL}/companies/${data.companyId}/subscriptions/${data.id}`;

    const response = await axios.patch(
      url,
      {
        planId: data.planId,
        endDate: data.endDate,
        status: data.status,
      },
      {
        headers: {
          Authorization: `Bearer ${session}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("updateSubscription response:", response.data);
    return {
      data: response.data,
      status: 200,
      statusText: response.statusText,
    };
  } catch (error) {
    console.log("Error in updateSubscription:", error);
    if (isAxiosError(error)) {
      return {
        message: error.response?.data?.message || error.message,
        code: error.code,
        status: error.response?.status || 500,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
        status: 500,
      };
    }
  }
}
