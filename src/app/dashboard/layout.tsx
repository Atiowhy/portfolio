import Link from "next/link";
import { Folder, Tags, Grid, LogOut, LayoutDashboard } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#050511] text-gray-200 selection:bg-purple-500/30">
      {/* Decorative background glow for dashboard */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full mix-blend-screen filter blur-[150px] opacity-60 pointer-events-none"></div>

      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-white/10 hidden md:block z-10">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Admin<span className="text-cyan-400">Panel</span>
          </h2>
        </div>
        <nav className="mt-6 px-4 flex flex-col gap-2">
          <Link href="/dashboard" className="flex items-center px-4 py-3 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-transparent transition-all duration-300 rounded-lg group">
            <LayoutDashboard className="w-5 h-5 mr-3 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            Dashboard
          </Link>
          <Link href="/dashboard/projects" className="flex items-center px-4 py-3 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/30 border border-transparent transition-all duration-300 rounded-lg group">
            <Folder className="w-5 h-5 mr-3 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            Proyek
          </Link>
          <Link href="/dashboard/categories" className="flex items-center px-4 py-3 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-transparent transition-all duration-300 rounded-lg group">
            <Grid className="w-5 h-5 mr-3 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            Kategori
          </Link>
          <Link href="/dashboard/tags" className="flex items-center px-4 py-3 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/30 border border-transparent transition-all duration-300 rounded-lg group">
            <Tags className="w-5 h-5 mr-3 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            Tags
          </Link>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-white/5 bg-black/20">
          <form action={async () => {
            "use server";
            const supabase = await createClient();
            await supabase.auth.signOut();
            redirect("/login");
          }}>
            <button className="flex w-full items-center px-4 py-3 text-red-400 border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all duration-300 rounded-lg group">
              <LogOut className="w-5 h-5 mr-3 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10 p-8">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  );
}
