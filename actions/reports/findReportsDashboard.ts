"use server";

import axios, { isAxiosError } from "axios";
import { parsedEnv } from "@/app/env";
import { ErrorResponse, SuccessReponse } from "@/types/api";
import { getSession } from "@/actions/auth";
import { getCompanyId } from "@/actions/user/getCompanyId";

type Props = {
  searchParams?: URLSearchParams;
};

export async function findAll(
  props: Props = {}
): Promise<SuccessReponse<any[]> | ErrorResponse | any> {
  const session = await getSession();
  const companyId = await getCompanyId();

  try {
    const url = `${parsedEnv.API_URL}/companies/${companyId}/reports/dashboard`;

    // Ya no necesitas construir params ni searchParamsObject
    // Si quieres conservarlo, puedes comentar o eliminar esta parte:
    // const searchParamsObject: Record<string, string> = {};
    // if (props.searchParams) {
    //   props.searchParams.forEach((value, key) => {
    //     searchParamsObject[key] = value;
    //   });
    // }
    //
    // const params: Record<string, any> = {
    //   page: searchParamsObject.page || "1",
    // };
    // if (searchParamsObject.search) {
    //   params.q = searchParamsObject.search;
    // }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
      // params,
    });

    // SOLO loguea lo serializable
    //console.log("Response data:", response.data);

    // SOLO retorna datos serializables
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    console.log("Error in findAll services:", error);
    if (isAxiosError(error)) {
      return {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: [],
      };
    } else {
      return {
        message: "An unexpected error occurred.",
        data: [],
      };
    }
  }
}
