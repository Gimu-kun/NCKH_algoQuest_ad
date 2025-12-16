import axios from "axios";
import axiosClient from "./axiosClient";
import type { addNewTopic, editTopicType, topicType } from "../../types/topicType";
import type { ApiResponse } from "../../types/apiResponseType";


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

const topicApiService = {
  async getAll(): Promise<ApiResponse<topicType[]>> {
    try {
      const res = await axiosClient.get("/topics");
      return {
        success: true,
        message: res.data?.message ?? "Lấy dữ liệu thành công",
        data: res.data?.data
      };
    } catch (err) {
      return handleError(err, "Lỗi khi lấy dữ liệu chương");
    }
  },

  async getById(id: string): Promise<ApiResponse<topicType>> {
    try {
      const res = await axiosClient.get(`/topics/${id}`);
      return {
        success: true,
        message: res.data?.message ?? "Lấy chương theo id thành công",
        data: res.data?.data
      };
    } catch (err) {
      return handleError(err, "Lỗi khi lấy thông tin chương");
    }
  },

  async addNew(payload: addNewTopic): Promise<ApiResponse<topicType>> {
    try {
      const res = await axiosClient.post("/topics", payload);
      return {
        success: true,
        message: res.data?.message ?? "Tạo chương thành công",
        data: res.data?.data
      };
    } catch (err) {
      return handleError(err, "Lỗi khi tạo chương");
    }
  },

  async update(id: string, payload: editTopicType, operatorId: string): Promise<ApiResponse<topicType>> {
    try {
      const res = await axiosClient.patch(`/topics/${id}`, {...payload,operatorId});
      return {
        success: true,
        message: res.data?.message ?? "Cập nhật chương thành công",
        data: res.data?.data
      };
    } catch (err) {
      return handleError(err, "Lỗi khi cập nhật chương");
    }
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    try {
      const res = await axiosClient.delete(`/topics/${id}`);
      return {
        success: true,
        message: res.data?.message ?? "Xoá chương thành công"
      };
    } catch (err) {
      return handleError(err, "Lỗi khi xoá chương");
    }
  }
};

export default topicApiService;
