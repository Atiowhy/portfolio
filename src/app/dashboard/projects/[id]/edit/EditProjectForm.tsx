"use client";

import { useActionState, useEffect, useState, useCallback } from "react";
import { updateProjectAction, FormState } from "./actions";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { X, Image as ImageIcon } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import { SubmitButton } from "@/components/SubmitButton";

// Tiptap toolbar component
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-black/20 rounded-t-xl border-b border-white/10">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-3 py-1.5 rounded-lg text-sm transition-all ${editor.isActive('bold') ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'}`}>Bold</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-3 py-1.5 rounded-lg text-sm transition-all ${editor.isActive('italic') ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'}`}>Italic</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`px-3 py-1.5 rounded-lg text-sm transition-all ${editor.isActive('heading', { level: 3 }) ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'}`}>Heading</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-3 py-1.5 rounded-lg text-sm transition-all ${editor.isActive('bulletList') ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'}`}>Bullet List</button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`px-3 py-1.5 rounded-lg text-sm transition-all ${editor.isActive('orderedList') ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'}`}>Ordered List</button>
    </div>
  );
};

export default function EditProjectForm({ project, categories, tags }: { project: any, categories: any[], tags: any[] }) {
  const [state, formAction] = useActionState<FormState, FormData>(updateProjectAction, { success: true, message: "" });
  
  // Image states
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<{file: File, url: string}[]>([]);

  // Find existing primary image
  const existingPrimaryImage = project.project_images?.find((img: any) => img.is_primary)?.image_url;

  // Tiptap Editors
  const challengeEditor = useEditor({
    extensions: [StarterKit, LinkExtension],
    content: project.challenge || "",
    editorProps: { attributes: { className: "prose prose-sm dark:prose-invert max-w-none p-4 min-h-[150px] outline-none" } }
  });

  const solutionEditor = useEditor({
    extensions: [StarterKit, LinkExtension],
    content: project.solution || "",
    editorProps: { attributes: { className: "prose prose-sm dark:prose-invert max-w-none p-4 min-h-[150px] outline-none" } }
  });

  // Extract selected IDs
  const existingCategoryIds = project.project_categories?.map((pc: any) => pc.category_id) || [];
  const existingTagIds = project.project_tags?.map((pt: any) => pt.tag_id) || [];

  // Handle Toasts for form errors
  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  // Dropzone for Thumbnail
  const onDropThumbnail = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setThumbnailFile(acceptedFiles[0]);
      setThumbnailUrl(URL.createObjectURL(acceptedFiles[0]));
    }
  }, []);
  const { getRootProps: getThumbProps, getInputProps: getThumbInputProps } = useDropzone({ onDrop: onDropThumbnail, accept: {'image/*': []}, maxFiles: 1 });

  // Dropzone for Gallery
  const onDropGallery = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setGalleryFiles(prev => [...prev, ...newFiles]);
  }, []);
  const { getRootProps: getGalleryProps, getInputProps: getGalleryInputProps } = useDropzone({ onDrop: onDropGallery, accept: {'image/*': []} });

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearThumbnail = (e: React.MouseEvent) => {
    e.stopPropagation();
    setThumbnailFile(null);
    setThumbnailUrl(null);
  };

  // Wrapper action to intercept submission and inject non-standard inputs
  const actionWithExtraData = (formData: FormData) => {
    formData.set("project_id", project.id);
    formData.set("challenge", challengeEditor?.getHTML() || "");
    formData.set("solution", solutionEditor?.getHTML() || "");
    
    if (thumbnailFile) {
      formData.set("image", thumbnailFile);
    }
    
    // Clear out any empty file inputs that might have been automatically included
    formData.delete("gallery_images");
    galleryFiles.forEach((item) => {
      formData.append("gallery_images", item.file);
    });

    formAction(formData);
  };

  return (
    <form action={actionWithExtraData} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Title */}
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Judul Proyek *</label>
          <input type="text" id="title" name="title" defaultValue={project.title} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 outline-none text-white transition-all backdrop-blur-sm" />
          {state?.errors?.title && <p className="text-red-400 text-sm mt-1">{state.errors.title[0]}</p>}
        </div>

        {/* Thumbnail Image Drag & Drop */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Gambar Utama (Thumbnail Baru)</label>
          <div {...getThumbProps()} className="border-2 border-dashed border-white/20 bg-white/5 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 hover:border-cyan-400/50 transition-all backdrop-blur-sm group">
            <input {...getThumbInputProps()} />
            {thumbnailUrl ? (
              <div className="relative inline-block">
                <img src={thumbnailUrl} alt="Thumbnail preview" className="max-h-64 object-contain rounded-lg shadow-lg" />
                <button type="button" onClick={clearThumbnail} className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : existingPrimaryImage ? (
              <div className="text-center">
                 <img src={existingPrimaryImage} alt="Existing thumbnail" className="max-h-48 object-contain rounded-lg shadow-lg mx-auto mb-4 opacity-50" />
                 <p className="mt-4 text-sm text-gray-400">Gambar saat ini. Tarik dan lepas gambar di sini untuk mengubahnya.</p>
              </div>
            ) : (
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                <p className="mt-4 text-sm text-gray-400">Tarik dan lepas gambar di sini, atau klik untuk memilih</p>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Images Drag & Drop */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Tambah Gambar Gallery (Akan ditambahkan ke gallery yang sudah ada)</label>
          <div {...getGalleryProps()} className="border-2 border-dashed border-white/20 bg-white/5 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 hover:border-purple-400/50 transition-all backdrop-blur-sm group mb-4">
            <input {...getGalleryInputProps()} />
            <div className="text-center">
              <ImageIcon className="mx-auto h-8 w-8 text-gray-500 group-hover:text-purple-400 transition-colors" />
              <p className="mt-4 text-sm text-gray-400">Tarik dan lepas banyak gambar di sini, atau klik untuk menambahkan</p>
            </div>
          </div>
          {galleryFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {galleryFiles.map((item, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden shadow-lg">
                  <img src={item.url} alt={`Gallery ${idx}`} className="h-32 w-full object-cover border border-white/10" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Challenge (Rich Text) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Tantangan (Challenge)</label>
          <div className="border border-white/10 rounded-xl overflow-hidden flex flex-col bg-white/5 backdrop-blur-sm focus-within:border-cyan-400/50 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all">
            <MenuBar editor={challengeEditor} />
            <div className="flex-1 overflow-y-auto min-h-[200px]">
              <EditorContent editor={challengeEditor} />
            </div>
          </div>
        </div>

        {/* Solution (Rich Text) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Solusi (Solution)</label>
          <div className="border border-white/10 rounded-xl overflow-hidden flex flex-col bg-white/5 backdrop-blur-sm focus-within:border-purple-400/50 focus-within:ring-1 focus-within:ring-purple-500/30 transition-all">
            <MenuBar editor={solutionEditor} />
            <div className="flex-1 overflow-y-auto min-h-[200px]">
              <EditorContent editor={solutionEditor} />
            </div>
          </div>
        </div>

        {/* URLs */}
        <div>
          <label htmlFor="live_demo_url" className="block text-sm font-medium text-gray-300 mb-2">URL Live Demo</label>
          <input type="url" id="live_demo_url" name="live_demo_url" defaultValue={project.live_demo_url || ""} placeholder="https://..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 outline-none text-white transition-all backdrop-blur-sm placeholder:text-gray-600" />
          {state?.errors?.live_demo_url && <p className="text-red-400 text-sm mt-1">{state.errors.live_demo_url[0]}</p>}
        </div>

        <div>
          <label htmlFor="repo_url" className="block text-sm font-medium text-gray-300 mb-2">URL Repository (Github)</label>
          <input type="url" id="repo_url" name="repo_url" defaultValue={project.repo_url || ""} placeholder="https://github.com/..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 outline-none text-white transition-all backdrop-blur-sm placeholder:text-gray-600" />
          {state?.errors?.repo_url && <p className="text-red-400 text-sm mt-1">{state.errors.repo_url[0]}</p>}
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Pilih Kategori</label>
          <div className="space-y-2 max-h-48 overflow-y-auto p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm custom-scrollbar">
            {categories?.map(cat => (
              <div key={cat.id} className="flex items-center group cursor-pointer">
                <input type="checkbox" id={`cat-${cat.id}`} name="categories" value={cat.id} defaultChecked={existingCategoryIds.includes(cat.id)} className="h-4 w-4 bg-black/40 border-white/20 rounded text-cyan-500 focus:ring-cyan-500/50 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer" />
                <label htmlFor={`cat-${cat.id}`} className="ml-3 block text-sm text-gray-400 group-hover:text-cyan-300 transition-colors cursor-pointer">{cat.name}</label>
              </div>
            ))}
            {categories?.length === 0 && <span className="text-sm text-gray-500">Belum ada kategori.</span>}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Pilih Tags</label>
          <div className="space-y-2 max-h-48 overflow-y-auto p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm custom-scrollbar">
            {tags?.map(tag => (
              <div key={tag.id} className="flex items-center group cursor-pointer">
                <input type="checkbox" id={`tag-${tag.id}`} name="tags" value={tag.id} defaultChecked={existingTagIds.includes(tag.id)} className="h-4 w-4 bg-black/40 border-white/20 rounded text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer" />
                <label htmlFor={`tag-${tag.id}`} className="ml-3 block text-sm text-gray-400 group-hover:text-purple-300 transition-colors cursor-pointer">{tag.name}</label>
              </div>
            ))}
            {tags?.length === 0 && <span className="text-sm text-gray-500">Belum ada tag.</span>}
          </div>
        </div>

      </div>

      <div className="mt-8 flex justify-end">
        <SubmitButton 
          defaultText="Inisiasi Pembaruan Data" 
          loadingText="Menyinkronkan..."
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:scale-105 text-white font-bold py-3 px-8 rounded-full border border-purple-500/30 transition-all duration-300"
        />
      </div>
    </form>
  );
}
