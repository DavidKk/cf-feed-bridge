export interface ApiResponse<T> {
  code: number
  success: boolean
  data: T | null
  message: string
}

export interface ResponseOptions {
  code?: number
  status?: number
  message?: string
}

const httpHeaders = {
  'Content-Type': 'application/json',
}

/**
 * 创建一个 HTTP 响应
 * @param dataOrError - 要包含在响应中的数据或错误对象
 * @param options - 响应选项，包含 code、status 和 message
 * @returns 返回一个新的 Response 对象
 */
export function createResponse<T>(dataOrError: T | Error, options?: ResponseOptions): Response {
  const { code = 0, status = 200, message = '' } = options || {}

  // 创建响应对象
  const response = (() => {
    if (dataOrError instanceof Error) {
      return {
        code: code !== 0 ? code : 500, // 如果提供了 code，则使用提供的 code，否则默认 500
        success: false,
        data: null,
        message: dataOrError.message || message || 'An error occurred', // 优先使用 Error 的 message，其次使用 options 中的 message
      }
    }

    return {
      code,
      success: code === 0, // 成功的标志，如果 code 是 0，成功，否则失败
      data: code === 0 ? dataOrError : null, // 如果 code 是 0，返回 data，否则 data 为 null
      message: message || (code === 0 ? 'Success' : 'Failed'), // 成功时使用 "Success"，失败时使用 "Failed"
    }
  })()

  // 确定 HTTP 状态码，如果 code 不为 0 且 status 为 200，则使用 500
  const httpStatus = response.code !== 0 && status === 200 ? 500 : status

  // 创建响应体
  const body = JSON.stringify(response, null, 2)
  const init = { status: httpStatus, headers: httpHeaders }

  // 返回一个新的 Response 对象
  return new Response(body, init)
}
