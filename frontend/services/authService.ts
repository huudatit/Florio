import axiosInstance from "@/lib/axios";
import {
  SignUpPayload,
  SignInPayload,
  SignInResponse,
  RefreshTokenResponse,
} from "@/types";

export const signUp = async (payload: SignUpPayload): Promise<void> => {
  await axiosInstance.post("/auth/signup", payload);
};

export const signIn = async (
  payload: SignInPayload,
): Promise<SignInResponse> => {
  const { data } = await axiosInstance.post<SignInResponse>(
    "/auth/signin",
    payload,
  );
  return data;
};

export const signOut = async (): Promise<void> => {
  await axiosInstance.post("/auth/signout");
};

export const refreshToken = async (): Promise<string> => {
  const { data } = await axiosInstance.post<RefreshTokenResponse>(
    "/auth/refresh-token",
  );
  return data.accessToken;
};
