import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";

const LoginForm = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email === 'madhu' && password === '123') {
            sessionStorage.setItem('isLoggedIn', true);
            sessionStorage.setItem('role', 'admin')
            navigate('/admin')
            toast.success("Login success!!")
        }
        else {
            try {
                const { data } = await axios.post('http://localhost:3000/auth/login',
                    {
                        email: email,
                        password: password
                    })
                console.log("response => ", data)
                toast.success(data.message)
                sessionStorage.setItem('token', data.token)
                sessionStorage.setItem('isLoggedIn', true)
                sessionStorage.setItem('user_id', data.user.user_id)
                sessionStorage.setItem('mongo_id', data.user._id)
                sessionStorage.setItem('username', data.user.name)
                sessionStorage.setItem('email', data.user.email)
                sessionStorage.setItem('role', data.user.role)
                navigate('/questions')
            }
            catch (err) {
                toast.error("Login failed")
                navigate('/login')
            }
        }
    }

    return (
        <>
            <form className="flex flex-col rounded-lg  w-[450px] mt-20 mx-auto px-10 py-10 gap-7 border-1 border-indigo-950 shadow-black/20 shadow-lg">
                <h1 className="text-3xl font-bold text-center gap-5 text-indigo-950">Login</h1>
                <div className="flex flex-col gap-5">
                    <input type="text"
                        placeholder="Enter Email ID"
                        value={email}
                        onChange={handleEmailChange}
                        className="p-3 border-1 border-indigo-950/50 rounded-lg text-lg">
                    </input>
                    <input type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="p-3 border-1 border-indigo-950/50 rounded-lg text-lg">

                    </input>
                </div>
                <button type="button" className="mx-auto py-3 w-[40%] bg-indigo-950 text-white rounded-lg text-xl font-bold"
                    onClick={handleSubmit}>
                    Login
                </button>

                <h1 className="text-md text-black/40 ">Don't have an account? <Link to="/signup" className="text-black/70 font-bold underline underline-offset-[5px]">Sign in</Link> </h1>
            </form>
        </>
    )
}

export default LoginForm;

