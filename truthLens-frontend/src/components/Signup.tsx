import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { ArrowLeft, Eye, EyeOff, User, Mail, Lock, Shield } from "lucide-react";
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig"; // adjust the path as needed

interface SignupProps {
  onBack: () => void;
  onLogin: (message?: string) => void; // <-- CORRECT
  onSignup: () => void;
}

export default function Signup({ onBack, onLogin, onSignup }: SignupProps)  {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const calculatePasswordStrength = (password: string): { score: number; text: string; color: string } => {
    if (!password) return { score: 0, text: "", color: "" };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    if (score <= 2) return { score: (score / 5) * 100, text: "Weak", color: "text-red-400" };
    if (score <= 4) return { score: (score / 5) * 100, text: "Medium", color: "text-yellow-400" };
    return { score: 100, text: "Strong", color: "text-green-400" };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

 
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null); 

  if (!acceptTerms) {
    setError("Please accept the Terms & Privacy Policy to continue.");
    return;
  }
  if (!passwordsMatch) {
    setError("Passwords do not match.");
    return;
  }

  setLoading(true);

 try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.fullName, 
          email: formData.email,
          password: formData.password,
        }),
      });
      
      console.log("--- Step 1: API Fetch Complete ---", response);

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error("Server error. Please try again later.");
      }

      console.log("--- Step 2: API Response JSON Parsed ---", data);

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }
      
      console.log("--- Step 3: Backend Signup Successful ---");
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      console.log("--- Step 4: Client Sign-in Successful ---", userCredential.user);

      await sendEmailVerification(userCredential.user);
      
      console.log("--- Step 5: Verification Email Sent ---");

      await auth.signOut();
      
      console.log("--- Step 6: Client Sign-out Successful ---");

      // 4. Send them to the login page
      onLogin("Signup successful! Please check your email to verify your account before logging in.");

    } catch (err: any) {
      // THIS IS WHERE IT'S LIKELY GOING
      console.error("--- FINAL ERROR ---", err.message); 
      setError(err.message); 
    } finally {
      setLoading(false);
    }
};
//   const handleGoogleSignIn = async () => {
//   setError(null);
//   setGoogleLoading(true);
//   const provider = new GoogleAuthProvider();

//   try {
//     const result = await signInWithPopup(auth, provider);
//     console.log("Google sign-in successful:", result.user);
//     onSignup(); // Call the onSignup prop to proceed
//   } catch (err: any) {
//     console.error("Google sign-in error:", err.code, err.message);
    
//     let userMessage = "An unexpected error occurred. Please try again.";
//     if (err.code === 'auth/popup-closed-by-user') {
//       userMessage = "Sign-in cancelled. Please try again.";
//     } else if (err.code === 'auth/account-exists-with-different-credential') {
//       userMessage = "An account already exists with this email. Please log in normally.";
//     }
    
//     setError(userMessage);
//   } finally {
//     setGoogleLoading(false);
//   }
// };
  // REPLACE your old handleGoogleSignIn with this new one
  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      // 1. Sign in with popup on the client
      // This is necessary to show the Google account selection popup
      const result = await signInWithPopup(auth, provider);
      
      // 2. Get the user's ID token
      // This token is a secure credential from Google
      const idToken = await result.user.getIdToken();

      // 3. Send this token to your backend API
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`, { // Your new API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken }), // Send the token
      });

      const data = await response.json();

      if (!response.ok) {
        // Get the error message from your backend
        throw new Error(data.error || "Google Sign-in failed");
      }

      // 4. If the backend successfully creates the Firestore doc, proceed
      console.log("Google sign-in verified by backend:", data);
      onSignup(); // Call the onSignup prop to proceed to the app

    } catch (err: any) {
      console.error("Google sign-in error:", err.code, err.message);
      
      let userMessage = "An unexpected error occurred. Please try again.";
      if (err.code === 'auth/popup-closed-by-user') {
        userMessage = "Sign-in cancelled. Please try again.";
      } else if (err.message) {
        // This will display the error from your backend (e.g., "Token expired")
        userMessage = err.message;
      }
      
      setError(userMessage);
    } finally {
      setGoogleLoading(false);
    }
  };
  const isFormValid = formData.fullName && formData.email && formData.password && 
                     formData.confirmPassword && passwordsMatch && acceptTerms;

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)
          `
        }}></div>
        
        {/* AI Circuit Lines Pattern */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <circle cx="60" cy="60" r="3" fill="rgba(59, 130, 246, 0.4)" />
              <circle cx="20" cy="20" r="2" fill="rgba(6, 182, 212, 0.3)" />
              <circle cx="100" cy="40" r="2" fill="rgba(139, 92, 246, 0.3)" />
              
              <line x1="60" y1="60" x2="20" y2="20" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" />
              <line x1="60" y1="60" x2="100" y2="40" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="1" />
              <line x1="20" y1="20" x2="100" y2="40" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="1" />
              
              <rect x="15" y="15" width="10" height="10" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" />
              <rect x="95" y="35" width="10" height="10" fill="none" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-400 hover:text-white z-10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      {/* Signup Card */}
      <Card className="w-full max-w-md mx-4 bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-2xl relative z-10">
        {/* Neon Border Glow */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-sm"></div>
        <div className="absolute inset-[1px] rounded-lg bg-gray-900"></div>
        
        <div className="relative">
          <CardHeader className="text-center pb-6">
            <div className="text-3xl font-bold text-white mb-2">
              Truth<span className="text-blue-400">Lens</span>
            </div>
            <CardTitle className="text-2xl text-white flex items-center justify-center">
              <Shield className="w-6 h-6 mr-2 text-blue-400" />
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-400">
              Join the future of AI-powered fact-checking
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-300 flex items-center">
                  <User className="w-4 h-4 mr-2 text-blue-400" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-400" />
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
                <Label htmlFor="password" className="text-gray-300 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-blue-400" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Password Strength</span>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <Progress
                      value={passwordStrength.score}
                      className="h-2 bg-gray-700"
                    />
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-blue-400" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 pr-10 ${
                      formData.confirmPassword && !passwordsMatch ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-400">Passwords do not match</p>
                )}
              </div>

              {/* Terms & Privacy Policy */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                 onCheckedChange={(checked: boolean | 'indeterminate') => setAcceptTerms(checked === true)}
                  className="border-gray-600 data-[state=checked]:bg-blue-600 mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="terms" className="text-gray-300 text-sm leading-relaxed">
                    I accept the{" "}
                    <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>
              </div>

              {/* Display Error Message */}
              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}

              {/* Create Account Button */}
              <Button
                type="submit"
                disabled={!isFormValid || loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>

              {/* Login Link */}
              <div className="text-center pt-4">
                <span className="text-gray-400">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => onLogin()}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium underline-offset-4 hover:underline"
                >
                  Login here
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-700"></div>
              <span className="px-4 text-gray-500 text-sm">or continue with</span>
              <div className="flex-1 border-t border-gray-700"></div>
            </div>

            {/* Social Signup Options */}
            <div className="grid grid-cols-1 gap-3">
              <Button
  variant="outline"
  type="button"
  onClick={handleGoogleSignIn}
  disabled={googleLoading}
  className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50"
>
  {googleLoading ? (
    "Signing in..."
  ) : (
    <>
      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
        {/* ... all your svg path tags ... */}
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Google
    </>
  )}
</Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}