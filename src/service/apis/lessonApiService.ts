import axios from "axios";
import axiosClient from "./axiosClient";
import type { ApiResponse } from "../../types/apiResponseType";
import type { LessonCreationType, LessonType } from "../../types/lessonType";


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

const lessonApiService = {
  async getAll(): Promise<ApiResponse<LessonType[]>> {
    try {
      const res = await axiosClient.get("/lessons");
      return {
        success: true,
        message: res.data?.message ?? "Lấy dữ liệu thành công",
        data: res.data?.data
      };
    } catch (err) {
      return handleError(err, "Lỗi khi lấy dữ liệu chương");
    }
  },
  async create(req:LessonCreationType): Promise<ApiResponse<LessonType>> {
    try {
        let formData = new FormData();
        formData.append("title",req.title);
        formData.append("content",req.content);
        formData.append("operatorId",req.operatorId);
        req.images.forEach((file) => {
            formData.append("images", file);
        });
        const res = await axiosClient.post("/lessons",formData);
        return {
            success: true,
            message: res.data?.message ?? "Thêm bài học thành công",
            data: res.data?.data
        };
    } catch (err) {
        return handleError(err, "Lỗi khi thêm bài học");
    }
  },
  async getById(id: string): Promise<ApiResponse<any>> {
      try {
          const res = await axiosClient.get(`/lessons/${id}`);
          return { 
            success: true, 
            message: "Thành công", 
            data: res.data.data };
      } catch (err) { 
        return { 
          success: false, 
          message: "Lỗi lấy chi tiết bài học" 
        }; 
      }
  },
};

export default lessonApiService;
