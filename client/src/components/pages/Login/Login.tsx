import { useMutation } from "@tanstack/react-query"
import type { LoginParams } from "../../../shared/zod"
import api from "../../../lib/axios/axios"
import { API_ROUTES, localKey } from "../../../lib/api"
import type { Response } from "../../../types/types"
import { userStore } from "../../../state/global"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

interface LoginResponse extends Response {
  data: {
    token: string;
    refresh: string;
  }
}

export default function Login() {
  const setToken = userStore((state) => state.setToken);
  const token = userStore((state) => state.token);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (data: LoginParams) => {
      const res = await api.post<LoginResponse>(API_ROUTES.AUTH.LOGIN, data);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem(localKey.token, data.data.token);
      setToken(data.data.token);
      navigate("/dashboard");
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    },
  })

  useEffect(() => {
    if (token) {
      // check the me endpoint to verify the token
      navigate("/dashboard");
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to access your dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <a href="#" className="font-medium text-blue-500 hover:text-blue-600">
            Get started
          </a>
        </div>
      </div>
    </div>
  )
}