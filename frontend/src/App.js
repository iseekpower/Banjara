import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import BlogPlace from "./pages/BlogPlace";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-banjara-core" element={<AdminDashboard />} />
          <Route path="/blog/:place" element={<BlogPlace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
