export type LoginResponse = {
  success: boolean;
  message: string;
  token?: string;
};

export type UserGeneral = {
    id: string;
    username: string;
    fullname: string;
    role: boolean;
};