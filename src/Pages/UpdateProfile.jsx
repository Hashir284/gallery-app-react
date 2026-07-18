import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { updateProfile } from 'firebase/auth'
import { auth } from '../initialize'

const UpdateProfile = () => {
  const currentUser = auth.currentUser
  const [username, setUsername] = useState(currentUser?.displayName || '')
  const [photoUrl, setPhotoUrl] = useState(currentUser?.photoURL || '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleUpdate = async (e) => {
    e.preventDefault()
    
    if (!username.trim()) {
      setError('Username cannot be empty.')
      return
    }

    try {
      setError('')
      setSuccess('')
      setLoading(true)

      // Firebase main auth profile update execution
      await updateProfile(auth.currentUser, {
        displayName: username.trim(),
        photoURL: photoUrl.trim() || null
      })

      setSuccess('Profile successfully synchronized!')
      
      // Khud ba khud 1.5 seconds baad dashboard par wapas le jayega
      setTimeout(() => {
        navigate('/')
      }, 1000)

    } catch (err) {
      console.error("Profile Update Exception:", err)
      setError(err.message.replace("Firebase: ", ""))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent uppercase tracking-wider">
            Update Profile
          </h2>
          <p className="text-slate-500 text-xs mt-2 uppercase tracking-wide">
            Modify your personal studio credentials
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5 text-left">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-xl text-center">
              {success}
            </div>
          )}
          
          {/* Username Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Workspace Username
            </label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => { setUsername(e.target.value); setError('') }} 
              placeholder="Enter new username" 
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400/50 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all text-slate-200 placeholder:text-slate-700" 
              disabled={loading}
            />
          </div>

          {/* Profile Picture URL Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Profile Avatar Image URL (Optional)
            </label>
            <input 
              type="url" 
              value={photoUrl} 
              onChange={(e) => { setPhotoUrl(e.target.value); setError('') }} 
              placeholder="https://example.com/avatar.jpg" 
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400/50 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all text-slate-200 placeholder:text-slate-700" 
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-amber-400 text-black rounded-xl py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-amber-500 shadow-lg shadow-amber-400/5 transition-all cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Updating Credentials...' : 'Save Profile Changes'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wider">
            ← Cancel & Return To Studio
          </Link>
        </div>

      </div>
    </div>
  )
}

export default UpdateProfile