import { createResponse } from '@/share/createResponse'

describe('createResponse', () => {
  test('should create a successful response with data', () => {
    const data = { name: 'Test User', age: 30 }
    const response = createResponse(data)

    expect(response.status).toBe(200)
    return response.json().then((json) => {
      expect(json).toEqual({
        code: 0,
        success: true,
        data,
        message: 'Success',
      })
    })
  })

  test('should create a failure response with an error', () => {
    const error = new Error('Test error')
    const response = createResponse(error)

    expect(response.status).toBe(500)
    return response.json().then((json) => {
      expect(json).toEqual({
        code: 500,
        success: false,
        data: null,
        message: 'Test error',
      })
    })
  })

  test('should use the provided options to override defaults', () => {
    const data = { name: 'Test User', age: 30 }
    const options = { code: 400, status: 400, message: 'Bad Request' }
    const response = createResponse(data, options)

    expect(response.status).toBe(400)
    return response.json().then((json) => {
      expect(json).toEqual({
        code: 400,
        success: false,
        data: null,
        message: 'Bad Request',
      })
    })
  })

  test('should return 500 status if code is not 0 and status is 200', () => {
    const data = { name: 'Test User', age: 30 }
    const options = { code: 123 }
    const response = createResponse(data, options)

    expect(response.status).toBe(500)
    return response.json().then((json) => {
      expect(json).toEqual({
        code: 123,
        success: false,
        data: null,
        message: 'Failed',
      })
    })
  })

  test('should handle empty message with success response', () => {
    const data = { name: 'Test User' }
    const response = createResponse(data, { message: '' })

    expect(response.status).toBe(200)
    return response.json().then((json) => {
      expect(json).toEqual({
        code: 0,
        success: true,
        data,
        message: 'Success',
      })
    })
  })

  test('should handle empty message with error response', () => {
    const error = new Error('')
    const response = createResponse(error)

    expect(response.status).toBe(500)
    return response.json().then((json) => {
      expect(json).toEqual({
        code: 500,
        success: false,
        data: null,
        message: 'An error occurred',
      })
    })
  })
})
