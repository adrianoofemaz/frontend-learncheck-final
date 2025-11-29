import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Username dan password harus diisi!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://capstone.yapp.web.id/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok && data.success) {
        alert("Login berhasil!");
        // Simpan token atau redirect ke dashboard
        navigate("/HomePage");
      } else {
        setError(data.message || "Username atau password salah");
      }
    } catch (error) {
      console.error("Error login:", error);
      setError("Gagal melakukan login. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="hidden md:block lg:w-1/2 w-2/5">
        <img
          src="/assets/images/Dicoding Login.png"
          alt="Dicoding Login"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 lg:w-1/2 bg-white p-8 flex flex-col justify-center max-w-lg mx-auto">
        <div className="flex flex-col items-center justify-center gap-1 mb-5">
          <img
            src="/assets/images/logo-login.jpg"
            className="w-30 h-30 mb-3"
            alt="Logo"
          />
          <h2 className="text-3xl font-semibold text-center">
            Selamat Datang Kembali
          </h2>
          <p className="text-center text-gray-600 mb-3">
            Masukkan username dan password untuk login
          </p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-blue-950 text-white rounded-md hover:bg-gray-800 transition duration-200 disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </div>

        <div className="gap-5">
          <div className="flex justify-between items-center mt-6">
            <div className="w-full border-t"></div>
            <span className="px-4 text-sm text-gray-600">Or</span>
            <div className="w-full border-t"></div>
          </div>

          <div className="flex gap-3 mt-4">
            <button className="flex-1 py-3 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition duration-200">
              <img
                src="/assets/images/logo google.png"
                className="w-6 h-6 rounded-2xl mr-3"
                alt="logo google"
              />
              <p>Sign in with Google</p>
            </button>
          </div>

          <p className="text-center mt-4 text-sm">
            Belum punya akun?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
