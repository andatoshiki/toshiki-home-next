import { notFound } from 'next/navigation'

export class AppError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.statusCode = statusCode
    this.name = 'AppError'
  }
}

export function throwHttpError(statusCode: number, message?: string): never {
  switch (statusCode) {
    case 404:
      notFound()
    default:
      throw new AppError(message || 'An error occurred', statusCode)
  }
}
