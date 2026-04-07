import { Navigate } from "react-router";

const ProtectedRoute = ({children}) => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'

    return (
        isLoggedIn ? children : <Navigate to='/login'/>
    )
}
export default ProtectedRoute;