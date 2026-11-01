import Link from 'next/link'
import { ProtectedRoute } from '@/components'
import { FloorPlanEditor } from '@/components/admin/floor-plan/FloorPlanEditor'
import { PERMISSIONS } from '@/config/constants/auth'
import { ROUTES } from '@/config/constants/route'
import { ArrowLeft, Map } from 'lucide-react'

export const metadata = {
    title: 'Floor Plan Editor | Foodie Admin',
}

export default function AdminFloorPlanPage() {
    return (
        <ProtectedRoute requiredRoles={[...PERMISSIONS.ADMIN_ONLY]}>
            <div
                className="min-h-screen pb-12"
                style={{
                    background: 'linear-gradient(135deg, #FAF6F0 0%, #F5EDE0 100%)',
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                {/* Header Navbar */}
                <header className="bg-amber-950 text-amber-50 sticky top-0 z-40 shadow-lg border-b border-amber-800/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href={ROUTES.ADMIN}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-900/60 hover:bg-amber-900 text-amber-200 text-sm font-semibold transition-all border border-amber-800/50"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>← Back to Admin</span>
                            </Link>
                            <div className="h-5 w-px bg-amber-800/60" />
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-amber-600/30 rounded-lg text-amber-300">
                                    <Map className="w-5 h-5 text-amber-400" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-black tracking-tight text-amber-100 font-serif">
                                        Floor Plan Editor
                                    </h1>
                                    <p className="text-xs text-amber-300/70">
                                        Configure dining areas, tables, obstacles and layout grid
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <FloorPlanEditor />
                </main>
            </div>
        </ProtectedRoute>
    )
}
