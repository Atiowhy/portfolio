import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SubmitButton } from "@/components/SubmitButton";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  // Fetch the existing project
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select(`
      *,
      project_images(image_url, is_primary),
      project_categories(category_id),
      project_tags(tag_id)
    `)
    .eq("id", projectId)
    .single();

  if (projectError || !project) {
    notFound();
  }

  // Extract selected IDs
  const existingCategoryIds = project.project_categories?.map((pc: any) => pc.category_id) || [];
  const existingTagIds = project.project_tags?.map((pt: any) => pt.tag_id) || [];

  // Fetch all categories and tags for the form
  const { data: categories } = await supabase.from("categories").select("*").order("name");
  const { data: tags } = await supabase.from("tags").select("*").order("name");

  async function updateProject(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const challenge = formData.get("challenge") as string;
    const solution = formData.get("solution") as string;
    const liveDemoUrl = formData.get("live_demo_url") as string;
    const repoUrl = formData.get("repo_url") as string;
    const image = formData.get("image") as File;
    const galleryImages = formData.getAll("gallery_images") as File[];
    const selectedCategories = formData.getAll("categories") as string[];
    const selectedTags = formData.getAll("tags") as string[];

    if (!title) return;

    const supabase = await createClient();

    // 1. Update Project Text Fields
    const { error: updateError } = await supabase
      .from("projects")
      .update({
        title,
        challenge,
        solution,
        live_demo_url: liveDemoUrl || null,
        repo_url: repoUrl || null
      })
      .eq("id", projectId);

    if (updateError) {
      console.error("Error updating project:", updateError);
      throw new Error("Gagal memperbarui data proyek ke database.");
    }

    // 2. Upload New Primary Image (if provided)
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

        // Delete old primary image record from project_images
        await supabase.from("project_images").delete().eq("project_id", projectId).eq("is_primary", true);

        // Insert new primary image
        await supabase.from("project_images").insert([{
          project_id: projectId,
          image_url: publicUrlData.publicUrl,
          is_primary: true
        }]);
      } else {
        console.error("Error uploading image:", uploadError);
      }
    }

    // 3. Upload New Gallery Images (if provided) -> Appends to existing gallery
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
              project_id: projectId,
              image_url: publicUrlData.publicUrl,
              is_primary: false
            }]);
          } else {
            console.error("Error uploading gallery image:", uploadError);
          }
        }
      }
    }

    // 4. Update Relations (Categories & Tags)
    // First, delete existing relations
    await supabase.from("project_categories").delete().eq("project_id", projectId);
    await supabase.from("project_tags").delete().eq("project_id", projectId);

    // Insert new selected categories
    if (selectedCategories.length > 0) {
      const categoryInserts = selectedCategories.map(catId => ({
        project_id: projectId,
        category_id: catId
      }));
      await supabase.from("project_categories").insert(categoryInserts);
    }

    // Insert new selected tags
    if (selectedTags.length > 0) {
      const tagInserts = selectedTags.map(tagId => ({
        project_id: projectId,
        tag_id: tagId
      }));
      await supabase.from("project_tags").insert(tagInserts);
    }

    redirect("/dashboard/projects");
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/projects" className="text-gray-500 hover:text-gray-900 dark:hover:text-white mr-4">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Proyek</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        <form action={updateProject} className="flex flex-col gap-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Proyek *</label>
              <input type="text" id="title" name="title" defaultValue={project.title} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gambar Utama Baru (Biarkan kosong jika tidak ingin mengubah)</label>
              <input type="file" id="image" name="image" accept="image/*" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-200" />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="gallery_images" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tambah Gambar Gallery (Akan ditambahkan ke gallery yang sudah ada)</label>
              <input type="file" id="gallery_images" name="gallery_images" accept="image/*" multiple className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-200" />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="challenge" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tantangan (Challenge)</label>
              <textarea id="challenge" name="challenge" defaultValue={project.challenge || ""} rows={3} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"></textarea>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="solution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Solusi (Solution)</label>
              <textarea id="solution" name="solution" defaultValue={project.solution || ""} rows={3} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"></textarea>
            </div>

            <div>
              <label htmlFor="live_demo_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Live Demo</label>
              <input type="url" id="live_demo_url" name="live_demo_url" defaultValue={project.live_demo_url || ""} placeholder="https://..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" />
            </div>

            <div>
              <label htmlFor="repo_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Repository (Github)</label>
              <input type="url" id="repo_url" name="repo_url" defaultValue={project.repo_url || ""} placeholder="https://github.com/..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pilih Kategori</label>
              <div className="space-y-2 max-h-40 overflow-y-auto p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                {categories?.map(cat => (
                  <div key={cat.id} className="flex items-center">
                    <input type="checkbox" id={`cat-${cat.id}`} name="categories" value={cat.id} defaultChecked={existingCategoryIds.includes(cat.id)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
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
                    <input type="checkbox" id={`tag-${tag.id}`} name="tags" value={tag.id} defaultChecked={existingTagIds.includes(tag.id)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <label htmlFor={`tag-${tag.id}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">{tag.name}</label>
                  </div>
                ))}
                {tags?.length === 0 && <span className="text-sm text-gray-500">Belum ada tag.</span>}
              </div>
            </div>

          </div>

          <div className="mt-8 flex justify-end">
            <SubmitButton 
              defaultText="Perbarui Proyek" 
              loadingText="Memperbarui..."
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-lg transition-colors"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
