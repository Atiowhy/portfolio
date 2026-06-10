import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowRight, Terminal, MonitorSmartphone, Code2, Sparkles } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch recent projects with their primary image and categories
  const { data: projects } = await supabase
    .from("projects")
    .select(`
      *,
      project_images(image_url, is_primary),
      project_categories(categories(name))
    `)
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <div className="min-h-screen bg-[#050511] text-gray-200 font-sans selection:bg-purple-500/30 overflow-hidden relative">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[120px] opacity-50"></div>

      {/* Navbar */}
      <header className="fixed top-0 w-full glass-navbar z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.5)]">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
              YowCodes<span className="text-cyan-400">.</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Beranda</Link>
            <Link href="#portofolio" className="hover:text-purple-400 transition-colors">Portofolio</Link>
          </nav>
          <a
            href="https://wa.me/6285774471157"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex relative overflow-hidden px-6 py-2.5 rounded-full font-medium text-cyan-400 border border-cyan-500/50 bg-transparent hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300"
          >
            Hubungi Saya
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Tersedia untuk proyek masa depan
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Transformasi Ide Menjadi <br />
              <span className="neon-text">Realitas Digital</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-400 max-w-2xl leading-relaxed">
              Kami membantu bisnis skala enterprise dan startup berkembang lebih cepat melalui pengembangan perangkat lunak kustom yang <span className="text-gray-200 font-semibold">scalable</span>, aman, dan berpusat pada pengguna.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <a href="#portofolio" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-purple-500/50 rounded-full hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] hover:scale-105 transition-all duration-300">
                Lihat Portofolio
              </a>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-white/5 border border-white/20 backdrop-blur-lg rounded-full hover:bg-white/10 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300">
                Konsultasi Gratis
              </a>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-purple-500/30 blur-3xl rounded-full"></div>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-[0_0_50px_rgba(147,51,234,0.2)] backdrop-blur-sm aspect-[4/3] flex items-center justify-center">
              {/* Abstract Code/Tech Visualization */}
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
              <Code2 className="w-32 h-32 text-purple-500/50 absolute" />
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
                alt="Digital Transformation"
                className="w-full h-full object-cover mix-blend-overlay opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050511] via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid Section */}
      <section id="portofolio" className="py-24 relative z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,#0a0a1a_20%,#0a0a1a_80%,transparent)] -z-10"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Proyek <span className="text-purple-400">Pilihan</span></h2>
              <p className="text-gray-400">Jelajahi portofolio mutakhir kami yang dibangun dengan teknologi masa kini.</p>
            </div>
            <Link href="/projects" className="inline-flex items-center text-cyan-400 font-medium hover:text-cyan-300 transition-colors">
              Eksplorasi Semua <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(!projects || projects.length === 0) ? (
              <div className="col-span-full py-20 text-center text-gray-500 glass-card rounded-2xl">Transmisi data portofolio kosong.</div>
            ) : (
              projects.map((project) => {
                const primaryImage = project.project_images?.find((img: any) => img.is_primary)?.image_url
                  || project.project_images?.[0]?.image_url;
                const categories = project.project_categories?.map((pc: any) => pc.categories?.name) || [];

                return (
                  <Link href={`/projects/${project.id}`} key={project.id} className="group flex flex-col glass-card rounded-2xl overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden bg-black/50 border-b border-white/5">
                      {primaryImage ? (
                        <img
                          src={primaryImage}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1 opacity-80 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <MonitorSmartphone className="w-12 h-12 opacity-30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent opacity-80"></div>
                    </div>
                    <div className="p-8 flex flex-col flex-1 relative">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {categories.slice(0, 2).map((cat: string, i: number) => (
                          <span key={i} className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full">
                            {cat}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                        {project.title}
                      </h3>
                      <div
                        className="text-gray-400 line-clamp-2 text-sm flex-1 mb-6 prose prose-sm prose-invert"
                        dangerouslySetInnerHTML={{ __html: project.challenge || "Deskripsi tantangan proyek." }}
                      />
                      <div className="inline-flex items-center text-sm font-medium text-cyan-400 mt-auto">
                        Akses Sistem
                        <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <footer className="relative py-24 border-t border-white/10 mt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#050511] to-[#050511] -z-10"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">Siap Membangun <span className="neon-text">Masa Depan?</span></h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Diskusikan visi Anda dengan tim arsitek digital kami.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-purple-500/50 rounded-full hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] hover:scale-105 transition-all duration-300">
              Inisiasi Protokol
            </a>
            <a href="mailto:hello@techops.id" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-white/5 border border-white/20 backdrop-blur-lg rounded-full hover:bg-white/10 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300">
              Jadwalkan Transmisi
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} YowCodes. All systems operational.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/dashboard" className="hover:text-purple-400 transition-colors flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Admin Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
