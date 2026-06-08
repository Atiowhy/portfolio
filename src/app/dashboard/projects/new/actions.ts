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

export async function createProjectAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const challenge = formData.get("challenge") as string;
  const solution = formData.get("solution") as string;
  const liveDemoUrl = formData.get("live_demo_url") as string;
  const repoUrl = formData.get("repo_url") as string;
  const image = formData.get("image") as File | null;
  const selectedCategories = formData.getAll("categories") as string[];
  const selectedTags = formData.getAll("tags") as string[];

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

  // 2. Insert Project
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert([{
      title: validatedFields.data.title,
      challenge: validatedFields.data.challenge || null,
      solution: validatedFields.data.solution || null,
      live_demo_url: validatedFields.data.live_demo_url || null,
      repo_url: validatedFields.data.repo_url || null
    }])
    .select()
    .single();

  if (projectError || !project) {
    console.error("Error creating project:", projectError);
    return { success: false, message: projectError?.message || "Gagal menyimpan data proyek ke database." };
  }

  try {
    // 3. Upload Images (Parallelizing thumbnail and gallery)
    const uploadPromises: Promise<any>[] = [];
    const insertedImages: { project_id: string, image_url: string, is_primary: boolean }[] = [];

    // Thumbnail
    if (image && image.size > 0) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const p = supabase.storage
        .from("portofolio-image")
        .upload(`projects/${fileName}`, image)
        .then(res => {
          if (res.error) throw res.error;
          const { data: publicUrlData } = supabase.storage.from("portofolio-image").getPublicUrl(res.data.path);
          insertedImages.push({ project_id: project.id, image_url: publicUrlData.publicUrl, is_primary: true });
        });
      uploadPromises.push(p);
    }

    // Gallery
    const galleryImages = formData.getAll("gallery_images") as File[];
    for (const galImg of galleryImages) {
      if (galImg.size > 0) {
        const fileExt = galImg.name.split('.').pop();
        const fileName = `gallery-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const p = supabase.storage
          .from("portofolio-image")
          .upload(`projects/${fileName}`, galImg)
          .then(res => {
            if (res.error) throw res.error;
            const { data: publicUrlData } = supabase.storage.from("portofolio-image").getPublicUrl(res.data.path);
            insertedImages.push({ project_id: project.id, image_url: publicUrlData.publicUrl, is_primary: false });
          });
        uploadPromises.push(p);
      }
    }

    await Promise.all(uploadPromises);
    
    // Insert Image relations
    if (insertedImages.length > 0) {
      const { error: imgRelError } = await supabase.from("project_images").insert(insertedImages);
      if (imgRelError) throw imgRelError;
    }

    // 4. Insert Relations (Categories & Tags)
    if (selectedCategories.length > 0) {
      const categoryInserts = selectedCategories.map(catId => ({
        project_id: project.id,
        category_id: catId
      }));
      const { error: catError } = await supabase.from("project_categories").insert(categoryInserts);
      if (catError) throw catError;
    }

    if (selectedTags.length > 0) {
      const tagInserts = selectedTags.map(tagId => ({
        project_id: project.id,
        tag_id: tagId
      }));
      const { error: tagError } = await supabase.from("project_tags").insert(tagInserts);
      if (tagError) throw tagError;
    }

  } catch (err: any) {
    console.error("Error during related inserts:", err);
    // ROLLBACK: Delete the project if relation inserts fail
    await supabase.from("projects").delete().eq("id", project.id);
    return { success: false, message: err.message || "Terjadi kesalahan saat mengunggah gambar atau menyimpan relasi. Data dibatalkan." };
  }

  // Success
  revalidatePath("/dashboard/projects");
  redirect("/dashboard/projects");
}
