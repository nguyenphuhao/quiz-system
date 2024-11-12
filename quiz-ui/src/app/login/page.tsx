"use client";
import { LoginForm } from "../../components/LoginForm/LoginForm";
import { useAuthContext } from "../../providers/AuthProvider";
import { useEffect } from "react";

export default function Login() {
  const auth = useAuthContext();
  const authUser = auth.getAuthenticatedUser();
  if (authUser) {
    window.location.href = "/quizzes";
    return;
  }

  return (
    <LoginForm
      onClickSignIn={(username, password) => {
        auth.login({ username, password });
      }}
    />
  );
}
