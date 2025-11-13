import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import GamePage from '@/Pages/Game.jsx'
import LeaderboardPage from '@/Pages/Leaderboard.jsx'

const queryClient = new QueryClient()

import './styles.css'

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GamePage/>} />
        <Route path="/leaderboard" element={<LeaderboardPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
