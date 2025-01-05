"use client"

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function SignUpForm() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        try {
            const response = await fetch("/auth/register", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (response.ok) {
                router.push("/search");
            } else {
                const errorData = await response.json();
                alert(`Request failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Request failed:", error);
            alert("An unexpected error occurred.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit}>
                <Card className="max-w-sm w-full mx-4">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl">Sign Up</CardTitle>
                        <CardDescription>
                            Enter your information to create an account
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-4">
                            {/* Username Input */}
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    placeholder="Enter your username"
                                    required
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {/* Buttons */}
                            <div className="space-y-2">
                                <Button type="submit" className="w-full">
                                    Create an account
                                </Button>
                            </div>

                            {/* Sign in Link */}
                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link href="/login" className="underline">
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}