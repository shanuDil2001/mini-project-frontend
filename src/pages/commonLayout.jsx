import { Outlet } from "react-router-dom";

function CommonLayout() {
   return (
      <div className="w-full">
         <div className="w-full h-full flex justify-center bg-linear-to-t from-green-100 to-white">
            <Outlet />
         </div>
      </div>
   );
}
export default CommonLayout;