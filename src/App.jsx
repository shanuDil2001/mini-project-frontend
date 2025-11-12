import { Route, Routes } from "react-router-dom"
import AdminLayout from "./pages/admin/adminLayout"
import CommonLayout from "./pages/commonLayout"
import LoginPage from "./pages/login"
import Dashboard from "./pages/admin/dashboard"
import NewFile from "./pages/admin/newFile"
import { Toaster } from "react-hot-toast"
import Home from "./pages/home"

function App() {

  return (
    <div className="w-full h-screen">
      <Routes>
        <Route path="/" element={< CommonLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="new-file" element={<NewFile />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
