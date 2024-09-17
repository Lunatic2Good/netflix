import axios from "axios";
import Cookie from "universal-cookie";

const cookie = new Cookie();

const useAuth = () => {
    const login = async ({email, password}: {email: String; password: String}) => {
        const response = await axios.post("http://localhost:3000/auth/login", {
            email, password
        })
        const { token } = response.data;
        cookie.set("session_token", token);
        return response.data;
    };
    
    const signup = async ({email, password, username}: {email: String; password: String; username: String}) => {
        const response = await axios.post("http://localhost:3000/auth/signup", {
            email, password, username
        })
        const { token } = response.data;
        cookie.set("session_token", token);
        return response.data;
    };
    
    const fetchUser = () => {};

    return {login, signup, fetchUser};
}

export default useAuth;