import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeNew from "./pages/HomeNew";
import AdminDashboard from "./pages/AdminDashboard";
import HemuDashboard from "./pages/HemuDashboard";
import BlogPlace from "./pages/BlogPlace";
import Food from "./pages/Food";
import TrekDetail from "./pages/TrekDetail";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeNew />} />
          <Route path="/admin-banjara-core" element={<AdminDashboard />} />
          <Route path="/blog/:place" element={<BlogPlace />} />
          <Route path="/food" element={<Food />} />
          <Route path="/trek/:trekId" element={<TrekDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
