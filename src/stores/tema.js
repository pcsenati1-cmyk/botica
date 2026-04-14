import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useTemaStore = defineStore('tema', () => {
  const darkMode = ref(false)
  const mounted = ref(false)

  const initTema = () => {
    const stored = localStorage.getItem('tema')
    if (stored) {
      darkMode.value = stored === 'dark'
    } else {
      darkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTema()
    mounted.value = true
  }

  const applyTema = () => {
    if (darkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    localStorage.setItem('tema', darkMode.value ? 'dark' : 'light')
    applyTema()
  }

  const setDarkMode = (value) => {
    darkMode.value = value
    localStorage.setItem('tema', value ? 'dark' : 'light')
    applyTema()
  }

  watch(darkMode, applyTema)

  return {
    darkMode,
    mounted,
    initTema,
    toggleDarkMode,
    setDarkMode
  }
})