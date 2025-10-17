import React from 'react'
import { Routes, Route } from 'react-router-dom'
import CreateLetter from './pages/CreateLetter'
import ViewLetter from './pages/ViewLetter'
import './styles/App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<CreateLetter />} />
        <Route path="/letter/:id" element={<ViewLetter />} />
      </Routes>
    </div>
  )
}

export default App
