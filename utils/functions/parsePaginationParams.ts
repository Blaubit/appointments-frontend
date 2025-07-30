import { z } from 'zod'

const schema = z.object({
  limit: z.coerce.number().default(12),
  page: z.coerce.number().default(1),
  query: z.string().optional(),
})

export type PaginationParams = z.infer<typeof schema>


const parsePaginationParams = (searchParams: URLSearchParams | undefined) => {
  const searchParamsObject = Object.fromEntries(searchParams ?? [])
  const parsedParams = schema.parse(searchParamsObject)

  return parsedParams
}

export default parsePaginationParams
