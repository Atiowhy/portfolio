"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1, "Judul proyek wajib diisi"),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  live_demo_url: z.union([z.string().url("URL Live Demo tidak valid").or(z.literal("")), z.undefined()]).optional(),
  repo_url: z.union([z.string().url("URL Repository tidak valid").or(z.literal("")), z.undefined()]).optional(),
});

export type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function updateProjectAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();

  const projectId = formData.get("project_id") as string;
  const title = formData.get("title") as string;
  const challenge = formData.get("challenge") as string;
  const solution = formData.get("solution") as string;
  const liveDemoUrl = formData.get("live_demo_url") as string;
  const repoUrl = formData.get("repo_url") as string;
  const image = formData.get("image") as File | null;
  const selectedCategories = formData.getAll("categories") as string[];
  const selectedTags = formData.getAll("tags") as string[];

  if (!projectId) {
    return { success: false, message: "ID Proyek tidak ditemukan." };
  }

  // 1. Validation with Zod
  const validatedFields = projectSchema.safeParse({
    title,
    challenge,
    solution,
    live_demo_url: liveDemoUrl,
    repo_url: repoUrl,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Terdapat kesalahan pada isian form. Periksa kembali data Anda.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Update Project Text Fields
  const { error: updateError } = await supabase
    .from("projects")
    .update({
      title: validatedFields.data.title,
      challenge: validatedFields.data.challenge || null,
      solution: validatedFields.data.solution || null,
      live_demo_url: validatedFields.data.live_demo_url || null,
      repo_url: validatedFields.data.repo_url || null
    })
    .eq("id", projectId);

  if (updateError) {
    console.error("Error updating project:", updateError);
    return { success: false, message: updateError.message || "Gagal memperbarui data proyek." };
  }

  try {
    const uploadPromises: Promise<any>[] = [];
    
    // 3. Upload New Primary Image (if provided)
    if (image && image.size > 0) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const p = supabase.storage
        .from("portofolio-image")
        .upload(`projects/${fileName}`, image)
        .then(async (res) => {
          if (res.error) throw res.error;
          const { data: publicUrlData } = supabase.storage.from("portofolio-image").getPublicUrl(res.data.path);
          
          // Delete old primary image
          await supabase.from("project_images").delete().eq("project_id", projectId).eq("is_primary", true);
          
          // Insert new primary
          await supabase.from("project_images").insert([{
            project_id: projectId,
            image_url: publicUrlData.publicUrl,
            is_primary: true
          }]);
        });
      uploadPromises.push(p);
    }

    // 4. Upload New Gallery Images (if provided) -> Appends to existing gallery
    const galleryImages = formData.getAll("gallery_images") as File[];
    for (const galImg of galleryImages) {
      if (galImg.size > 0) {
        const fileExt = galImg.name.split('.').pop();
        const fileName = `gallery-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const p = supabase.storage
          .from("portofolio-image")
          .upload(`projects/${fileName}`, galImg)
          .then(async (res) => {
            if (res.error) throw res.error;
            const { data: publicUrlData } = supabase.storage.from("portofolio-image").getPublicUrl(res.data.path);
            
            await supabase.from("project_images").insert([{
              project_id: projectId,
              image_url: publicUrlData.publicUrl,
              is_primary: false
            }]);
          });
        uploadPromises.push(p);
      }
    }

    await Promise.all(uploadPromises);

    // 5. Update Relations (Categories & Tags)
    await supabase.from("project_categories").delete().eq("project_id", projectId);
    await supabase.from("project_tags").delete().eq("project_id", projectId);

    if (selectedCategories.length > 0) {
      const categoryInserts = selectedCategories.map(catId => ({
        project_id: projectId,
        category_id: catId
      }));
      await supabase.from("project_categories").insert(categoryInserts);
    }

    if (selectedTags.length > 0) {
      const tagInserts = selectedTags.map(tagId => ({
        project_id: projectId,
        tag_id: tagId
      }));
      await supabase.from("project_tags").insert(tagInserts);
    }

  } catch (err: any) {
    console.error("Error during project update assets:", err);
    return { success: false, message: err.message || "Terjadi kesalahan saat mengunggah gambar atau menyimpan relasi." };
  }

  revalidatePath("/dashboard/projects");
  redirect("/dashboard/projects");
}
