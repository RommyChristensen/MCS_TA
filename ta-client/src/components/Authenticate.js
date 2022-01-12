import { Navigate } from "react-router";
import encryptStorage from "../services/Storage";

const useAuth = () => {
    const value = encryptStorage.getItem('admin-session-key');
    return value != null;
}

const Authenticate = ({ children }) => {
    const auth = useAuth();
    return auth ? children : <Navigate to="/admin" />;
}

export default Authenticate;