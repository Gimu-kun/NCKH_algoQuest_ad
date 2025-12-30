import axios from "axios";
import axiosClient from "./axiosClient";
import type { ApiResponse } from "../../types/apiResponseType";
import type { LessonType } from "../../types/lessonType";

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
      return handleError(err, "Lỗi khi lấy danh sách bài học");
    }
  },

  async getById(id: string): Promise<ApiResponse<LessonType>> {
    try {
        const res = await axiosClient.get(`/lessons/${id}`);
        return { 
          success: true, 
          message: "Lấy chi tiết bài học thành công", 
          data: res.data.data 
        };
    } catch (err) { 
      return handleError(err, "Lỗi khi lấy chi tiết bài học");
    }
  },

  async create(req: { title: string; operatorId: string; topic_id:string }): Promise<ApiResponse<LessonType>> {
    try {
        const res = await axiosClient.post("/lessons", req);
        return {
            success: true,
            message: res.data?.message ?? "Khởi tạo bài học thành công",
            data: res.data?.data
        };
    } catch (err) {
        return handleError(err, "Lỗi khi tạo bài học");
    }
  },

  async addSection(
    lessonId: string, 
    sectionData: any, 
    images: File[], 
    parentId?: string
  ): Promise<ApiResponse<any>> {
    try {
        const formData = new FormData();
        
        const sectionBlob = new Blob([JSON.stringify(sectionData)], {
            type: "application/json",
        });
        formData.append("section", sectionBlob);

        if (images && images.length > 0) {
            images.forEach((file) => {
                formData.append("images", file);
            });
        }

        const url = `/lessons/${lessonId}/sections${parentId ? `?parentId=${parentId}` : ""}`;
        
        const res = await axiosClient.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        return {
            success: true,
            message: "Thêm mục nội dung thành công",
            data: res.data.data
        };
    } catch (err) {
        return handleError(err, "Lỗi khi thêm mục nội dung");
    }
  },

  async deleteLesson(id: string): Promise<ApiResponse<any>> {
    try {
      await axiosClient.delete(`/lessons/${id}`);
      return { success: true, message: "Xóa bài học thành công" };
    } catch (err) {
      return handleError(err, "Không thể xóa bài học");
    }
  },

  async deleteSection(sectionId: string): Promise<ApiResponse<any>> {
    try {
      await axiosClient.delete(`/lessons/sections/${sectionId}`);
      return { success: true, message: "Xóa mục thành công" };
    } catch (err) {
      return handleError(err, "Không thể xóa mục nội dung");
    }
  },
  async updateSection(
    sectionId: string, 
    data: { title: string; content: string },
    images?: File[],
  ): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      
      const sectionBlob = new Blob([JSON.stringify(data)], { type: "application/json" });
      formData.append("section", sectionBlob);
  
      if (images && images.length > 0) {
        images.forEach((file) => formData.append("images", file));
      }
  
      const res = await axiosClient.put(`/lessons/sections/${sectionId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
  
      return { success: true, message: "Cập nhật thành công", data: res.data.data };
    } catch (err) {
      return handleError(err, "Lỗi khi cập nhật mục nội dung");
    }
  },
};

export default lessonApiService;