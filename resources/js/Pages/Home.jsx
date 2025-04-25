export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Edura</h1>
                    <p className="text-gray-600 mb-8">A modern Laravel 11 application with React and Inertia.js</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-indigo-50 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold text-indigo-700 mb-2">React Components</h2>
                            <p className="text-gray-600">Build dynamic UIs with React components</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold text-purple-700 mb-2">Laravel Backend</h2>
                            <p className="text-gray-600">Powered by Laravel's elegant backend</p>
                        </div>
                    </div>
                    
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full transition duration-300">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
}
