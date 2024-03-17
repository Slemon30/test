import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from "./components/login";
import Dashboard from "./components/dashboard";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;