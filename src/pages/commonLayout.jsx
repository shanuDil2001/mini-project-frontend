import { Outlet } from "react-router-dom";
import Header from "../components/client/header";

function CommonLayout() {
   return (
      <div className="w-full">
         <div className="w-full h-full flex justify-center bg-linear-to-t from-green-100 to-white">
            <Header />
            <Outlet />
         </div>
      </div>
   );
}
export default CommonLayout;