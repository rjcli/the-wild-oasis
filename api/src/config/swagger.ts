import { OpenAPIV3 } from 'openapi-types';

const errorResponse: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    status: { type: 'string', example: 'fail' },
    message: { type: 'string', example: 'Error message' },
  },
};

const userObject: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    email: { type: 'string', format: 'email', example: 'user@example.com' },
    fullName: { type: 'string', example: 'Jane Doe' },
    avatar: {
      type: 'string',
      nullable: true,
      example: 'public/uploads/avatars/avatar.jpg',
    },
    role: { type: 'string', example: 'user' },
    createdAt: { type: 'string', format: 'date-time' },
  },
};

const cabinObject: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    name: { type: 'string', example: 'Ocean Breeze' },
    maxCapacity: { type: 'integer', example: 4 },
    regularPrice: { type: 'number', example: 250 },
    discount: { type: 'number', example: 25 },
    description: {
      type: 'string',
      nullable: true,
      example: 'A gorgeous cabin by the sea.',
    },
    image: {
      type: 'string',
      nullable: true,
      example: 'public/uploads/cabins/cabin.jpg',
    },
    createdAt: { type: 'string', format: 'date-time' },
  },
};

const guestObject: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    fullName: { type: 'string', example: 'John Smith' },
    email: { type: 'string', format: 'email', example: 'john@example.com' },
    nationality: { type: 'string', nullable: true, example: 'Irish' },
    nationalId: { type: 'string', nullable: true, example: 'AB123456' },
    countryFlag: {
      type: 'string',
      nullable: true,
      example: 'https://flagcdn.com/ie.svg',
    },
    createdAt: { type: 'string', format: 'date-time' },
  },
};

const bookingObject: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    startDate: { type: 'string', format: 'date-time' },
    endDate: { type: 'string', format: 'date-time' },
    numNights: { type: 'integer', example: 3 },
    numGuests: { type: 'integer', example: 2 },
    cabinId: { type: 'integer', example: 1 },
    guestId: { type: 'integer', example: 1 },
    hasBreakfast: { type: 'boolean', example: false },
    observations: {
      type: 'string',
      nullable: true,
      example: 'Late check-in requested.',
    },
    isPaid: { type: 'boolean', example: false },
    totalPrice: { type: 'number', example: 750 },
    cabinPrice: { type: 'number', example: 750 },
    extrasPrice: { type: 'number', example: 0 },
    status: {
      type: 'string',
      enum: ['unconfirmed', 'checked_in', 'checked_out'],
      example: 'unconfirmed',
    },
    createdAt: { type: 'string', format: 'date-time' },
    cabin: { $ref: '#/components/schemas/Cabin' },
    guest: { $ref: '#/components/schemas/Guest' },
  },
};

const settingsObject: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    minBookingLength: { type: 'integer', example: 1 },
    maxBookingLength: { type: 'integer', example: 30 },
    maxGuestsPerBooking: { type: 'integer', example: 8 },
    breakfastPrice: { type: 'number', example: 15 },
  },
};

const idParam: OpenAPIV3.ParameterObject = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer' },
  description: 'Record ID',
};

export const swaggerDocument: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: 'Wild Oasis Hotel Management API',
    version: '1.0.0',
    description:
      'REST API for the Wild Oasis hotel management system. Handles authentication, cabin management, bookings, guests, and settings.',
    contact: {
      name: 'Wild Oasis',
    },
  },
  servers: [{ url: '/api/v1', description: 'API v1' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT access token obtained from POST /auth/login',
      },
    },
    schemas: {
      Error: errorResponse,
      User: userObject,
      Cabin: cabinObject,
      Guest: guestObject,
      Booking: bookingObject,
      Settings: settingsObject,
    },
  },

  paths: {
    // ── Health ──────────────────────────────────────────────────────────────
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        description: 'Returns 200 if the server is running.',
        responses: {
          '200': {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    } as OpenAPIV3.PathItemObject,

    // ── Auth ─────────────────────────────────────────────────────────────────

    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        description:
          'Authenticate with email and password. Returns access and refresh tokens.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'admin@wildoasis.com',
                  },
                  password: {
                    type: 'string',
                    minLength: 1,
                    example: 'password123',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    } as OpenAPIV3.PathItemObject,

    '/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Sign up',
        description: 'Register a new user account.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'fullName'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'newuser@example.com',
                  },
                  password: {
                    type: 'string',
                    minLength: 8,
                    example: 'securePass1',
                  },
                  fullName: {
                    type: 'string',
                    minLength: 2,
                    example: 'Jane Doe',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Account created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '409': {
            description: 'Email already in use',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    } as OpenAPIV3.PathItemObject,

    '/auth/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        description: 'Exchange a valid refresh token for a new access token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string', example: 'eyJhbGc...' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'New access token issued',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    accessToken: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Invalid or expired refresh token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    } as OpenAPIV3.PathItemObject,

    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Current authenticated user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    } as OpenAPIV3.PathItemObject,

    '/auth/update-me': {
      patch: {
        tags: ['Auth'],
        summary: 'Update profile',
        description:
          "Update the authenticated user's full name and/or avatar image.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: false,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  fullName: {
                    type: 'string',
                    minLength: 2,
                    example: 'Jane Updated',
                  },
                  avatar: {
                    type: 'string',
                    format: 'binary',
                    description: 'Avatar image file (max 5 MB)',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Profile updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    } as OpenAPIV3.PathItemObject,

    '/auth/update-password': {
      patch: {
        tags: ['Auth'],
        summary: 'Update password',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['currentPassword', 'newPassword'],
                properties: {
                  currentPassword: {
                    type: 'string',
                    minLength: 1,
                    example: 'oldPass123',
                  },
                  newPassword: {
                    type: 'string',
                    minLength: 8,
                    example: 'newPass456',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Password changed, new tokens issued',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error or wrong current password',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    } as OpenAPIV3.PathItemObject,

    // ── Cabins ────────────────────────────────────────────────────────────────

    '/cabins': {
      get: {
        tags: ['Cabins'],
        summary: 'List all cabins',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Array of cabins',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    results: { type: 'integer', example: 8 },
                    data: {
                      type: 'object',
                      properties: {
                        cabins: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Cabin' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Cabins'],
        summary: 'Create a cabin',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['name', 'maxCapacity', 'regularPrice'],
                properties: {
                  name: { type: 'string', example: 'Forest Hideaway' },
                  maxCapacity: { type: 'integer', example: 2 },
                  regularPrice: { type: 'number', example: 150 },
                  discount: { type: 'number', example: 0 },
                  description: {
                    type: 'string',
                    example: 'A peaceful cabin in the woods.',
                  },
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Cabin image (max 5 MB)',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Cabin created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        cabin: { $ref: '#/components/schemas/Cabin' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    } as OpenAPIV3.PathItemObject,

    '/cabins/{id}': {
      parameters: [idParam],
      get: {
        tags: ['Cabins'],
        summary: 'Get a cabin',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Cabin found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        cabin: { $ref: '#/components/schemas/Cabin' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Cabin not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      patch: {
        tags: ['Cabins'],
        summary: 'Update a cabin',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: false,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Forest Hideaway' },
                  maxCapacity: { type: 'integer', example: 2 },
                  regularPrice: { type: 'number', example: 150 },
                  discount: { type: 'number', example: 0 },
                  description: {
                    type: 'string',
                    example: 'Updated description.',
                  },
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Replacement cabin image',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Cabin updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        cabin: { $ref: '#/components/schemas/Cabin' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Cabin not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Cabins'],
        summary: 'Delete a cabin',
        security: [{ bearerAuth: [] }],
        responses: {
          '204': { description: 'Cabin deleted' },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Cabin not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    } as OpenAPIV3.PathItemObject,

    // ── Bookings ──────────────────────────────────────────────────────────────

    '/bookings': {
      get: {
        tags: ['Bookings'],
        summary: 'List all bookings',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'status',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['unconfirmed', 'checked_in', 'checked_out'],
            },
            description: 'Filter by status',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: { type: 'string', example: 'startDate' },
            description: 'Field to sort by',
          },
          {
            name: 'sortDir',
            in: 'query',
            schema: { type: 'string', enum: ['asc', 'desc'] },
            description: 'Sort direction',
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', example: 1 },
            description: 'Page number',
          },
          {
            name: 'pageSize',
            in: 'query',
            schema: { type: 'integer', example: 10 },
            description: 'Items per page',
          },
        ],
        responses: {
          '200': {
            description: 'Paginated list of bookings',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    results: { type: 'integer' },
                    count: { type: 'integer', description: 'Total records' },
                    data: {
                      type: 'object',
                      properties: {
                        bookings: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Booking' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Bookings'],
        summary: 'Create a booking',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: [
                  'startDate',
                  'endDate',
                  'numNights',
                  'numGuests',
                  'cabinId',
                  'guestId',
                  'totalPrice',
                ],
                properties: {
                  startDate: {
                    type: 'string',
                    format: 'date-time',
                    example: '2026-06-01T00:00:00.000Z',
                  },
                  endDate: {
                    type: 'string',
                    format: 'date-time',
                    example: '2026-06-04T00:00:00.000Z',
                  },
                  numNights: { type: 'integer', example: 3 },
                  numGuests: { type: 'integer', example: 2 },
                  cabinId: { type: 'integer', example: 1 },
                  guestId: { type: 'integer', example: 1 },
                  hasBreakfast: { type: 'boolean', example: false },
                  observations: { type: 'string', example: 'Late arrival.' },
                  isPaid: { type: 'boolean', example: false },
                  totalPrice: { type: 'number', example: 750 },
                  cabinPrice: { type: 'number', example: 750 },
                  extrasPrice: { type: 'number', example: 0 },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Booking created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        booking: { $ref: '#/components/schemas/Booking' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    } as OpenAPIV3.PathItemObject,

    '/bookings/today-activity': {
      get: {
        tags: ['Bookings'],
        summary: "Today's activity",
        description:
          'Returns bookings with check-ins or check-outs scheduled for today.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: "Today's activity list",
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        bookings: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Booking' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    } as OpenAPIV3.PathItemObject,

    '/bookings/after-date': {
      get: {
        tags: ['Bookings'],
        summary: 'Bookings created after a date',
        description:
          'Returns bookings whose `createdAt` is on or after the given date.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'date',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'date-time' },
            description: 'ISO 8601 date string',
          },
        ],
        responses: {
          '200': {
            description: 'Bookings after the given date',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        bookings: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Booking' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Missing or invalid date query param',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    } as OpenAPIV3.PathItemObject,

    '/bookings/stays-after-date': {
      get: {
        tags: ['Bookings'],
        summary: 'Stays after a date',
        description:
          'Returns bookings (stays) whose `startDate` is on or after the given date.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'date',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'date-time' },
            description: 'ISO 8601 date string',
          },
        ],
        responses: {
          '200': {
            description: 'Stays after the given date',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        bookings: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Booking' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Missing or invalid date query param',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    } as OpenAPIV3.PathItemObject,

    '/bookings/{id}': {
      parameters: [idParam],
      get: {
        tags: ['Bookings'],
        summary: 'Get a booking',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Booking details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        booking: { $ref: '#/components/schemas/Booking' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Booking not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      patch: {
        tags: ['Bookings'],
        summary: 'Update a booking',
        description:
          'Partially update booking fields (e.g. check-in, check-out, payment status).',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    enum: ['unconfirmed', 'checked_in', 'checked_out'],
                  },
                  isPaid: { type: 'boolean' },
                  hasBreakfast: { type: 'boolean' },
                  extrasPrice: { type: 'number' },
                  totalPrice: { type: 'number' },
                  observations: { type: 'string' },
                  numGuests: { type: 'integer' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Booking updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        booking: { $ref: '#/components/schemas/Booking' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Booking not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Bookings'],
        summary: 'Delete a booking',
        security: [{ bearerAuth: [] }],
        responses: {
          '204': { description: 'Booking deleted' },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Booking not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    } as OpenAPIV3.PathItemObject,

    // ── Guests ────────────────────────────────────────────────────────────────

    '/guests': {
      get: {
        tags: ['Guests'],
        summary: 'List all guests',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Array of guests',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    results: { type: 'integer' },
                    data: {
                      type: 'object',
                      properties: {
                        guests: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Guest' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Guests'],
        summary: 'Create a guest',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fullName', 'email'],
                properties: {
                  fullName: {
                    type: 'string',
                    minLength: 2,
                    example: 'John Smith',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'john@example.com',
                  },
                  nationality: { type: 'string', example: 'Irish' },
                  nationalId: { type: 'string', example: 'AB123456' },
                  countryFlag: {
                    type: 'string',
                    format: 'uri',
                    example: 'https://flagcdn.com/ie.svg',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Guest created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        guest: { $ref: '#/components/schemas/Guest' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    } as OpenAPIV3.PathItemObject,

    '/guests/{id}': {
      parameters: [idParam],
      get: {
        tags: ['Guests'],
        summary: 'Get a guest',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Guest details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        guest: { $ref: '#/components/schemas/Guest' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Guest not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      patch: {
        tags: ['Guests'],
        summary: 'Update a guest',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  fullName: { type: 'string', minLength: 2 },
                  email: { type: 'string', format: 'email' },
                  nationality: { type: 'string' },
                  nationalId: { type: 'string' },
                  countryFlag: { type: 'string', format: 'uri' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Guest updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        guest: { $ref: '#/components/schemas/Guest' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Guest not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Guests'],
        summary: 'Delete a guest',
        security: [{ bearerAuth: [] }],
        responses: {
          '204': { description: 'Guest deleted' },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Guest not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    } as OpenAPIV3.PathItemObject,

    // ── Settings ──────────────────────────────────────────────────────────────

    '/settings': {
      get: {
        tags: ['Settings'],
        summary: 'Get app settings',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Current settings',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        settings: { $ref: '#/components/schemas/Settings' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      patch: {
        tags: ['Settings'],
        summary: 'Update app settings',
        description: 'At least one field must be provided.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  minBookingLength: { type: 'integer', minimum: 1, example: 1 },
                  maxBookingLength: {
                    type: 'integer',
                    minimum: 1,
                    example: 60,
                  },
                  maxGuestsPerBooking: {
                    type: 'integer',
                    minimum: 1,
                    example: 10,
                  },
                  breakfastPrice: { type: 'number', minimum: 0, example: 15 },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Settings updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        settings: { $ref: '#/components/schemas/Settings' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    } as OpenAPIV3.PathItemObject,
  },

  tags: [
    { name: 'Health', description: 'Server health' },
    { name: 'Auth', description: 'Authentication & user profile' },
    { name: 'Cabins', description: 'Cabin management' },
    { name: 'Bookings', description: 'Booking management' },
    { name: 'Guests', description: 'Guest management' },
    { name: 'Settings', description: 'Application settings' },
  ],
};
