"use server";

import { parsedEnv } from "@/app/env";
import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { Subscription } from "@/types";
import { getSession } from "@/actions/auth";
import { getServerAxios } from "@/lib/axios";

type UpdateSubscriptionData = {
  id?: string;
  companyId: string;
  planId: string;
  endDate?: string;
  status?: "active" | "cancelled";
  reason?: string;
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

  if (!data?.companyId) {
    return {
      message: "Company ID is required.",
      status: 400,
    };
  }

  try {
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );
    const url = `/companies/${encodeURIComponent(
      data.companyId
    )}/subscriptions/request-plan-change`;

    const body: Record<string, any> = {
      requestedPlanId: data.planId,
    };

    if (data.reason) body.reason = data.reason;
    if (data.endDate) body.endDate = data.endDate;
    if (data.status) body.status = data.status;

    const response = await axiosInstance.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.debug("updateSubscription response:", {
      status: response.status,
      data: response.data,
    });

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: unknown) {
    console.error("Error in updateSubscription:", error);
    if (isAxiosError(error)) {
      return {
        message:
          (error as any).response?.data?.message || (error as any).message,
        code: (error as any).code,
        status: (error as any).response?.status || 500,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
        status: 500,
      };
    }
  }
}
