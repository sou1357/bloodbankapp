import { useState } from 'react';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import { Droplet } from 'lucide-react';

export default function AuthPages() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Droplet className="w-10 h-10 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">LifeFlow</h1>
          </div>
          <p className="text-gray-600">Blood Bank Management System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                isLogin
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                !isLogin
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Register
            </button>
          </div>

          {isLogin ? <Login /> : <Register />}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Saving lives, one drop at a time
        </p>
      </div>
    </div>
  );
}
