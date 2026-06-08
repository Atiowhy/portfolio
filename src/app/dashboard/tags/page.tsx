import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Trash2 } from "lucide-react";

export default async function TagsPage() {
  const supabase = await createClient();
  const { data: tags } = await supabase
    .from("tags")
    .select("*")
    .order("created_at", { ascending: false });

  async function addTag(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    if (!name) return;

    const supabase = await createClient();
    const { error } = await supabase.from("tags").insert([{ name }]);
    
    if (error) {
      console.error("Supabase Error Insert Tag:", error);
      throw new Error(error.message);
    }
    
    revalidatePath("/dashboard/tags");
  }

  async function deleteTag(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;

    const supabase = await createClient();
    const { error } = await supabase.from("tags").delete().eq("id", id);
    
    if (error) {
      console.error("Supabase Error Delete Tag:", error);
      throw new Error(error.message);
    }
    
    revalidatePath("/dashboard/tags");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Manajemen Tags</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Tambah Tag</h2>
            <form action={addTag} className="flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Tag</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                  placeholder="Misal: React, Node.js"
                />
              </div>
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Simpan
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 font-medium text-gray-600 dark:text-gray-300">Nama Tag</th>
                  <th className="px-6 py-4 font-medium text-gray-600 dark:text-gray-300 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tags?.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      Belum ada tag
                    </td>
                  </tr>
                ) : (
                  tags?.map((tag) => (
                    <tr key={tag.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{tag.name}</td>
                      <td className="px-6 py-4 text-right">
                        <form action={deleteTag}>
                          <input type="hidden" name="id" value={tag.id} />
                          <button 
                            type="submit" 
                            className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Hapus Tag"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
