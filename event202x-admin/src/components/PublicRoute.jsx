import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

export default function PublicRoute(){
    const { currentUser } = useAuth();
    return currentUser ? <Navigate to="/home" replace /> : <Outlet />

}