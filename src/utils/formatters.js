export const formatCurrency = (amount, currency = 'PEN', locale = 'es-PE') => {
  if (amount === null || amount === undefined) return 'S/ 0.00'
  const num = Number(amount)
  if (isNaN(num)) return 'S/ 0.00'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency === 'PEN' ? 'PEN' : 'USD'
  }).format(num)
}

export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0'
  const num = Number(value)
  if (isNaN(num)) return '0'
  return num.toFixed(decimals)
}

export const formatDate = (date, format = 'short') => {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  
  if (format === 'short') {
    return d.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }
  
  if (format === 'time') {
    return d.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  if (format === 'datetime') {
    return d.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  return d.toLocaleDateString('es-PE')
}

export const formatRelativeTime = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  
  const now = new Date()
  const diff = now - d
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (seconds < 60) return 'Hace un momento'
  if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
  if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
  if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`
  
  return formatDate(date, 'short')
}

export const formatPorcentaje = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%'
  const num = Number(value)
  if (isNaN(num)) return '0%'
  return `${num.toFixed(decimals)}%`
}

export const formatTelefono = (phone) => {
  if (!phone) return '-'
  const cleaned = String(phone).replace(/\D/g, '')
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

export const capitalize = (text) => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export const titleCase = (text) => {
  if (!text) return ''
  return text.split(' ').map(capitalize).join(' ')
}

export const pluralize = (count, singular, plural) => {
  return count === 1 ? singular : plural || `${singular}s`
}