import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowRight, Server, Terminal, MonitorSmartphone } from "lucide-react";

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
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans">
      {/* Navbar */}
      <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">TechOps<span className="text-blue-600">.</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link href="/" className="text-blue-600 dark:text-blue-400">Beranda</Link>
            <Link href="#portofolio" className="hover:text-gray-900 dark:hover:text-white transition-colors">Portofolio</Link>
          </nav>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Hubungi Kami
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Tersedia untuk proyek baru
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Transformasi Ide Menjadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Realitas Digital</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
              Kami membantu bisnis skala enterprise dan startup berkembang lebih cepat melalui pengembangan perangkat lunak kustom yang *scalable*, aman, dan berpusat pada pengguna.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#portofolio" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                Lihat Portofolio
              </a>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-full hover:border-gray-900 dark:hover:border-gray-600 transition-colors">
                Konsultasi Gratis
              </a>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
            <div className="relative rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-800/50 bg-gray-50 dark:bg-gray-900 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
                alt="Digital Transformation"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid Section */}
      <section id="portofolio" className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Portofolio Pilihan</h2>
              <p className="text-gray-600 dark:text-gray-400">Jelajahi beberapa proyek terbaru kami di mana kami memecahkan masalah teknis yang kompleks dan memberikan solusi bisnis yang nyata.</p>
            </div>
            <Link href="/projects" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Lihat Semua <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(!projects || projects.length === 0) ? (
              <div className="col-span-full py-20 text-center text-gray-500">Belum ada portofolio yang dipublikasikan.</div>
            ) : (
              projects.map((project) => {
                const primaryImage = project.project_images?.find((img: any) => img.is_primary)?.image_url
                  || project.project_images?.[0]?.image_url;
                const categories = project.project_categories?.map((pc: any) => pc.categories?.name) || [];

                return (
                  <Link href={`/projects/${project.id}`} key={project.id} className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {primaryImage ? (
                        <img
                          src={primaryImage}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <MonitorSmartphone className="w-12 h-12 opacity-20" />
                        </div>
                      )}
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {categories.slice(0, 2).map((cat: string, i: number) => (
                          <span key={i} className="px-3 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                            {cat}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm flex-1 mb-6">
                        {project.challenge || "Deskripsi tantangan proyek."}
                      </p>
                      <div className="inline-flex items-center text-sm font-medium text-gray-900 dark:text-white mt-auto">
                        Baca Selengkapnya
                        <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
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
      <footer className="bg-gray-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 via-gray-900 to-gray-900"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Siap Membangun Masa Depan Digital Anda?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Diskusikan visi Anda dengan tim ahli kami dan mari ciptakan solusi teknologi yang *impactful* bersama-sama.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-900 bg-white rounded-full hover:bg-gray-100 transition-colors">
              Hubungi Kami Sekarang
            </a>
            <a href="mailto:hello@techops.id" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border-2 border-gray-700 rounded-full hover:border-gray-500 hover:bg-gray-800 transition-colors">
              Jadwalkan Demo
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} TechOps Solution. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/dashboard" className="hover:text-white transition-colors">Admin Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
