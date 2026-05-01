import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';

// Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import CreateProperty from './pages/CreateProperty';
import PaymentSuccess from './pages/PaymentSuccess';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';
import MobileNav from './components/MobileNav';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PropertyProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pb-20 md:pb-0">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/properties/create" element={<CreateProperty />} />
                <Route path="/properties/:id" element={<PropertyDetails />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
              </Routes>
            </main>
            <Footer />
            <MobileNav />
            <ChatbotWidget />
            <Toaster position="top-right" />
          </div>
        </PropertyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
