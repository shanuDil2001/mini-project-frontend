import { Outlet } from "react-router-dom";
import Header from "../../components/admin/header";

function AdminLayout() {
   return (
      <div className="w-full">
         <Header />
         <div className="w-full h-full flex justify-center bg-linear-to-t from-green-100 to-white">
            <Outlet />
         </div>
      </div>
   );
}
export default AdminLayout;