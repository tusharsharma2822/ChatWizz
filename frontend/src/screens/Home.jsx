import { useState } from 'react'
import { Link } from 'react-router-dom'

const features = [
	{
		icon: (
			<svg
				className="w-8 h-8 text-cyan-400"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M13 16h-1v-4h-1m4 4h1a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v7a2 2 0 002 2h1"
				/>
			</svg>
		),
		title: 'Real-time Chat',
		desc: 'Instant messaging with friends and groups, powered by a fast backend.',
	},
	{
		icon: (
			<svg
				className="w-8 h-8 text-emerald-400"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 0V4m0 8v8"
				/>
			</svg>
		),
		title: 'Secure & Private',
		desc: 'End-to-end encryption keeps your conversations safe and private.',
	},
	{
		icon: (
			<svg
				className="w-8 h-8 text-cyan-400"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5"
				/>
			</svg>
		),
		title: 'Easy to Use',
		desc: 'Modern, intuitive interface for seamless chatting on any device.',
	},
]

const Home = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	// Scroll to features section
	const handleFeatureClick = () => {
		const featuresSection = document.getElementById('features');
		if (featuresSection) {
			featuresSection.scrollIntoView({ behavior: 'smooth' });
		}
		setMobileMenuOpen(false);
	};

	return (
		<div className="min-h-screen flex flex-col bg-black font-sans text-white">
			{/* Header */}
			<header className="sticky top-0 z-10 bg-black/95 shadow-md backdrop-blur flex items-center justify-between px-6 py-4">
				<Link
					to="/"
					className="flex items-center gap-2 text-2xl font-bold text-cyan-400 font-sans"
				>
					<span className="bg-cyan-400 rounded-full w-8 h-8 flex items-center justify-center text-black font-extrabold">
						C
					</span>
					ChatWizz
				</Link>
				<nav className="hidden md:flex gap-8 text-lg font-medium">
					<Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
					<button type="button" onClick={handleFeatureClick} className="hover:text-cyan-400 transition-colors bg-transparent focus:outline-none">Features</button>
					<Link to="/login" className="hover:text-cyan-400 transition-colors">Login</Link>
					<Link to="/register" className="hover:text-cyan-400 transition-colors">Register</Link>
				</nav>
				<button
					onClick={() => setMobileMenuOpen((prev) => !prev)}
					className="md:hidden text-gray-300 hover:text-cyan-400 focus:outline-none"
					aria-label="Open mobile menu"
				>
					<svg
						className="w-7 h-7"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			</header>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className="md:hidden fixed inset-0 z-40 bg-black/90 flex flex-col items-center justify-center space-y-8 text-lg font-medium animate-fade-in">
					<button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-cyan-400 focus:outline-none" aria-label="Close menu">
						<svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
					<Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-400 transition-colors">Home</Link>
					<button type="button" onClick={handleFeatureClick} className="hover:text-cyan-400 transition-colors bg-transparent focus:outline-none">Features</button>
					<Link to="/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-400 transition-colors">Login</Link>
					<Link to="/register" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-400 transition-colors">Register</Link>
				</div>
			)}

			{/* Hero Section */}
			<section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
				<h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight font-sans" style={{fontFamily: 'Inter, Poppins, sans-serif'}}>Connect. Chat. Collaborate.</h1>
				<p className="text-lg md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto font-sans">
					Experience seamless, secure, and real-time messaging with your friends
					and teams. All in one modern chat platform.
				</p>
				<Link
					to="/register"
					className="inline-block px-8 py-3 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 text-black font-semibold rounded-lg shadow-lg transition-all duration-200 text-lg focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:outline-none hover:scale-105 hover:shadow-xl font-sans"
				>
					Get Started
				</Link>
			</section>

			{/* Features Section */}
			<section id="features" className="py-14 px-4 bg-black">
				<div className="max-w-5xl mx-auto">
					<h2 className="text-3xl font-bold text-center mb-10 text-white font-sans">Features</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{features.map((f, i) => (
							<div
								key={i}
								className="bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition-all duration-200 hover:shadow-2xl hover:-translate-y-2 hover:bg-gray-700 hover:ring-2 hover:ring-cyan-400 cursor-pointer"
							>
								<div className="mb-4">{f.icon}</div>
								<h3 className="text-xl font-semibold mb-2 text-emerald-400 font-sans">{f.title}</h3>
								<p className="text-gray-300 font-sans">{f.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="mt-auto py-6 bg-black text-center text-gray-400 text-sm font-sans">
				&copy; {new Date().getFullYear()} ChatWizz. All rights reserved.
			</footer>
		</div>
	)
}

export default Home