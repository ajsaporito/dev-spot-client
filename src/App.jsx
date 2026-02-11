import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Toaster position="top-right" />
        <Outlet />
      </main>
    </div>
  );
}

export default App;
