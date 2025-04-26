import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

const floatingAnimation = (delay = 0) => ({
    initial: { y: 0 },
    animate: {
        y: [-10, 10, -10],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay
        }
    }
});

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Edura - Empowering Education" />
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-yellow-50 to-rose-50 font-cabinet">
                <motion.img
                    id="background"
                    className="absolute -left-20 top-0 max-w-[877px] opacity-20"
                    src="https://laravel.com/assets/img/welcome/background.svg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    transition={{ duration: 1 }}
                />
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-rose-400 selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <motion.header 
                            className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex lg:col-start-2 lg:justify-center">
                                <motion.h1
                                    className="text-9xl font-cabinet font-black text-rose-600 tracking-tight leading-none"
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    EDURA
                                </motion.h1>
                            </div>
                            <nav className="-mx-3 flex flex-1 justify-end gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-xl px-6 py-3 text-lg font-cabinet font-bold text-rose-600 bg-white/80 backdrop-blur-sm shadow-lg ring-1 ring-rose-100/20 transition hover:bg-rose-50 hover:text-rose-700 hover:shadow-xl focus:outline-none focus-visible:ring-rose-400"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-xl px-6 py-3 text-lg font-cabinet font-bold text-rose-600 bg-white/80 backdrop-blur-sm shadow-lg ring-1 ring-rose-100/20 transition hover:bg-rose-50 hover:text-rose-700 hover:shadow-xl focus:outline-none focus-visible:ring-rose-400"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-xl px-6 py-3 text-lg font-cabinet font-bold text-white bg-rose-600 shadow-lg ring-1 ring-rose-100/20 transition hover:bg-rose-700 hover:shadow-xl focus:outline-none focus-visible:ring-rose-400"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </motion.header>

                        <motion.main 
                            className="mt-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
                                <motion.div
                                    className="flex flex-col items-start gap-6 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-lg ring-1 ring-rose-100/20 transition duration-300 hover:ring-rose-200/30 hover:shadow-xl focus:outline-none focus-visible:ring-rose-400 h-[320px] lg:col-span-5 lg:col-start-2"
                                    variants={floatingAnimation(0)}
                                    initial="initial"
                                    animate="animate"
                                >
                                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-rose-100 sm:size-16">
                                        <svg className="size-6 sm:size-7 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                    <div className="pt-3 sm:pt-5 lg:pt-0">
                                        <h2 className="text-3xl font-cabinet font-black text-rose-600 tracking-wider">
                                            Smart Recommendations
                                        </h2>
                                        <p className="mt-4 text-base/relaxed text-black-600 font-cabinet font-medium">
                                            Personalized learning paths and content recommendations powered by advanced AI algorithms, ensuring each student receives tailored educational experiences.
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="flex flex-col items-start gap-6 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-lg ring-1 ring-rose-100/20 transition duration-300 hover:ring-rose-200/30 hover:shadow-xl focus:outline-none focus-visible:ring-rose-400 h-[320px] lg:col-span-5"
                                    variants={floatingAnimation(1)}
                                    initial="initial"
                                    animate="animate"
                                >
                                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-rose-100 sm:size-16">
                                        <svg className="size-6 sm:size-7 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div className="pt-3 sm:pt-5">
                                        <h2 className="text-3xl font-cabinet font-black text-rose-600 tracking-wider">
                                            Participation Tracking
                                        </h2>
                                        <p className="mt-4 text-base/relaxed text-black-600 font-cabinet font-medium">
                                            Real-time monitoring of student engagement and progress, providing detailed analytics for both educators and learners to optimize the learning experience.
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="flex flex-col items-start gap-6 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-lg ring-1 ring-rose-100/20 transition duration-300 hover:ring-rose-200/30 hover:shadow-xl focus:outline-none focus-visible:ring-rose-400 h-[320px] lg:col-span-5 lg:col-start-3"
                                    variants={floatingAnimation(2)}
                                    initial="initial"
                                    animate="animate"
                                >
                                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-rose-100 sm:size-16">
                                        <svg className="size-6 sm:size-7 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div className="pt-3 sm:pt-5">
                                        <h2 className="text-3xl font-cabinet font-black text-rose-600 tracking-wider">
                                            AI-powered Talent Identification
                                        </h2>
                                        <p className="mt-4 text-base/relaxed text-black-600 font-cabinet font-medium">
                                            Advanced algorithms analyze student performance and potential, helping identify and nurture exceptional talents while providing personalized development pathways.
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    className="flex flex-col items-start gap-6 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-lg ring-1 ring-rose-100/20 transition duration-300 hover:ring-rose-200/30 hover:shadow-xl focus:outline-none focus-visible:ring-rose-400 h-[320px] lg:col-span-5"
                                    variants={floatingAnimation(3)}
                                    initial="initial"
                                    animate="animate"
                                >
                                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-rose-100 sm:size-16">
                                        <svg className="size-6 sm:size-7 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <div className="pt-3 sm:pt-5">
                                        <h2 className="text-3xl font-cabinet font-black text-rose-600 tracking-wider">
                                            Funding & Mentorship
                                        </h2>
                                        <p className="mt-4 text-base/relaxed text-black-600 font-cabinet font-medium">
                                            Access to educational grants, scholarships, and mentorship programs, connecting students with experienced professionals who can guide their academic and career journey.
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.main>

                        <motion.footer 
                            className="py-16 text-center text-sm text-rose-600 font-cabinet"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            Empowering Education Through Innovation
                        </motion.footer>
                    </div>
                </div>
            </div>
        </>
    );
}
