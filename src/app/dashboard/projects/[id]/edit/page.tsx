import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EditProjectForm from "./EditProjectForm";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  // Fetch the existing project
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select(`
      *,
      project_images(id, image_url, is_primary),
      project_categories(category_id),
      project_tags(tag_id)
    `)
    .eq("id", projectId)
    .single();

  if (projectError || !project) {
    notFound();
  }

  // Fetch all categories and tags for the form
  const { data: categories } = await supabase.from("categories").select("*").order("name");
  const { data: tags } = await supabase.from("tags").select("*").order("name");

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/projects" className="text-gray-400 hover:text-cyan-400 mr-4 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-white tracking-tight">Edit <span className="text-purple-400">Proyek</span></h1>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 p-8">
        <EditProjectForm project={project} categories={categories || []} tags={tags || []} />
      </div>
    </div>
  );
}
