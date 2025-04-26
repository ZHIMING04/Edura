import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-rose-50 via-yellow-50 to-rose-50 font-cabinet pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <h1 className="text-4xl font-cabinet font-black text-rose-600 tracking-tight">EDURA</h1>
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white/80 backdrop-blur-sm px-6 py-8 shadow-lg ring-1 ring-rose-100/20 sm:max-w-md sm:rounded-2xl">
                {children}
            </div>
        </div>
    );
}
