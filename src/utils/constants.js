export const ROLES = {
  ADMINISTRADOR: 'administrador',
  VENDEDOR: 'vendedor'
}

export const METODOS_PAGO = {
  EFECTIVO: 'EFECTIVO',
  TARJETA: 'TARJETA',
  TRANSFERENCIA: 'TRANSFERENCIA'
}

export const METODOS_PAGO_LABELS = {
  [METODOS_PAGO.EFECTIVO]: 'Efectivo',
  [METODOS_PAGO.TARJETA]: 'Tarjeta',
  [METODOS_PAGO.TRANSFERENCIA]: 'Transferencia'
}

export const ESTADOS_PRODUCTO = {
  ACTIVO: true,
  INACTIVO: false
}

export const CATEGORIAS_DEFAULT = [
  'Analgésicos',
  'Antibióticos',
  'Antiinflamatorios',
  'Antialérgicos',
  'Vitaminas',
  'Suplementos',
  'Cuidado Personal',
  'Primeros Auxilios',
  'Digestivo',
  'Respiratorio',
  'Otro'
]

export const COLORS = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  light: '#f8fafc',
  dark: '#1e293b'
}

export const ESTADOS_VENTA = {
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada',
  PENDIENTE: 'pendiente'
}

export const TABLAS = {
  USUARIOS: 'usuarios',
  PRODUCTOS: 'productos',
  VENTAS: 'ventas',
  DETALLE_VENTAS: 'detalle_ventas',
  ALERTAS: 'alertas'
}

export const MENSAJES = {
  EXITO: {
    CREADO: 'Registro creado exitosamente',
    ACTUALIZADO: 'Registro actualizado exitosamente',
    ELIMINADO: 'Registro eliminado exitosamente',
    GUARDADO: 'Cambios guardados exitosamente'
  },
  ERROR: {
    GENERAL: 'Ha ocurrido un error. Por favor, intenta de nuevo',
    CARGA: 'Error al cargar los datos',
    GUARDAR: 'Error al guardar los datos',
    ELIMINAR: 'Error al eliminar el registro',
    PERMISO: 'No tienes permisos para realizar esta acción'
  },
  CONFIRMACION: {
    ELIMINAR: '¿Estás seguro de que deseas eliminar este registro?',
    CANCELAR: '¿Estás seguro de que deseas cancelar?',
    GUARDAR: '¿Deseas guardar los cambios?'
  }
}

export const PAGINACION = {
  PAGE_SIZE default: 10,
  PAGE_SIZES: [5, 10, 25, 50, 100]
}

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TELEFONO: /^\+?[\d\s-]{9,}$/,
  CODIGO_BARRAS: /^[a-zA-Z0-9-]+$/,
  NUMERO_POSITIVO: /^[1-9]\d*$/,
  DECIMAL: /^\d+(\.\d{1,2})?$/
}

export const LIMITS = {
  NOMBRE_MAX: 100,
  DESCRIPCION_MAX: 500,
  CODIGO_MAX: 50,
  STOCK_MINIMO_DEFAULT: 5,
  PRECIO_MAX: 999999
}