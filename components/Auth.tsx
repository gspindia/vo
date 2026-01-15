import React, { useState } from 'react';
import { User, INDIAN_STATES, UserRole } from '../types';
import { api } from '../services/api';
import { UserCircle, Key, Phone, Mail, Badge, Calendar, MapPin, Loader2, Shield, User as UserIcon, ChevronRight } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'LOGIN' | 'SIGNUP';
type AuthRole = 'VOLUNTEER' | 'ADMIN';

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [role, setRole] = useState<AuthRole>('VOLUNTEER');
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [loading, setLoading] = useState(false);
  
  // Login State
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  // Signup State
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    state: '',
    confirmPassword: '',
    email: '',
    volNo: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Map the UI role to the API UserRole
      const targetRole = role === 'ADMIN' ? UserRole.ADMIN : UserRole.VOLUNTEER;
      
      const user = await api.login(mobile, password, targetRole);
      
      // Validation to ensure we didn't get a mixed up user type
      if (role === 'ADMIN' && user.role !== 'admin') {
         alert("Access Denied: Not an admin account");
         return;
      }
      onLogin(user);
    } catch (error) {
      alert("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const user = await api.signup({
        name: formData.name,
        dob: formData.dob,
        state: formData.state,
        mobile: mobile,
        email: formData.email,
        volNo: formData.volNo
      });
      onLogin(user);
    } catch (error) {
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-fadeIn"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-fadeIn"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-8 animate-fadeIn">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 mb-4 transform rotate-3">
              <span className="font-bold text-2xl">VO</span>
           </div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">VolLab Connect</h1>
           <p className="text-gray-500 mt-2">Manage labs, track reports, everywhere.</p>
        </div>

        {/* Card Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          
          {/* Role Tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50/50">
            <button
              onClick={() => { setRole('VOLUNTEER'); setMode('LOGIN'); }}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                role === 'VOLUNTEER' 
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <UserIcon size={18} /> Volunteer
            </button>
            <button
              onClick={() => { setRole('ADMIN'); setMode('LOGIN'); }}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                role === 'ADMIN' 
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Shield size={18} /> Admin
            </button>
          </div>

          <div className="p-8">
            {/* Animated Form Container */}
            <div className="animate-fadeIn">
              
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {mode === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-sm text-gray-500">
                  {mode === 'LOGIN' 
                    ? `Please enter your ${role.toLowerCase()} details` 
                    : 'Fill in your information to join'}
                </p>
              </div>

              {mode === 'LOGIN' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-4">
                    <div className="relative group">
                      <div className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                        <Phone size={18} />
                      </div>
                      <input 
                          type="text" 
                          required
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                          placeholder={role === 'ADMIN' ? "Username" : "Mobile Number"}
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                      />
                    </div>
                    <div className="relative group">
                      <div className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                        <Key size={18} />
                      </div>
                      <input 
                          type="password" 
                          required
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  {role === 'ADMIN' && (
                     <div className="text-xs text-center p-2 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-100">
                        Default Password: <b>1111</b>
                     </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all flex justify-center items-center gap-2 shadow-lg shadow-indigo-200"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                      <>Sign In <ChevronRight size={18} /></>
                    )}
                  </button>

                  {role === 'VOLUNTEER' && (
                    <div className="text-center mt-6 pt-4 border-t border-gray-100">
                      <span className="text-gray-500 text-sm">New to VolLab? </span>
                      <button 
                        type="button"
                        onClick={() => setMode('SIGNUP')}
                        className="text-indigo-600 font-bold text-sm hover:underline ml-1"
                      >
                        Register Now
                      </button>
                    </div>
                  )}
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 ml-1">Full Name</label>
                        <input 
                            type="text" required 
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 ml-1">Birth Date</label>
                        <input 
                            type="date" required 
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                            value={formData.dob}
                            onChange={e => setFormData({...formData, dob: e.target.value})}
                        />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1">State</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                      <select 
                          required 
                          className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none"
                          value={formData.state}
                          onChange={e => setFormData({...formData, state: e.target.value})}
                      >
                          <option value="">Select your state</option>
                          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 ml-1">Mobile</label>
                        <input 
                            type="tel" required 
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                            value={mobile}
                            onChange={e => setMobile(e.target.value)}
                        />
                    </div>
                     <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 ml-1">Email</label>
                        <input 
                            type="email" required 
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                  </div>
                  
                   <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 ml-1">Volunteer ID</label>
                        <input 
                            type="text" required 
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                            value={formData.volNo}
                            onChange={e => setFormData({...formData, volNo: e.target.value})}
                        />
                    </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 ml-1">Password</label>
                        <input 
                            type="password" required 
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 ml-1">Confirm</label>
                        <input 
                            type="password" required 
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                            value={formData.confirmPassword}
                            onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                        />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-4 shadow-md"
                  >
                     {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
                  </button>
                   <div className="text-center mt-3">
                    <span className="text-gray-500 text-sm">Already have an ID? </span>
                    <button 
                      type="button"
                      onClick={() => setMode('LOGIN')}
                      className="text-indigo-600 font-bold text-sm hover:underline"
                    >
                      Login
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-8">© 2024 VolLab Connect. Secure & Private.</p>
      </div>
    </div>
  );
};