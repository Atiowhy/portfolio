import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import { SubmitButton } from "@/components/SubmitButton";

export default async function ProjectsPage() {
  const supabase = await createClient();

  // Fetch projects with their primary image
  const { data: projects } = await supabase
    .from("projects")
    .select(`
      *,
      project_images(image_url, is_primary)
    `)
    .order("created_at", { ascending: false });

  async function deleteProject(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;

    const supabase = await createClient();
    await supabase.from("projects").delete().eq("id", id);
    revalidatePath("/dashboard/projects");
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manajemen Proyek</h1>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Proyek
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <th className="px-6 py-4 font-medium text-gray-600 dark:text-gray-300">Gambar</th>
              <th className="px-6 py-4 font-medium text-gray-600 dark:text-gray-300">Judul Proyek</th>
              <th className="px-6 py-4 font-medium text-gray-600 dark:text-gray-300">Tanggal Dibuat</th>
              <th className="px-6 py-4 font-medium text-gray-600 dark:text-gray-300 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {(!projects || projects.length === 0) ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Belum ada proyek yang ditambahkan.
                </td>
              </tr>
            ) : (
              projects.map((project) => {
                const primaryImage = project.project_images?.find((img: any) => img.is_primary)?.image_url
                  || project.project_images?.[0]?.image_url;

                return (
                  <tr key={project.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      {primaryImage ? (
                        <img src={primaryImage} alt={project.title} className="w-16 h-16 object-cover rounded-md border border-gray-200 dark:border-gray-700" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">{project.title}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {new Date(project.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/projects/${project.id}/edit`}
                          className="text-blue-500 hover:text-blue-700 p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          title="Edit Proyek"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <form action={deleteProject}>
                          <input type="hidden" name="id" value={project.id} />
                          <SubmitButton
                            defaultText={<Trash2 className="w-5 h-5" />}
                            loadingText=""
                            className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Hapus Proyek"
                          />
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
