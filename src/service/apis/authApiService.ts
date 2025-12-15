import axios from "axios";
import type { LoginResponse, UserGeneral } from "../../types/authType";

const authApiService = {
    async login(account:string,password:string): Promise<LoginResponse>{
        try{
            const payload = {
                username: account,
                passwords: password
            }

            const result = await axios.post(
                import.meta.env.VITE_API_URL + "/users/login",
                payload)

            return {
                success:true,
                message: result.data.message ?? "Đăng nhập thành công",
                token: result.data?.data
            }
        }catch(err:unknown){
            let message = "Lỗi khi đăng nhập";
            if(axios.isAxiosError(err)){
                message = err.response?.data?.message || err.message || "Đăng nhập thất bại";
            }

            return {
                success:false,
                message
            }
        }
    },
    async verify(token:string):Promise<{success:boolean,message:string,data?:UserGeneral}>{
        try{
            const result = await axios.get(import.meta.env.VITE_API_URL + `/users/token-verify?tk=${token}`)

            return {
                success:true,
                message: result.data.message ?? "Xác thực thành công",
                data: result.data?.data
            }
        }catch(err:unknown){
            let message = "Lỗi khi xác thực";
            if(axios.isAxiosError(err)){
                message = err.response?.data?.message || err.message || "Xác thực thất bại";
            }

            return {
                success:false,
                message
            }
        }
    }
}

export default authApiService;