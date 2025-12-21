import axios from "axios";
import axiosClient from "./axiosClient";
import type { ApiResponse } from "../../types/apiResponseType";
import type { questionType } from "../../types/questionType";


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

const questionApiService = {
  async getAll(): Promise<ApiResponse<questionType[]>> {
    try {
      const res = await axiosClient.get("/questions");
      return {
        success: true,
        message: res.data?.message ?? "Lấy dữ liệu thành công",
        data: res.data?.data
      };
    } catch (err) {
      return handleError(err, "Lỗi khi lấy dữ liệu chương");
    }
  },
  async create(formData:FormData): Promise<ApiResponse<questionType>> {
    try {
        const res = await axiosClient.post("/questions",formData);
        return {
            success: true,
            message: res.data?.message ?? "Thêm bài học thành công",
            data: res.data?.data
        };
    } catch (err) {
        return handleError(err, "Lỗi khi thêm bài học");
    }
  }
};

export default questionApiService;
