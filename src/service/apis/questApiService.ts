import axios from "axios";
import type { ApiResponse } from "../../types/apiResponseType";
import axiosClient from "./axiosClient";
import type { questContentTypeRequest, questRequestType } from "../../types/questType";

const handleError = (err: unknown, defaultMsg: string): ApiResponse<never> => {
  let message = defaultMsg;

  if (axios.isAxiosError(err)) {
    message =
      err.response?.data?.message ||
      err.message ||
      defaultMsg;
  }

  return {
    success: false,
    message
  };
};

const questApiService = {
    async create(data:questRequestType){
        try{
            const result = await axios.post(import.meta.env.VITE_API_URL + "/quests",data)
            return {
                success:true,
                message: result.data.message ?? "Tạo màn chơi mới thành công",
                data: result.data?.data
            }
        }catch(err){
            let message = "Lỗi khi tạo màn chơi";
            if(axios.isAxiosError(err)){
                message = err.response?.data?.message || err.message || "Tạo màn chơi thất bại";
            }

            return {
                success:false,
                message
            }
        }
    },
    async update(questId:string,data:questRequestType){
        try{
            const result = await axios.patch(import.meta.env.VITE_API_URL + "/quests/"+ questId,data)
            console.log(result)
            if(result.data.status != 200){
                throw result;
            }
            return {
                success:true,
                message: result.data.message ?? "Tạo màn chơi mới thành công",
                data: result.data?.data
            }
        }catch(err){
            let message = (err as any).data?.message || "Tạo màn chơi thất bại";

            return {
                success:false,
                message
            }
        }
    },
    async getAll(){
        try{
            const result = await axios.get(import.meta.env.VITE_API_URL + "/quests")
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
    },
    async getById(id: string): Promise<ApiResponse<any>> {
        try {
            const res = await axiosClient.get(`/quests/${id}`);
            return { 
                success: true, 
                message: "Thành công", 
                data: res.data.data };
        } catch (err) { 
            return { 
            success: false, 
            message: "Lỗi lấy chi tiết màn chơi" 
            }; 
        }
    },
    async adjustContent(id: string, payload:questContentTypeRequest):Promise<ApiResponse<any>> {
        try {
            const res = await axiosClient.patch(`/quests/cont-adj/${id}`,payload);
            return { 
                success: true, 
                message: "Thành công", 
                data: res.data.data };
        } catch (err) { 
            return { 
            success: false, 
            message: "Lỗi lấy chi tiết màn chơi" 
            }; 
        }
    },
    async addToTopic(topicId: string, questId: string): Promise<ApiResponse<any>> {
        try {
            const res = await axiosClient.patch(`/quests/add-to-topic?topic=${topicId}&quest=${questId}`);
            
            return {
                success: true,
                message: res.data?.message ?? "Thêm màn chơi vào chương thành công",
                data: res.data.data
            };
        } catch (err) {
            return handleError(err, "Lỗi khi thêm màn chơi");
        }
    },
    async removeFromTopic(questId: string): Promise<ApiResponse<any>> {
        try {
            const res = await axiosClient.patch(`/quests/remove-from-topic/${questId}`);
            return {
                success: true,
                message: res.data?.message,
                data: res.data.data
            };
        } catch (err) {
            return handleError(err, "Lỗi khi gỡ màn chơi");
        }
    },
    async reorder(questIds: string[]): Promise<ApiResponse<string>> {
        try {
            const res = await axiosClient.patch(`/quests/reorder`, questIds);
            
            return {
                success: true,
                message: res.data?.message ?? "Sắp xếp thứ tự thành công",
                data: res.data.data
            };
        } catch (err) {
            return handleError(err, "Lỗi khi sắp xếp thứ tự màn chơi");
        }
    }
}

export default questApiService;