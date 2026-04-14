import Swal from 'sweetalert2'

export function useSweetAlert() {
  const showAlert = (options) => {
    return Swal.fire({
      toast: true,
      position: 'top-end',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      ...options
    })
  }

  const confirm = async (options) => {
    return Swal.fire({
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      ...options
    })
  }

  const success = (title, text) => {
    return showAlert({
      icon: 'success',
      title,
      text,
      toast: true,
      position: 'top-end'
    })
  }

  const error = (title, text) => {
    return showAlert({
      icon: 'error',
      title,
      text,
      toast: true,
      position: 'top-end'
    })
  }

  const warning = (title, text) => {
    return showAlert({
      icon: 'warning',
      title,
      text,
      toast: true,
      position: 'top-end'
    })
  }

  const info = (title, text) => {
    return showAlert({
      icon: 'info',
      title,
      text,
      toast: true,
      position: 'top-end'
    })
  }

  return { showAlert, confirm, success, error, warning, info }
}