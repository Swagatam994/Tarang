import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BoarderAnimatedContainer.jsx";
import {
  MessageCircleIcon,
  LockIcon,
  MailIcon,
  UserIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            {/* FORM CLOUMN - LEFT SIDE */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">
                {/* HEADING TEXT */}
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    Create Account
                  </h2>
                  <p className="text-slate-400">Sign up for a new account</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* FULL NAME */}
                  <div>
                    <label className="auth-input-label">Full Name</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />

                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="input"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* EMAIL INPUT */}
                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />

                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="input"
                        placeholder="abcd@gmail.com"
                      />
                    </div>
                  </div>

                  {/* PASSWORD INPUT */}
                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />

                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="input"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    className="auth-btn"
                    type="submit"
                    disabled={isSigningUp}
                  >
                    {isSigningUp ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  <button
  onClick={() =>
    window.open("http://localhost:3000/api/auth/google", "_self")
  }
  type="button"
  aria-label="Sign in with Google"
  disabled={isSigningUp}
  className="
    flex items-center justify-center gap-3
    w-full px-4 py-2.5
    bg-white text-slate-800
    border border-slate-300
    rounded-xl
    shadow-sm
    transition-all duration-200
    hover:shadow-md hover:bg-slate-50
    active:scale-[0.98]
    disabled:opacity-60 disabled:cursor-not-allowed
  "
>
  {isSigningUp ? (
    <LoaderIcon className="w-5 h-5 animate-spin text-slate-600" />
  ) : (
    <>
      {/* Google Logo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="w-5 h-5"
      >
        <path fill="#EA4335" d="M24 9.5c3.9 0 7 1.5 9.1 3.6l6.8-6.8C35.5 2.4 30.1 0 24 0 14.7 0 6.9 4.8 2.9 12l7.7 6c1.4-4.5 5.4-8.1 13.4-8.1z"/>
        <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.6h12.7c-.5 2.9-2.6 5.4-5.4 7.1l8.3 6.4C44.7 37.9 46.5 31.6 46.5 24.5z"/>
        <path fill="#4A90E2" d="M10.6 28.9a14.5 14.5 0 0 1 0-9.8l-7.7-6A24 24 0 0 0 0 24c0 3.9.9 7.6 2.6 10.9l8-6z"/>
        <path fill="#FBBC05" d="M24 48c6.1 0 11.6-1.9 15.5-5.2l-8.3-6.4c-2.3 1.5-5.2 2.4-8.8 2.4-8 0-12-3.6-13.4-8.1L2.9 36C6.9 43.2 14.7 48 24 48z"/>
      </svg>

      <span className="font-medium text-sm">
        Continue with Google
      </span>
    </>
  )}
</button>

                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="auth-link">
                    Already have an account? Login
                  </Link>
                </div>
              </div>
            </div>

            {/* FORM ILLUSTRATION - RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <div>
                <img
                  src="/signup.png"
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">
                    Start Your Journey Today
                  </h3>

                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Free</span>
                    <span className="auth-badge">Easy Setup</span>
                    <span className="auth-badge">Private</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
export default SignUpPage;
