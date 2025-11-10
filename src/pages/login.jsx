import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";



function LoginPage() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();

   async function handleLogin() {
      try {
         const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/login`, {
            email: email,
            password: password
         });
         toast.success(response.data.message);
         console.log(response.data);

         localStorage.setItem("token", response.data.token);

         navigate("/dashboard");
      } catch (error) {
         toast.error(error.response.data.message);
      }

   }

   return (
      <div className="w-full h-screen bg-linear-to-b from-green-100 to-white flex flex-col justify-center items-center gap-4">
         <h1 className="font-bold text-2xl text-yellow-300 text-shadow-md mb-2 md:text-3xl">Navindu <span className="text-blue-300">Deshan</span></h1>

         <div className="w-[90%] border border-green-200 p-5 rounded-lg flex flex-col justify-center items-center gap-4 md:w-[500px]">
            <input
               className="bg-white border border-blue-200 p-2 rounded-md w-full"
               type="email"
               placeholder="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
            />
            <input
               className="bg-white border border-blue-200 p-2 rounded-md w-full"
               type="password"
               placeholder="Password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
            />

            <button
               onClick={handleLogin}
               className="bg-yellow-300 text-white p-2 rounded-md w-full hover:bg-yellow-500 transition-colors">Login</button>
         </div>
      </div>
   );
}

export default LoginPage;