"use client";

import { FcGoogle } from "react-icons/fc";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);


  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    if (!captchaToken) {
      alert("Please complete the captcha.");
      return;
    }

    try {
      const captchaResponse = await axios.post("https://server.pgbee.in/api/v1/captcha", {
        token: captchaToken,
      });

      if (!captchaResponse.data.success) {
        alert("Captcha verification failed. Try again.");
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
        return;
      }

      await fetchDetails();

      alert("Login successful!");
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
      router.push("/");

    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong.");
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    }
  };


  const fetchDetails = async () => {
    const response = await axios.post("https://server.pgbee.in/api/v1/auth/login", {
      email,
      password,
    }, { withCredentials: true });
    console.log("Fetched details:", response.data);
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get("https://server.pgbee.in/api/v1/auth/google");
      console.log("Google login response:", response.data);
    } catch (error) {
      console.error("Error during Google login:", error);
      alert("Something went wrong with Google login.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center relative">
      <h1 className="absolute top-6 left-1/2 transform -translate-x-1/2 text-5xl font-extrabold text-center z-20">
        <span className="text-yellow-400">Pg</span>
        <span className="text-black">Bee</span>
      </h1>

      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-xl z-10">
        <div className="flex mb-6 border border-gray-300 rounded-lg overflow-hidden">
          <button onClick={() => router.push("/signup")} className="w-1/2 py-2 bg-white text-black font-medium">Sign up</button>
          <button className="w-1/2 py-2 bg-black text-white font-medium">Log in</button>
        </div>

        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 border border-gray-400 py-2 rounded-xl mb-6 hover:bg-gray-100">
          <FcGoogle size={24} />
          Log In with Google
        </button>

        <div className="flex items-center justify-center mb-6">
          <hr className="w-1/3 border-gray-300" />
          <span className="mx-2 text-gray-400 text-sm">OR</span>
          <hr className="w-1/3 border-gray-300" />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>

        <div className="mb-2">
          <label className="block text-sm mb-1 text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
        </div>

        <div className="text-right mb-4">
          <a href="#" className="text-sm text-gray-500 hover:underline">Forgot Your Password?</a>
        </div>

        <div className="flex justify-center items-center ">
          <ReCAPTCHA
            sitekey="6Le_M5MrAAAAACrSz_3kuodKa-fyh7dk6kHeYeNC"
            onChange={(token: string | null) => setCaptchaToken(token)}
            ref={recaptchaRef}
          />
        </div>

        <button onClick={handleLogin} className="w-full mt-[20px] bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800">
          Log In
        </button>
      </div>
    </div>
  );
}
