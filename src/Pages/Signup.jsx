import React, { useState } from 'react'
import { Link } from 'react-router'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../initialize'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!username || !email || !password) {
      setError('Please fill in all fields.')
      return
    }
    try {
      // 1. Firebase auth user create karein
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // 2. User ke profile mein display name (username) save karein
      await updateProfile(userCredential.user, {
        displayName: username
      })
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent tracking-tight">
            Create Account
          </h2>
          <p className="text-slate-400 text-xs mt-2">Join the premium visual workspace</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl text-center">
              {error}
            </div>
          )}
          
          {/* Username Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => { setUsername(e.target.value); setError('') }} 
              placeholder="Enter your username" 
              className="w-full bg-slate-950/50 border border-slate-800 focus:border-amber-400/50 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all text-slate-200 placeholder:text-slate-600" 
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => { setEmail(e.target.value); setError('') }} 
              placeholder="you@example.com" 
              className="w-full bg-slate-950/50 border border-slate-800 focus:border-amber-400/50 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all text-slate-200 placeholder:text-slate-600" 
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => { setPassword(e.target.value); setError('') }} 
              placeholder="••••••••" 
              className="w-full bg-slate-950/50 border border-slate-800 focus:border-amber-400/50 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all text-slate-200 placeholder:text-slate-600" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-amber-400 text-black rounded-xl py-3 text-sm font-bold hover:bg-amber-500 shadow-lg shadow-amber-400/10 transition-all cursor-pointer"
          >
            Get Started
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-amber-400 transition-colors">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup