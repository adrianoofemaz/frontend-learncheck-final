import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi form untuk memastikan semua kolom terisi
    if (!name || !username || !password || !confirmPassword) {
      setError("Semua kolom harus diisi!");
      return;
    }

    // Validasi untuk memastikan password dan konfirmasi password sama
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama.");
      return;
    }

    // Validasi panjang password minimal 6 karakter
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      // Mengirimkan data registrasi ke API
      const response = await fetch("https://capstone.yapp.web.id/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          password,
        }),
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      // Jika registrasi berhasil
      if (response.ok || data.success) {
        setError("");
        alert("Registrasi berhasil! Silakan login.");
        navigate("/login");
      } else {
        setError(data.message || "Terjadi kesalahan saat registrasi");
      }
    } catch (error) {
      setError("Gagal melakukan registrasi. Silakan coba lagi.");
      console.error("Error registrasi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* LEFT SIDE (gambar) */}
      <div className="hidden md:block lg:w-1/2 w-2/5">
        <img
          src="/assets/images/Dicoding Login.png"
          alt="Dicoding Login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT SIDE (form) */}
      <div className="flex-1 lg:w-1/2 bg-white p-8 flex flex-col justify-center max-w-lg mx-auto">
        <div className="gap-10">
          <div className="flex flex-col items-center justify-center gap-1 mb-5">
            <img
              src="/assets/images/logo-login.jpg"
              className="w-30 h-30 mb-3"
              alt=""
            />
            <h2 className="text-3xl font-semibold text-center">
              Selamat Datang
            </h2>
            <p className="text-center text-gray-600 mb-3">
              Buat akun baru untuk memulai
            </p>
          </div>

          {/* Form Registrasi */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nama Lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-950 text-white rounded-md hover:bg-gray-800 transition duration-200 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Sign Up"}
            </button>
          </form>
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
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
