import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Code2, ExternalLink, Terminal, CheckCircle2, AlertCircle } from "lucide-react";
import {
  SiReact, SiNextdotjs, SiTailwindcss, SiTypescript, SiJavascript,
  SiNodedotjs, SiPython, SiPostgresql, SiMongodb, SiFirebase,
  SiSupabase, SiDocker, SiVuedotjs, SiAngular, SiFigma,
  SiFlutter, SiLaravel, SiBootstrap
} from "react-icons/si";

// Helper function to get an icon based on tag name
function getTechIcon(tagName: string) {
  const name = tagName.toLowerCase();
  if (name.includes('react')) return <SiReact className="w-6 h-6 text-[#61DAFB]" />;
  if (name.includes('next')) return <SiNextdotjs className="w-6 h-6 text-black dark:text-white" />;
  if (name.includes('tailwind')) return <SiTailwindcss className="w-6 h-6 text-[#06B6D4]" />;
  if (name.includes('typescript') || name.includes('ts')) return <SiTypescript className="w-6 h-6 text-[#3178C6]" />;
  if (name.includes('javascript') || name.includes('js')) return <SiJavascript className="w-6 h-6 text-[#F7DF1E]" />;
  if (name.includes('node')) return <SiNodedotjs className="w-6 h-6 text-[#339933]" />;
  if (name.includes('python')) return <SiPython className="w-6 h-6 text-[#3776AB]" />;
  if (name.includes('postgres') || name.includes('sql')) return <SiPostgresql className="w-6 h-6 text-[#4169E1]" />;
  if (name.includes('mongo')) return <SiMongodb className="w-6 h-6 text-[#47A248]" />;
  if (name.includes('firebase')) return <SiFirebase className="w-6 h-6 text-[#FFCA28]" />;
  if (name.includes('supabase')) return <SiSupabase className="w-6 h-6 text-[#3ECF8E]" />;
  if (name.includes('docker')) return <SiDocker className="w-6 h-6 text-[#2496ED]" />;
  if (name.includes('vue')) return <SiVuedotjs className="w-6 h-6 text-[#4FC08D]" />;
  if (name.includes('angular')) return <SiAngular className="w-6 h-6 text-[#DD0031]" />;
  if (name.includes('figma')) return <SiFigma className="w-6 h-6 text-[#F24E1E]" />;
  if (name.includes('flutter')) return <SiFlutter className="w-6 h-6 text-[#02569B]" />;
  if (name.includes('laravel')) return <SiLaravel className="w-6 h-6 text-[#FF2D20]" />;
  if (name.includes('bootstrap') || name.includes('boostrap')) return <SiBootstrap className="w-6 h-6 text-[#7952B3]" />;

  // Default icon if no match found
  return <Code2 className="w-6 h-6 text-gray-500" />;
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  const { data: project, error } = await supabase
    .from("projects")
    .select(`
      *,
      project_images(image_url, is_primary),
      project_categories(categories(name)),
      project_tags(tags(name))
    `)
    .eq("id", projectId)
    .single();

  if (error) {
    return <div className="p-20 text-red-500 font-bold">Error fetching project: {error.message}</div>;
  }
  if (!project) {
    notFound();
  }

  const primaryImage = project.project_images?.find((img: any) => img.is_primary)?.image_url
    || project.project_images?.[0]?.image_url;

  const galleryImages = project.project_images?.filter((img: any) => !img.is_primary) || [];

  const categories = project.project_categories?.map((pc: any) => pc.categories?.name) || [];
  const tags = project.project_tags?.map((pt: any) => pt.tags?.name) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans selection:bg-blue-500/30">
      {/* Premium Navbar */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 dark:bg-gray-950/70 border-b border-gray-200/50 dark:border-gray-800/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="group flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Kembali ke Beranda
          </Link>
          <div className="font-bold text-2xl tracking-tight text-gray-900 dark:text-white">
            TechOps<span className="text-blue-600">.</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        {/* Soft Background Mesh Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map((cat: string, i: number) => (
                <span key={i} className="px-5 py-2 text-sm font-semibold bg-white/80 dark:bg-gray-900/80 text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-800 rounded-full shadow-sm backdrop-blur-md">
                  {cat}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white mb-8">
              {project.title}
            </h1>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              {project.live_demo_url && (
                <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5">
                  <ExternalLink className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" /> Live Demo
                </a>
              )}
              {project.repo_url && (
                <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold border border-gray-200 dark:border-gray-800 rounded-full hover:border-gray-300 dark:hover:border-gray-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                  <Terminal className="w-5 h-5 mr-2 group-hover:text-blue-500 transition-colors" /> Source Code
                </a>
              )}
            </div>
          </div>

          {/* Featured Image Mockup */}
          {primaryImage && (
            <div className="relative mx-auto rounded-2xl lg:rounded-[2rem] p-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100/20 dark:to-gray-900/20 pointer-events-none" />
              <div className="rounded-xl lg:rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-900 ring-1 ring-inset ring-gray-900/10 dark:ring-white/10">
                <img
                  src={primaryImage}
                  alt={project.title}
                  className="w-full object-cover transform hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content: Challenge & Solution */}
      <section className="py-24 px-6 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Challenge Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 lg:p-12 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 dark:bg-red-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              <div className="flex items-center gap-4 mb-8 relative">
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 shadow-inner">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">The Challenge</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap text-lg relative">
                {project.challenge || "Detail tantangan belum ditambahkan."}
              </p>
            </div>

            {/* Solution Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 lg:p-12 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              <div className="flex items-center gap-4 mb-8 relative">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">The Solution</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap text-lg relative">
                {project.solution || "Detail solusi belum ditambahkan."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Architecture */}
      {tags.length > 0 && (
        <section className="py-24 bg-white dark:bg-gray-900/30 px-6 border-y border-gray-200/50 dark:border-gray-800/50 overflow-hidden relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 blur-3xl rounded-full" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 dark:bg-purple-500/10 blur-3xl rounded-full" />

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h2 className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-12">Technology Stack</h2>
            <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
              {tags.map((tag: string, i: number) => (
                <div key={i} className="group flex items-center gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-default">
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {getTechIcon(tag)}
                  </div>
                  <span className="text-base font-semibold text-gray-700 dark:text-gray-200">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* System Interface Highlights */}
      {galleryImages.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">Gallery & Highlights</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400">Sneak peek into the actual interface of the product.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryImages.map((img: any, i: number) => (
                <div key={i} className="group rounded-3xl overflow-hidden border border-gray-200/50 dark:border-gray-800/50 shadow-sm hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-900 aspect-video relative">
                  <img src={img.image_url} alt={`Interface ${i + 1}`} className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Footer Section */}
      <footer className="bg-gray-900 text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-gray-900 to-gray-900 pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-8">Siap Membangun Masa Depan Digital Anda?</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Diskusikan visi Anda dengan tim ahli kami dan mari ciptakan solusi teknologi yang <span className="text-white font-medium">impactful</span> bersama-sama.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gray-900 bg-white rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              Hubungi Kami Sekarang
            </a>
            <a href="mailto:hello@techops.id" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white border border-gray-700 rounded-full hover:border-gray-500 hover:bg-gray-800 transition-all">
              Jadwalkan Demo
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
