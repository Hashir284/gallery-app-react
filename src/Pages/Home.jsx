import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { auth, db } from '../initialize'
import axios from 'axios'
import { addDoc, collection, getDocs, query, orderBy } from 'firebase/firestore'

function Home({ change }) {
    // Gallery items aur dropdown state control
    const [galleryItems, setGalleryItems] = useState([])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    // Auth/User structural checks safely handled
    const currentUser = auth.currentUser
    const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'
    const initailUser = userName.slice(0, 1).toUpperCase()

    // Firestore se data load karne ka flow reload handles ke liye
    useEffect(() => {
        const fetchGallery = async () => {
            if (!currentUser) return
            try {
                const q = query(collection(db, 'user', currentUser.uid, 'images'), orderBy('posted_time', 'desc'))
                const querySnapshot = await getDocs(q)
                const items = []
                querySnapshot.forEach((doc) => {
                    items.push({ id: doc.id, ...doc.data() })
                })
                setGalleryItems(items)
            } catch (error) {
                console.error("Error fetching studio deck data:", error)
            }
        }
        fetchGallery()
    }, [currentUser])

    // FORM SUBMIT FUNCTION
    const handleUploadSubmit = async (e) => {
        e.preventDefault()

        const titleInput = e.target.elements.title.value
        const fileInput = e.target.elements.imageFile.files[0]

        if (!titleInput || !fileInput) {
            return alert("Title aur Image dono zaroori hain!")
        }

        try {
            setIsUploading(true)
            let formData = new FormData()
            formData.append("file", fileInput)
            formData.append("upload_preset", "gallery") // Cloudinary console verified whitelisted configurations

            let imageRes = await axios.post(
                "https://api.cloudinary.com/v1_1/dl4g6bgml/image/upload", 
                formData
            )
            const cloudImageUrl = imageRes.data.secure_url 

            let newItem = {
                user_name: currentUser?.displayName || userName,
                profile: currentUser?.photoURL || null,
                email: currentUser?.email || '',
                userId: currentUser?.uid || '',
                title: titleInput,
                posted_time: Date.now(),
                url: cloudImageUrl || null,
            }

            // Save inside specific collection
            const docRef = await addDoc(collection(db, 'user', currentUser.uid, 'images'), newItem)
            console.log("Document successfully written with ID: ", docRef.id)

            const savedItem = { ...newItem, id: docRef.id }
            setGalleryItems([savedItem, ...galleryItems]) 
            e.target.reset() 
            
        } catch (error) {
            if (error.response) {
                console.error("Cloudinary Engine Core Error:", error.response.data)
            } else {
                console.error("General Stream Exception:", error)
            }
            alert("Upload execution dropped! Check logs for details.")            
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className='min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans selection:bg-amber-400 selection:text-black'>

            {/* ORIGINAL PREMIUM VISUAL VIBE STUDIO HEADER */}
            <header className='max-w-7xl mx-auto mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-slate-900 pb-8 text-left'>
                <div>
                    <h1 className='text-2xl font-black tracking-wider text-slate-100 uppercase'>
                        Visual <span className='text-amber-400 font-light lowercase italic font-serif tracking-normal pr-1'>vibe</span> Studio
                    </h1>
                    <p className='text-slate-500 mt-1 text-xs font-medium tracking-wide uppercase'>
                        Welcome back <span className='text-slate-800 mx-1'>|</span> Personal Workspace
                    </p>
                </div>

                {/* HIGH-END AVATAR DROPDOWN */}
                <div className="relative self-start sm:self-center">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 p-2 pr-4 rounded-full transition-all duration-200 group focus:outline-none focus:border-amber-400/50 cursor-pointer"
                    >
                        {currentUser?.photoURL ? (
                            <img src={currentUser.photoURL} alt={userName} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-black font-bold text-sm flex items-center justify-center shadow-md">
                                {initailUser}
                            </div>
                        )}
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{userName}</span>
                        <svg className={`w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* DROPDOWN MENU */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-20 origin-top-right">
                            <Link to="/UpdateProfile" className="flex w-full px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors">Update Profile</Link>
                            <button onClick={change} className="flex w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors border-t border-slate-800/60 cursor-pointer">Log Out</button>
                        </div>
                    )}
                </div>
            </header>

            <main className='max-w-7xl mx-auto space-y-12'>

                {/* FORM CONTAINER */}
                <section className='bg-slate-900/40 border border-slate-900 rounded-3xl p-6 md:p-8 max-w-2xl mx-auto text-left'>
                    <h2 className='text-lg font-bold text-slate-200 mb-6 flex items-center gap-2'>
                        <span className='w-2 h-2 rounded-full bg-amber-400 animate-pulse'></span>
                        Upload New Creative Asset
                    </h2>

                    <form onSubmit={handleUploadSubmit} className='space-y-5'>
                        <div>
                            <label className='block text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2'>Asset Title</label>
                            <input
                                name="title"
                                type="text"
                                placeholder="Enter workspace image title..."
                                className='w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors placeholder:text-slate-600 text-slate-200'
                                disabled={isUploading}
                            />
                        </div>

                        <div>
                            <label className='block text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2'>Choose Visual File</label>
                            <input
                                name="imageFile"
                                type="file"
                                accept="image/*"
                                className='w-full text-sm text-slate-400 file:bg-slate-950 file:text-amber-400 file:border file:border-slate-800 file:py-2.5 file:px-4 file:rounded-xl file:mr-3 file:cursor-pointer hover:file:border-amber-400/40 file:transition-all'
                                disabled={isUploading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isUploading}
                            className={`w-full bg-amber-400 text-black font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl transition-all shadow-xl shadow-amber-400/5 cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-500'}`}
                        >
                            {isUploading ? 'Syncing Asset Deck...' : 'Add To Studio Deck'}
                        </button>
                    </form>
                </section>

                <hr className='border-slate-900 max-w-7xl mx-auto' />

                {/* LIVE VISUAL CARD GRID */}
                <section className='text-left'>
                    <h3 className='text-xl font-bold tracking-tight text-slate-200 mb-8'>Studio Deck Grid</h3>

                    {galleryItems.length > 0 ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                            {galleryItems.map((item) => (
                                <div key={item.id} className='group bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-amber-400/50 transition-all duration-300 shadow-xl'>
                                    <div className='h-52 w-full overflow-hidden relative bg-black/30'>
                                        <img className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-500' src={item.url} alt={item.title} />
                                    </div>
                                    <div className='p-4 bg-slate-900'>
                                        <h2 className='font-semibold text-base text-slate-200 group-hover:text-amber-400 transition-colors truncate'>{item.title}</h2>
                                        <p className='text-[10px] text-slate-500 uppercase tracking-wider font-mono mt-2'>Memory Container</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-24 border border-dashed border-slate-900 rounded-3xl bg-slate-900/10 max-w-4xl mx-auto'>
                            <h4 className='text-slate-400 font-bold text-sm'>Deck is currently empty</h4>
                            <p className='text-xs text-slate-600 mt-1'>Your uploaded studio elements will populate here in real-time cards.</p>
                        </div>
                    )}
                </section>

            </main>
        </div>
    )
}

export default Home