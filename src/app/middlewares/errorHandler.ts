import { z } from 'zod';



export const createBookSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  author: z.string({ required_error: 'Author is required' }),
  genre: z.enum(['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'], {
    required_error: 'Genre is required',
    invalid_type_error: 'Invalid genre'
  }),
  isbn: z.string({ required_error: 'ISBN is required' }),
  description: z.string().optional(),
  copies: z.number({
    required_error: 'Copies is required',
    invalid_type_error: 'Copies must be a number'
  }).min(0, 'Copies must be a non-negative number'),
  available: z.boolean().optional().default(true)
});
export const updateBookSchema = z.object({
  title: z.string({ required_error: 'Title is required' }).optional(),
  author: z.string({ required_error: 'Author is required' }).optional(),
  genre: z.enum(['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'], {
    required_error: 'Genre is required',
    invalid_type_error: 'Invalid genre'
  }).optional(),
  isbn: z.string({ required_error: 'ISBN is required' }).optional(),
  description: z.string().optional(),
  copies: z.number({
    required_error: 'Copies is required',
    invalid_type_error: 'Copies must be a number'
  }).min(0, 'Copies must be a non-negative number').optional(),
  available: z.boolean().optional().default(true)
});

export const borrowBookSchema = z.object({
  book: z.string().refine((val) => /^[a-f\d]{24}$/i.test(val), {
    message: 'Invalid book ID format',
  }),
  quantity: z.number().int().positive({ message: 'Quantity must be a positive integer' }),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'A valid due date is required',
  }),
});
export const bookIdValidation = z.object({
  bookId: z.string().refine((val) => /^[a-f\d]{24}$/i.test(val), {
    message: 'Invalid book ID format',
  })
});

export const generateValidationError = (errors : any) =>{
            return {
                    message: 'Validation failed',
                    success: false,
                    error: {
                      name: 'ValidationError',
                      errors
                    }
                  }
}

export const generateZodError = (err : any,value : any) => {
    const formattedErrors: Record<string, any> = {};
      for (const e of err.errors) {
       
        const path = e.path[0];
        formattedErrors[path] = {
          message: e.message,
          name: 'ValidatorError',
          properties: {
            message: e.message,
            type: e.code,
            ...(e.code === 'too_small' && e.minimum !== undefined ? { min: e.minimum } : {}),
            ...(e.code === 'too_big' && e.maximum !== undefined ? { max: e.maximum } : {}),
            input: e.input // add the input value from zod error
          },
          kind: e.code,
          path: path,
          value: value ? value[path] : null
        };
    }

    return {
        message: 'Validation failed',
        success: false,
        error: {
          name: 'ValidationError',
          errors: formattedErrors
        }
      };
}


export const generaleError = (err: any) => {
    return{
          message: 'Validation failed',
          success: false,
          error: {
            name: err.name || 'ServerError',
            errors: {
              general: {
                message: err.message || 'Something went wrong',
                name: err.name || 'Error',
                properties: {
                  message: err.message,
                  type: 'internal'
                },
                kind: 'internal',
                path: 'server',
                value: null
              }
            }
          }
    }
}


