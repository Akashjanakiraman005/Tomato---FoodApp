import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import {Routes, Route, Navigate } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Tables from './pages/Tables/Tables'
import Finance from './pages/Finance/Finance'
  import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <hr/>
      <div className="app-content">
        <Sidebar/>
        <Routes>
        <Route path="/" element={<Navigate to="/add" replace />} />
        <Route path="/add" element={<Add url={url} />} />
        <Route path="/list" element={<List url={url} />} />
        <Route path="/orders" element={<Orders url={url} />} />
        <Route path="/tables" element={<Tables url={url} />} />
        <Route path="/finance" element={<Finance url={url} />} />
        </Routes>
      </div>
      
    </div>
  )
}

export default App
