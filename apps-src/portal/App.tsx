import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import Admin from "./pages/Admin";
import Stories from "./pages/Stories";
import StoryReader from "./pages/StoryReader";
import StoryAdmin from "./pages/StoryAdmin";
import { AudienceProvider } from "./context/AudienceContext";

const App: React.FC = () => {
  return (
    <AudienceProvider><Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/stories" element={<StoryAdmin />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/stories/:id" element={<StoryReader />} />
          </Routes>
        </main>
      </div>
    </Router></AudienceProvider>
  );
};

export default App;
