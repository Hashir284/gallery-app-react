import React, { useState } from 'react'
import { Link } from 'react-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../initialize'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent tracking-tight">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-xs mt-2">Log in to view the master image grid</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl text-center">{error}</div>}
          
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} placeholder="you@example.com" className="w-full bg-slate-950/50 border border-slate-800 focus:border-amber-400/50 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
              <Link to="/forget" className="text-xs text-amber-400/80 hover:text-amber-400 transition-colors">Forgot?</Link>
            </div>
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError('') }} placeholder="••••••••" className="w-full bg-slate-950/50 border border-slate-800 focus:border-amber-400/50 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all" />
          </div>

          <button type="submit" className="w-full bg-amber-400 text-black rounded-xl py-3 text-sm font-bold hover:bg-amber-500 shadow-lg shadow-amber-400/10 transition-all">Sign In</button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/signup" className="text-xs text-slate-400 hover:text-amber-400 transition-colors">Don't have an account? Sign up</Link>
        </div>
      </div>
    </div>
  )
}

export default Login