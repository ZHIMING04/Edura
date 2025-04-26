import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
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
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
