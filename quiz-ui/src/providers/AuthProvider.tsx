"use client";
import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import React, { ReactNode, useContext, useEffect } from "react";
import { ApiEndpoint } from "../config/apiEndpoints";

const getAuthenticatedUser = (): UserProfile | undefined => {
  if (typeof window !== "undefined") {
    const authUser = window.localStorage.getItem("authenticatedUser");
    if (authUser) {
      return JSON.parse(authUser);
    }
    return;
  }
};
axios.interceptors.request.use(function (config) {
  const auth = getAuthenticatedUser();
  if (auth) {
    config.headers.Authorization = `Bearer ${auth?.accessToken}`;
  }

  return config;
});
type UserProfile = {
  accessToken: string;
  id: number;
  username: string;
};
type LoginForm = { username: string; password: string };
type AuthContextType = {
  login: UseMutateFunction<UserProfile | undefined, Error, LoginForm, unknown>;
  getAuthenticatedUser: () => UserProfile | undefined;
  isSuccess: boolean;
  isError: boolean;
};
const AuthContext = React.createContext<AuthContextType>(undefined as any);

type AuthContextProviderProps = {
  children: React.ReactNode;
};
export const AuthContextProvider = (props: AuthContextProviderProps) => {
  let userProfile: UserProfile;
  const {
    mutate: login,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (loginForm: LoginForm) => {
      if (typeof window !== "undefined") {
        const res = await axios.post(ApiEndpoint.local.login, loginForm);
        const authenticated = res.data;

        const profileRes = await axios.get(ApiEndpoint.local.profile, {
          headers: {
            Authorization: `Bearer ${authenticated.accessToken}`,
          },
        });
        const profile = profileRes.data;

        if (profile) {
          userProfile = {
            ...authenticated,
            ...profile,
          };
          console.log(profile);
          window.localStorage.setItem(
            "authenticatedUser",
            JSON.stringify(userProfile)
          );
        }

        return userProfile;
      }
    },
  });

  return (
    <AuthContext.Provider
      value={{
        login,
        isSuccess,
        isError,
        getAuthenticatedUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
