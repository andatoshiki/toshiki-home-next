export const ERROR_MESSAGES = {
  400: {
    title: 'Bad Request',
    description: 'That is a bad request, did you'
  },
  401: {
    title: 'Unauthorized',
    description:
      "This page requires some authorization stuff, or maybe you can't just access this."
  },
  403: {
    title: 'Forbidden',
    description: "Maybe you shouldn't be here!"
  },
  404: {
    title: 'Page Not Found',
    description: 'Are you sure you entered a right URL?'
  },
  408: {
    title: 'Request Timeout',
    description: 'The request took too long to complete. Please try again.'
  },
  429: {
    title: 'Too Many Requests',
    description:
      'You are making too many requests. Please slow down and try again later.'
  },
  500: {
    title: 'Internal Server Error',
    description:
      "Lucky. This is not related to you. It's my fault. Please reach me out so that I can fix this issue."
  },
  502: {
    title: 'Bad Gateway',
    description:
      'The server received an invalid response from the upstream server.'
  },
  503: {
    title: 'Service Unavailable',
    description:
      'The service is temporarily unavailable. Please try again later.'
  },
  504: {
    title: 'Gateway Timeout',
    description: 'The server took too long to respond. Please try again later.'
  },
  509: {
    title: 'Bandwidth Limit Exceeded',
    description:
      'The site has exceeded its bandwidth limit. Please try again later.'
  }
} as const

export type ErrorCode = keyof typeof ERROR_MESSAGES
