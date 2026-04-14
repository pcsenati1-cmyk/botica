#!/bin/bash
echo "🚀 Iniciando Nova Salud con ngrok..."
echo ""
echo "1. Iniciando servidor de desarrollo Vite..."
npm run dev &
VITE_PID=$!
sleep 5

echo "2. Iniciando ngrok..."
npx ngrok http 5173 --host-header=localhost:5173 &

wait $VITE_PID