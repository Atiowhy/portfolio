import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SubmitButton } from "@/components/SubmitButton";

export default async function NewProjectPage() {
  const supabase = await createClient();

  // Fetch categories and tags for the form
  const { data: categories } = await supabase.from("categories").select("*").order("name");
  const { data: tags } = await supabase.from("tags").select("*").order("name");

  async function createProject(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const challenge = formData.get("challenge") as string;
    const solution = formData.get("solution") as string;
    const liveDemoUrl = formData.get("live_demo_url") as string;
    const repoUrl = formData.get("repo_url") as string;
    const image = formData.get("image") as File;
    const selectedCategories = formData.getAll("categories") as string[];
    const selectedTags = formData.getAll("tags") as string[];

    if (!title) return;

    const supabase = await createClient();

    // 1. Insert Project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert([{
        title,
        challenge,
        solution,
        live_demo_url: liveDemoUrl || null,
        repo_url: repoUrl || null
      }])
      .select()
      .single();

    if (projectError || !project) {
      console.error("Error creating project:", projectError);
      throw new Error(projectError?.message || "Gagal menyimpan data proyek ke database.");
    }

    // 2. Upload Image
    let imageUrl = null;
    if (image && image.size > 0) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("portofolio-image")
        .upload(`projects/${fileName}`, image);

      if (uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from("portofolio-image")
          .getPublicUrl(uploadData.path);

        imageUrl = publicUrlData.publicUrl;

        // Insert Project Image
        await supabase.from("project_images").insert([{
          project_id: project.id,
          image_url: imageUrl,
          is_primary: true
        }]);
      } else {
        console.error("Error uploading image:", uploadError);
        throw new Error(uploadError?.message || "Gagal mengunggah gambar ke Storage. Pastikan policy bucket sudah benar.");
      }
    }

    // 2.5 Upload Gallery Images
    const galleryImages = formData.getAll("gallery_images") as File[];
    if (galleryImages && galleryImages.length > 0) {
      for (const galImg of galleryImages) {
        if (galImg.size > 0) {
          const fileExt = galImg.name.split('.').pop();
          const fileName = `gallery-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("portofolio-image")
            .upload(`projects/${fileName}`, galImg);

          if (uploadData) {
            const { data: publicUrlData } = supabase.storage
              .from("portofolio-image")
              .getPublicUrl(uploadData.path);

            await supabase.from("project_images").insert([{
              project_id: project.id,
              image_url: publicUrlData.publicUrl,
              is_primary: false
            }]);
          } else {
            console.error("Error uploading gallery image:", uploadError);
            // We can choose to throw or just skip failed images
          }
        }
      }
    }

    // 3. Insert Relations (Categories & Tags)
    if (selectedCategories.length > 0) {
      const categoryInserts = selectedCategories.map(catId => ({
        project_id: project.id,
        category_id: catId
      }));
      const { error: catError } = await supabase.from("project_categories").insert(categoryInserts);
      if (catError) throw new Error(catError.message);
    }

    if (selectedTags.length > 0) {
      const tagInserts = selectedTags.map(tagId => ({
        project_id: project.id,
        tag_id: tagId
      }));
      const { error: tagError } = await supabase.from("project_tags").insert(tagInserts);
      if (tagError) throw new Error(tagError.message);
    }

    redirect("/dashboard/projects");
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/projects" className="text-gray-500 hover:text-gray-900 dark:hover:text-white mr-4">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tambah Proyek Baru</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        <form action={createProject} className="flex flex-col gap-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Proyek *</label>
              <input type="text" id="title" name="title" required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gambar Utama (Thumbnail)</label>
              <input type="file" id="image" name="image" accept="image/*" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-200" />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="gallery_images" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gambar Gallery Tambahan (Opsional, Bisa pilih banyak)</label>
              <input type="file" id="gallery_images" name="gallery_images" accept="image/*" multiple className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-200" />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="challenge" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tantangan (Challenge)</label>
              <textarea id="challenge" name="challenge" rows={3} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"></textarea>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="solution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Solusi (Solution)</label>
              <textarea id="solution" name="solution" rows={3} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"></textarea>
            </div>

            <div>
              <label htmlFor="live_demo_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Live Demo</label>
              <input type="url" id="live_demo_url" name="live_demo_url" placeholder="https://..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" />
            </div>

            <div>
              <label htmlFor="repo_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Repository (Github)</label>
              <input type="url" id="repo_url" name="repo_url" placeholder="https://github.com/..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pilih Kategori</label>
              <div className="space-y-2 max-h-40 overflow-y-auto p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                {categories?.map(cat => (
                  <div key={cat.id} className="flex items-center">
                    <input type="checkbox" id={`cat-${cat.id}`} name="categories" value={cat.id} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <label htmlFor={`cat-${cat.id}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">{cat.name}</label>
                  </div>
                ))}
                {categories?.length === 0 && <span className="text-sm text-gray-500">Belum ada kategori.</span>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pilih Tags</label>
              <div className="space-y-2 max-h-40 overflow-y-auto p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                {tags?.map(tag => (
                  <div key={tag.id} className="flex items-center">
                    <input type="checkbox" id={`tag-${tag.id}`} name="tags" value={tag.id} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <label htmlFor={`tag-${tag.id}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">{tag.name}</label>
                  </div>
                ))}
                {tags?.length === 0 && <span className="text-sm text-gray-500">Belum ada tag.</span>}
              </div>
            </div>

          </div>

          <div className="mt-8 flex justify-end">
            <SubmitButton 
              defaultText="Simpan Proyek" 
              loadingText="Menyimpan..."
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-lg transition-colors"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
