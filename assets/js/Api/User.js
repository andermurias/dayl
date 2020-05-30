import client from "../Common/Client";

export const registerUser = ({token}) => client.post('/api/auth/google', {token: token});