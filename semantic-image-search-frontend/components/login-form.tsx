"use client"

import {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import Link from "next/link";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function LoginForm() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const callbackUrl = searchParams.get('callbackUrl');
        router.push(callbackUrl || '/search');
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.message}`);
      }

    } catch (error) {
      console.error("Login failed:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
      <div className="w-full h-screen flex items-center justify-center">
        <form onSubmit={handleSubmit}>
          <div className="w-[350px] space-y-6">
            {/* header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>

            {/* form */}
            <div className="space-y-4">
              {/* input username */}
              <div className="space-y-2">
                <Label htmlFor="email">Username</Label>
                <Input
                    id="username"
                    type=""
                    placeholder="enter username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password"
                       type="password"
                       required
                       autoComplete="off"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* button */}
              <div className="space-y-2">
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </div>

            {/* sign up */}
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
  );
}