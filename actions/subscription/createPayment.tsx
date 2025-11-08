"use server";

import { parsedEnv } from "@/app/env";
import { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { PaymentDto } from "@/types/dto/subscription/payment.dto";
import { Payment } from "@/types/";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";
import { getServerAxios } from "@/lib/axios";

export async function create({
  subscriptionId,
  amount,
  paymentDate,
  paymentMethod,
  status,
  reference,
}: PaymentDto): Promise<SuccessReponse<Payment> | ErrorResponse> {
  const session = await getSession();
  const companyId = await getCompanyId();

  // Early validations so global middleware/interceptor can handle 401 uniformly
  if (!companyId) {
    return {
      message: "Company ID not found. Please log in again.",
      status: 401,
    };
  }
  if (!session) {
    return {
      message: "Session not found. Please log in again.",
      status: 401,
    };
  }

  try {
    const axiosInstance = getServerAxios(
      parsedEnv.API_URL,
      session || undefined
    );
    const url = `/payments`;

    const body = {
      subscriptionId,
      amount,
      paymentDate,
      paymentMethod,
      status,
      reference,
    };

    const response = await axiosInstance.post<Payment>(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    revalidatePath("/admin");

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: unknown) {
    console.error("payment_create error:", error);

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
