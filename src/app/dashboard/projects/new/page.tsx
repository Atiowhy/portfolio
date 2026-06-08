import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectForm from "./ProjectForm";

export default async function NewProjectPage() {
  const supabase = await createClient();

  // Fetch categories and tags for the form
  const { data: categories } = await supabase.from("categories").select("*").order("name");
  const { data: tags } = await supabase.from("tags").select("*").order("name");

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/projects" className="text-gray-500 hover:text-gray-900 dark:hover:text-white mr-4">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tambah Proyek Baru</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        <ProjectForm categories={categories || []} tags={tags || []} />
      </div>
    </div>
  );
}
