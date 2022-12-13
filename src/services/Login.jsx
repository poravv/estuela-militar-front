import axios from 'axios';

const baseURL = 'https://api-rest-automotors.onrender.com/sisweb/api/usuario/login/';

const Login = async (credentials) => {
    const { data } = await axios.post(baseURL, credentials);
    return data;
}

export default Login;
