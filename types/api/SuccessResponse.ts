import Pagination from "./Pagination";

type SuccessReponse<T> = {
  data: T;
  status: number;
  statusText: string;
  meta?: Pagination;
};

export default SuccessReponse;
