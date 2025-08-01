import { Pagination } from "@/types";

type SuccessReponse<T> = {
  data: T;
  status: number;
  statusText: string;
  meta?: Pagination;
};

export default SuccessReponse;
