import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

export default function PrivateRouter(){
    const { currentUser } = useAuth();
    return currentUser ? children : <Navigate to={"/login"} replace/>
}