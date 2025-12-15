import axios from "axios";

const topicApiService = {
    async getAll(){
        try{
            const result = await axios.get(import.meta.env.VITE_API_URL + "/topics")
            return {
                success:true,
                message: result.data.message ?? "Lấy dữ liệu thành công",
                data: result.data?.data
            }
        }catch(err){
            let message = "Lỗi khi lấy dữ liệu chương";
            if(axios.isAxiosError(err)){
                message = err.response?.data?.message || err.message || "Lấy dữ liệu thất bại";
            }

            return {
                success:false,
                message
            }
        }
    }
}

export default topicApiService;