import { ref } from 'vue'

export function useToast() {
  const toast = ref({ show: false, message: '', type: 'success' })

  function showToast(message, type = 'success', duration = 3000) {
    toast.value = { show: true, message, type }
    setTimeout(() => { toast.value.show = false }, duration)
  }

  function hideToast() {
    toast.value.show = false
  }

  return { toast, showToast, hideToast }
}
