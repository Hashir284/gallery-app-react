import React, { useState } from 'react'
import { Link } from 'react-router'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../initialize'

const Forget = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleReset = async (e) => {
    e.preventDefault()
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email.' })
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      setMessage({ type: 'success', text: 'Password reset link sent successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message.replace("Firebase: ", "") })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent tracking-tight">Reset Password</h2>
          <p className="text-slate-400 text-xs mt-2">Enter your email to recover your account</p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          {message.text && (
            <div className={`border text-xs p-3 rounded-xl text-center font-medium ${message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setMessage({ type: '', text: '' }) }} placeholder="you@example.com" className="w-full bg-slate-950/50 border border-slate-800 focus:border-amber-400/50 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all" />
          </div>

          <button type="submit" className="w-full bg-amber-400 text-black rounded-xl py-3 text-sm font-bold hover:bg-amber-500 shadow-lg shadow-amber-400/10 transition-all">Send Reset Link</button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-amber-400 transition-colors">Back to Log In</Link>
        </div>
      </div>
    </div>
  )
}

export default Forget