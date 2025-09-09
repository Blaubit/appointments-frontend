"use server";

import { parsedEnv } from "@/app/env";
import axios, { isAxiosError } from "axios";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { revalidatePath } from "next/cache";
import { PaymentDto } from "@/types/dto/subscription/payment.dto";
import { Payment } from "@/types/";
import { getSession } from "@/actions/auth";

export async function create({
  subscriptionId,
  amount,
  paymentDate,
  paymentMethod,
  status,
  reference,
}: PaymentDto): Promise<SuccessReponse<Payment> | ErrorResponse> {
  const session = await getSession();
  try {
    const url = `${parsedEnv.API_URL}/payments`;
    const body = {
      subscriptionId,
      amount,
      paymentDate,
      paymentMethod,
      status,
      reference,
    };
    const response = await axios.post<Payment>(url, body, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    revalidatePath("/admin");

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        message: error.message,
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
