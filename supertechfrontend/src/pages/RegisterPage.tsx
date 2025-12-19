import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Register error:', data)
        throw new Error(data.error || Object.values(data)[0] as string || 'Registration failed')
      }

      console.log('Register success:', data)
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Registration failed'
      console.error('Register exception:', errorMsg)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-10"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-orange-500 rounded-full blur-3xl opacity-10"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-50 via-blue-50 to-transparent p-8 sm:p-10 border-b border-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl sm:text-4xl">🌍</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">Join SuperClimate</h1>
              <p className="text-xs sm:text-sm text-gray-600 text-center mt-2">Create your account to start monitoring</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6 sm:p-8">
            {/* Error Alert - Enhanced visibility */}
            {error && (
              <div className="mb-6 bg-gradient-to-r from-red-50 to-red-50/50 border-2 border-red-400 rounded-xl p-4 sm:p-5 relative overflow-hidden shadow-md animate-pulse">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-200 rounded-full blur-2xl opacity-20 -mr-10 -mt-10"></div>
                <div className="relative z-10 flex items-start gap-3">
                  <span className="text-2xl sm:text-3xl flex-shrink-0 mt-0.5">❌</span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-red-900 text-sm sm:text-base">Registration Failed</h3>
                    <p className="text-red-800 text-xs sm:text-sm mt-2 break-words leading-relaxed font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Username Field */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span>👤</span> Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Choose a username"
                  className="w-full px-4 sm:px-5 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm sm:text-base font-medium bg-gray-50 hover:bg-white"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span>📧</span> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 sm:px-5 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm sm:text-base font-medium bg-gray-50 hover:bg-white"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span>🔑</span> Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password"
                  className="w-full px-4 sm:px-5 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm sm:text-base font-medium bg-gray-50 hover:bg-white"
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span>✅</span> Confirm Password
                </label>
                <input
                  type="password"
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  className="w-full px-4 sm:px-5 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm sm:text-base font-medium bg-gray-50 hover:bg-white"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 sm:py-3.5 px-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 mt-6 ${
                  loading
                    ? 'bg-gray-400 text-white cursor-not-allowed opacity-75'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-100'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6 sm:my-7">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span className="text-xs sm:text-sm text-gray-500 font-medium">Already a member?</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>

            {/* Login Link */}
            <p className="text-center text-xs sm:text-sm text-gray-600">
              Already have an account?{' '}
              <a
                href="/login"
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200 underline"
              >
                Sign in here
              </a>
            </p>
          </div>

          {/* Footer Info */}
          <div className="bg-gray-50 px-6 sm:px-8 py-4 sm:py-5 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              ✨ Real-time climate alerts • Secure & private data
            </p>
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center text-xs text-gray-400 mt-6 sm:mt-8">
          © 2025 SuperClimate. All rights reserved.
        </p>
      </div>
    </div>
  )
}
