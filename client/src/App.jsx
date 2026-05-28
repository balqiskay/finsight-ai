import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Savings from "./pages/Savings";
import Recurring from "./pages/Recurring";
import Landing from "./pages/Landing";
import ChatAssistant from "./pages/ChatAssistant";

function App() {

  const token =
    localStorage.getItem("token");

  return (
    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={
          token
            ? <Dashboard />
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/transactions"
        element={
          token
            ? <Transactions />
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/analytics"
        element={
          token
            ? <Analytics />
            : <Navigate to="/login" />
        }
      />

      <Route
      path="*"
      element={
        token
        ? <Navigate to="/dashboard" />
        : <Navigate to="/login" />
      }
      />

      <Route
      path="/savings"
      element={
       <ProtectedRoute>
        <Savings />
       </ProtectedRoute>
      }
      />

      <Route
        path="/recurring"
        element={
         <ProtectedRoute>
          <Recurring />
         </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/assistant"
        element={
        <ProtectedRoute>
          <ChatAssistant />
        </ProtectedRoute>
        }
      />

    </Routes>
    
  );
}

export default App;