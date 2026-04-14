import { z } from 'zod'

export const productoSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  codigo_barras: z.string()
    .min(1, 'El código de barras es requerido')
    .max(50, 'El código no puede exceder 50 caracteres'),
  descripcion: z.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
  categoria: z.string()
    .min(1, 'La categoría es requerida')
    .max(50, 'La categoría no puede exceder 50 caracteres'),
  precio: z.number()
    .positive('El precio debe ser mayor a 0')
    .max(999999, 'El precio no puede exceder 999999'),
  stock: z.number()
    .int('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo'),
  stock_minimo: z.number()
    .int('El stock mínimo debe ser un número entero')
    .min(0, 'El stock mínimo no puede ser negativo')
    .default(5),
  laboratorio: z.string()
    .max(100, 'El laboratorio no puede exceder 100 caracteres')
    .optional(),
  fecha_vencimiento: z.string()
    .refine((val) => {
      if (!val) return true
      return new Date(val) > new Date()
    }, { message: 'La fecha de vencimiento debe ser futura' })
    .optional(),
  estado: z.boolean().default(true)
})

export const usuarioSchema = z.object({
  email: z.string()
    .email('Correo electrónico inválido'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  rol: z.enum(['administrador', 'vendedor'], {
    errorMap: () => ({ message: 'Rol inválido' })
  })
})

export const loginSchema = z.object({
  email: z.string()
    .email('Correo electrónico inválido'),
  password: z.string()
    .min(1, 'La contraseña es requerida')
})

export const ventaSchema = z.object({
  usuario_id: z.string().uuid('ID de usuario inválido'),
  metodo_pago: z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA'], {
    errorMap: () => ({ message: 'Método de pago inválido' })
  }),
  items: z.array(z.object({
    id: z.string().uuid('ID de producto inválido'),
    cantidad: z.number()
      .int('La cantidad debe ser un número entero')
      .positive('La cantidad debe ser mayor a 0'),
    precio: z.number()
      .positive('El precio debe ser mayor a 0')
  })).min(1, 'Debe agregar al menos un producto')
})

export function validateField(schema, field, value) {
  const result = schema.safeParse({ [field]: value })
  if (!result.success) {
    return {
      isValid: false,
      error: result.error.errors[0]?.message || 'Valor inválido'
    }
  }
  return { isValid: true, error: null }
}

export function validateForm(schema, data) {
  const result = schema.safeParse(data)
  if (!result.success) {
    const errors = result.error.errors.reduce((acc, err) => {
      const path = err.path[0]
      acc[path] = err.message
      return acc
    }, {})
    return { isValid: false, errors, message: 'Validation failed' }
  }
  return { isValid: true, errors: null, data: result.data }
}

export function getFieldError(schema, fieldPath, value) {
  const fieldSchema = schema.shape[fieldPath]
  if (!fieldSchema) return null
  
  const result = fieldSchema.safeParse(value)
  if (!result.success) {
    return result.error.errors[0]?.message || 'Valor inválido'
  }
  return null
}