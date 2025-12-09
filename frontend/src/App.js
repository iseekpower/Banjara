import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeNew from "./pages/HomeNew";
import AdminDashboard from "./pages/AdminDashboard";
import HemuDashboard from "./pages/HemuDashboard";
import BlogPlace from "./pages/BlogPlace";
import Food from "./pages/Food";
import TrekDetail from "./pages/TrekDetail";
import MyOrders from "./pages/MyOrders";
import Treks from "./pages/Treks";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import QRCodePage from "./pages/QRCode";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Toaster position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeNew />} />
            <Route path="/treks" element={<Treks />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/qr-code" element={<QRCodePage />} />
            <Route path="/admin-banjara-core" element={<AdminDashboard />} />
            <Route path="/hemu-dashboard" element={<HemuDashboard />} />
            <Route path="/blog/:place" element={<BlogPlace />} />
            <Route path="/food" element={<Food />} />
            <Route path="/trek/:trekId" element={<TrekDetail />} />
            <Route path="/my-orders" element={<MyOrders />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
