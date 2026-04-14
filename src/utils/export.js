import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export const exportToExcel = (data, filename = 'export', sheetName = 'Sheet1') => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  
  const colWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.max(key.length, ...data.map(row => String(row[key] || '').length))
  }))
  worksheet['!cols'] = colWidths
  
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`)
}

export const exportToPDF = (data, filename = 'export', title = 'Reporte') => {
  const doc = new jsPDF()
  
  doc.setFontSize(18)
  doc.text(title, 14, 22)
  
  doc.setFontSize(10)
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-PE')}`, 14, 30)
  
  if (data.length > 0) {
    const headers = Object.keys(data[0])
    const rows = data.map(row => headers.map(h => row[h]))
    
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] }
    })
  }
  
  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`)
}

export const exportProductosToExcel = (productos) => {
  const data = productos.map(p => ({
    'Código': p.codigo_barras,
    'Nombre': p.nombre,
    'Categoría': p.categoria,
    'Precio': p.precio,
    'Stock': p.stock,
    'Stock Mínimo': p.stock_minimo,
    'Laboratorio': p.laboratorio || '',
    'Vencimiento': p.fecha_vencimiento || '',
    'Estado': p.estado ? 'Activo' : 'Inactivo'
  }))
  
  exportToExcel(data, 'inventario', 'Productos')
}

export const exportProductosToPDF = (productos) => {
  const data = productos.map(p => ({
    Código: p.codigo_barras,
    Nombre: p.nombre,
    Categoría: p.categoria,
    Precio: p.precio,
    Stock: p.stock,
    Estado: p.estado ? 'Activo' : 'Inactivo'
  }))
  
  exportToPDF(data, 'inventario', 'Inventario de Productos')
}

export const exportVentasToExcel = (ventas) => {
  const data = ventas.map(v => ({
    'ID': v.id,
    'Fecha': new Date(v.fecha).toLocaleString('es-PE'),
    'Total': v.total,
    'Método de Pago': v.metodo_pago,
    'Usuario': v.usuario?.nombre || v.usuario_id || ''
  }))
  
  exportToExcel(data, 'ventas', 'Ventas')
}

export const exportVentasToPDF = (ventas) => {
  const data = ventas.map(v => ({
    ID: v.id.substring(0, 8),
    Fecha: new Date(v.fecha).toLocaleDateString('es-PE'),
    Total: v.total,
    Método: v.metodo_pago
  }))
  
  exportToPDF(data, 'ventas', 'Reporte de Ventas')
}

export const exportReportToCSV = (data, filename = 'export') => {
  if (data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const val = row[h]
      return typeof val === 'string' && val.includes(',') ? `"${val}"` : val
    }).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}