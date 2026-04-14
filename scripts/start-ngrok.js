import { spawn } from 'child_process'
import { connect } from 'ngrok'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function start() {
  console.log('🚀 Iniciando Nova Salud con ngrok...\n')

  console.log('📦 Iniciando servidor Vite...')
  const vite = spawn('npx', ['vite'], { 
    stdio: 'inherit',
    shell: true 
  })

  await delay(5000)

  console.log('🔗 Conectando ngrok...')
  try {
    const url = await connect({
      addr: 5173,
      proto: 'http',
      region: 'us'
    })
    console.log(`\n✅ URL pública: ${url}`)
    console.log('\nPresiona Ctrl+C para detener\n')
  } catch (err) {
    console.error('❌ Error de ngrok:', err.message)
  }
}

start()