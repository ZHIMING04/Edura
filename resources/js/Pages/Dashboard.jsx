import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

const floatingAnimation = {
    initial: { y: 0 },
    animate: {
        y: [-10, 10, -10],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <motion.h2 
                    className="text-2xl font-bold leading-tight text-rose-400"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Dashboard
                </motion.h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 min-h-screen bg-gradient-to-br from-rose-50 to-yellow-50">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <motion.div 
                        className="overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg sm:rounded-2xl border border-rose-100"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="p-8">
                            <motion.div 
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                variants={fadeIn}
                                initial="initial"
                                animate="animate"
                            >
                                <motion.div 
                                    className="p-6 bg-gradient-to-br from-rose-100 to-yellow-100 rounded-xl"
                                    variants={floatingAnimation}
                                    initial="initial"
                                    animate="animate"
                                >
                                    <h3 className="text-xl font-semibold text-rose-600 mb-4">Welcome Back!</h3>
                                    <p className="text-gray-600">You're logged in and ready to go!</p>
                                </motion.div>

                                <motion.div 
                                    className="p-6 bg-gradient-to-br from-yellow-100 to-rose-100 rounded-xl"
                                    variants={floatingAnimation}
                                    initial="initial"
                                    animate="animate"
                                >
                                    <h3 className="text-xl font-semibold text-yellow-600 mb-4">Quick Stats</h3>
                                    <p className="text-gray-600">Your dashboard overview will appear here.</p>
                                </motion.div>
                            </motion.div>

                            <motion.div 
                                className="mt-8 p-6 bg-white/50 rounded-xl border border-rose-100"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <h3 className="text-lg font-medium text-rose-500 mb-4">Recent Activity</h3>
                                <p className="text-gray-600">Your recent activities will be displayed here.</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
