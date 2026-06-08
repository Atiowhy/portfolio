"use client";

import { useActionState, useEffect, useState, useCallback } from "react";
import { createProjectAction, FormState } from "./actions";
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
    <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-t-lg border-b border-gray-200 dark:border-gray-600">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded text-sm ${editor.isActive('bold') ? 'bg-blue-200 dark:bg-blue-600 dark:text-white' : 'bg-gray-200 dark:bg-gray-600 dark:text-gray-200'}`}>Bold</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded text-sm ${editor.isActive('italic') ? 'bg-blue-200 dark:bg-blue-600 dark:text-white' : 'bg-gray-200 dark:bg-gray-600 dark:text-gray-200'}`}>Italic</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`px-2 py-1 rounded text-sm ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-200 dark:bg-blue-600 dark:text-white' : 'bg-gray-200 dark:bg-gray-600 dark:text-gray-200'}`}>Heading</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-2 py-1 rounded text-sm ${editor.isActive('bulletList') ? 'bg-blue-200 dark:bg-blue-600 dark:text-white' : 'bg-gray-200 dark:bg-gray-600 dark:text-gray-200'}`}>Bullet List</button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`px-2 py-1 rounded text-sm ${editor.isActive('orderedList') ? 'bg-blue-200 dark:bg-blue-600 dark:text-white' : 'bg-gray-200 dark:bg-gray-600 dark:text-gray-200'}`}>Ordered List</button>
    </div>
  );
};

export default function ProjectForm({ categories, tags }: { categories: any[], tags: any[] }) {
  const [state, formAction] = useActionState<FormState, FormData>(createProjectAction, { success: true, message: "" });
  
  // Image states
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<{file: File, url: string}[]>([]);

  // Tiptap Editors
  const challengeEditor = useEditor({
    extensions: [StarterKit, LinkExtension],
    content: "",
    editorProps: { attributes: { className: "prose prose-sm dark:prose-invert max-w-none p-4 min-h-[150px] outline-none" } }
  });

  const solutionEditor = useEditor({
    extensions: [StarterKit, LinkExtension],
    content: "",
    editorProps: { attributes: { className: "prose prose-sm dark:prose-invert max-w-none p-4 min-h-[150px] outline-none" } }
  });

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // We let the native form submit happen by not calling e.preventDefault()
    // BUT we need to inject the tiptap and file data into the FormData.
    // Instead of hijacking submit, we can just use the formAction directly.
  };

  // Wrapper action to intercept submission and inject non-standard inputs
  const actionWithExtraData = (formData: FormData) => {
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
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Proyek *</label>
          <input type="text" id="title" name="title" required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" />
          {state?.errors?.title && <p className="text-red-500 text-sm mt-1">{state.errors.title[0]}</p>}
        </div>

        {/* Thumbnail Image Drag & Drop */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gambar Utama (Thumbnail)</label>
          <div {...getThumbProps()} className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <input {...getThumbInputProps()} />
            {thumbnailUrl ? (
              <div className="relative inline-block">
                <img src={thumbnailUrl} alt="Thumbnail preview" className="max-h-64 object-contain rounded-lg" />
                <button type="button" onClick={clearThumbnail} className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full hover:bg-red-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Tarik dan lepas gambar di sini, atau klik untuk memilih</p>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Images Drag & Drop */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gambar Gallery Tambahan (Opsional)</label>
          <div {...getGalleryProps()} className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mb-4">
            <input {...getGalleryInputProps()} />
            <div className="text-center">
              <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Tarik dan lepas banyak gambar di sini, atau klik untuk memilih</p>
            </div>
          </div>
          {galleryFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {galleryFiles.map((item, idx) => (
                <div key={idx} className="relative group">
                  <img src={item.url} alt={`Gallery ${idx}`} className="h-32 w-full object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                  <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Challenge (Rich Text) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tantangan (Challenge)</label>
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden flex flex-col bg-white dark:bg-gray-700">
            <MenuBar editor={challengeEditor} />
            <div className="flex-1 overflow-y-auto">
              <EditorContent editor={challengeEditor} />
            </div>
          </div>
        </div>

        {/* Solution (Rich Text) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Solusi (Solution)</label>
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden flex flex-col bg-white dark:bg-gray-700">
            <MenuBar editor={solutionEditor} />
            <div className="flex-1 overflow-y-auto">
              <EditorContent editor={solutionEditor} />
            </div>
          </div>
        </div>

        {/* URLs */}
        <div>
          <label htmlFor="live_demo_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Live Demo</label>
          <input type="url" id="live_demo_url" name="live_demo_url" placeholder="https://..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" />
          {state?.errors?.live_demo_url && <p className="text-red-500 text-sm mt-1">{state.errors.live_demo_url[0]}</p>}
        </div>

        <div>
          <label htmlFor="repo_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Repository (Github)</label>
          <input type="url" id="repo_url" name="repo_url" placeholder="https://github.com/..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" />
          {state?.errors?.repo_url && <p className="text-red-500 text-sm mt-1">{state.errors.repo_url[0]}</p>}
        </div>

        {/* Categories */}
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

        {/* Tags */}
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
  );
}
