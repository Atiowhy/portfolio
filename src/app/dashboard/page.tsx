import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch stats
  const { count: projectsCount } = await supabase.from("projects").select("*", { count: "exact", head: true });
  const { count: categoriesCount } = await supabase.from("categories").select("*", { count: "exact", head: true });
  const { count: tagsCount } = await supabase.from("tags").select("*", { count: "exact", head: true });

  // Fetch recent projects
  const { data: projects } = await supabase
    .from("projects")
    .select(`
      *,
      project_images(image_url, is_primary),
      project_categories(categories(name))
    `)
    .order("created_at", { ascending: false });

  async function deleteProject(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    const supabase = await createClient();
    await supabase.from("projects").delete().eq("id", id);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Project Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your portfolio projects, categories, and special awards.</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Project
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center items-center">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Total Projects</h3>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{projectsCount || 0}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center items-center">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Total Categories</h3>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{categoriesCount || 0}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center items-center">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Total Tags</h3>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{tagsCount || 0}</p>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Project Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date Added</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(!projects || projects.length === 0) ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  No projects found. Click "Add New Project" to get started.
                </td>
              </tr>
            ) : (
              projects.map((project) => {
                const primaryImage = project.project_images?.find((img: any) => img.is_primary)?.image_url
                  || project.project_images?.[0]?.image_url;
                const categories = project.project_categories?.map((pc: any) => pc.categories?.name).join(", ");

                return (
                  <tr key={project.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {primaryImage ? (
                          <img src={primaryImage} alt={project.title} className="w-12 h-12 object-cover rounded-md border border-gray-200 dark:border-gray-700" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 text-[10px]">
                            No Img
                          </div>
                        )}
                        <span className="font-medium text-gray-900 dark:text-gray-100">{project.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                      {categories || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Published
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                      {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/dashboard/projects/${project.id}/edit`}
                          className="text-gray-400 hover:text-blue-600 p-2 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <form action={deleteProject}>
                          <input type="hidden" name="id" value={project.id} />
                          <button
                            type="submit"
                            className="text-gray-400 hover:text-red-600 p-2 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
