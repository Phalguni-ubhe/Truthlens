import { useState, useEffect } from "react"; // <-- MODIFIED
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { 
  signInWithEmailAndPassword, 
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig"; // Adjust path as needed
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"; // Adjust path as needed

interface LoginProps {
  onBack: () => void;
  onLoginSuccess: () => void; // Renamed to match App.tsx
  onSignup: () => void;
  message?: string;
  clearMessage: () => void;
}

export default function Login({ 
  onBack, 
  onLoginSuccess, 
  onSignup, 
  message, 
  clearMessage 
}: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // New state for form, loading, and errors
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResendLink, setShowResendLink] = useState(false);

  useEffect(() => {
  if (message) {
    const timer = setTimeout(() => {
      setIsDialogOpen(true);
    }, 10);
    return () => clearTimeout(timer);
  }
}, [message]);
  // Helper for input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handler for Email/Password Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowResendLink(false);
    setLoading(true);

    try {
      // 1. Sign in the user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // 2. *** THE VERIFICATION CHECK ***
      if (!userCredential.user.emailVerified) {
        setError("Your email is not verified. Please check your inbox.");
        setShowResendLink(true);
        await auth.signOut(); // Sign them out again
        setLoading(false);
        return; // Stop the login
      }

      // 3. If verified, proceed to the app
      console.log("Login successful, email is verified.");
      onLoginSuccess(); // Navigate to dashboard

    } catch (err: any) {
      console.error("Login Error:", err.code, err.message);
      let userMessage = "Invalid email or password.";
      if (err.code === 'auth/invalid-credential') {
        userMessage = "Invalid email or password.";
      }
      setError(userMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handler for Resending Verification Email
  const handleResendVerification = async () => {
    setError(null);
    if (!formData.email || !formData.password) {
      setError("Please fill in your email and password to resend.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      if (userCredential.user.emailVerified) {
        setError("Your email is already verified. You can log in.");
        setShowResendLink(false);
      } else {
        await sendEmailVerification(userCredential.user);
        setError("New verification email sent! Please check your inbox.");
        setShowResendLink(false);
      }
      await auth.signOut();
    } catch (err: any) {
      setError("Could not send verification. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for Google Sign-in
  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      // 1. Sign in with popup on the client
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // 2. Send token to your backend to create/verify Firestore doc
      const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Google Sign-in failed");
      }

      // 3. If backend is OK, proceed to app
      console.log("Google sign-in successful and verified by backend.");
      onLoginSuccess();

    } catch (err: any) {
      console.error("Google sign-in error:", err.code, err.message);
      let userMessage = "An unexpected error occurred.";
      if (err.code === 'auth/popup-closed-by-user') {
        userMessage = "Sign-in cancelled.";
      } else if (err.message) {
        userMessage = err.message;
      }
      setError(userMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  // Close handler for the popup dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    clearMessage();
  };

 return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-400 hover:text-white z-10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

     {/* Login Card */}
      <Card className="w-full max-w-md mx-4 bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-2xl relative z-10">
        
        <div className="relative">
          <CardHeader className="text-center pb-6">
            <div className="text-3xl font-bold text-white mb-2">
              Truth<span className="text-blue-400">Lens</span>
            </div>
            <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked: boolean | 'indeterminate') => setRememberMe(checked === true)}
                    className="border-gray-600 data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor="remember" className="text-gray-300 text-sm">
                    Remember me
                  </Label>
                </div>
                <a
                  href="#" // You can wire this up to a password reset flow later
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot Password?
                </a>
              </div>

              {/* --- Error and Resend Link Section --- */}
              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}

              {showResendLink && (
                <div className="text-center text-sm">
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium underline"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Resend verification email"}
                  </button>
                </div>
              )}
              {/* --- End of Error Section --- */}


              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>

              {/* Sign Up Link */}
              <div className="text-center pt-4">
                <span className="text-gray-400">New here? </span>
                <button
                  type="button"
                  onClick={onSignup}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium underline-offset-4 hover:underline"
                >
                  Create an Account
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                {googleLoading ? (
                  "Signing In..."
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    </svg>
                    Google
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

     <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
  <DialogContent className="bg-gray-900 border-gray-700 text-white">
    <DialogHeader>
      <DialogTitle>Signup Successful!</DialogTitle>
      <DialogDescription className="text-gray-300">
        {message}
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button 
        onClick={handleCloseDialog}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        OK
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  );
}