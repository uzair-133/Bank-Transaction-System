import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar';
import LoginPage from './Pages/Login/LoginPage';
import Register from './Pages/Register/Register';
import Home from './Pages/Home';
import DashBoard from './Pages/Dashboard/DashBoard';
import CreateAccount from './Pages/CreateAccount/CreateAccount';
import Transaction from './Pages/Transaction/Transaction';
import System from './Pages/SystemTransaction/System';
const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/transactions" element={<Transaction />} />
        <Route path="/system" element={<System />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App