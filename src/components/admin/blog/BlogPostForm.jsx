"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const emptyPost = { title: "", description: "", seoTitle: "", seoDescription: "", image: "", imagePublicId: "", status: "enabled" };

export default function BlogPostForm({ post }) {
  const router = useRouter();
  const isEditing = Boolean(post?._id);
  const [formData, setFormData] = useState(post ? { ...emptyPost, ...post } : emptyPost);
  const [preview, setPreview] = useState(post?.image || "/images/placeholder.png");
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      let finalFormData = { ...formData };

      // Upload image first if a new file is selected
      if (imageFile) {
        setUploadingImage(true);
        const imageFormData = new FormData();
        imageFormData.append("file", imageFile);
        imageFormData.append("bucket", "store-images");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(errData.message || "Failed to upload image");
        }

        const uploadData = await uploadRes.json();
        setUploadingImage(false);

        finalFormData.image = uploadData.url;
        finalFormData.imagePublicId = uploadData.public_id;
        finalFormData.imageStoragePath = uploadData.storagePath;
      }

      const response = await fetch(isEditing ? `/api/blog/${post._id}` : "/api/blog", { method: isEditing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(finalFormData) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save blog post.");
      router.push("/dashboard/blog");
      router.refresh();
    } catch (submitError) {
      setError(submitError.message);
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">{isEditing ? "Edit Blog Post" : "Add Blog Post"}</h1>
          <Link href="/dashboard/blog" className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</Link>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8 rounded-xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8">
          {error && <div className="border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">Title *</label>
            <input id="title" name="title" required value={formData.title} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent" />
          </div>
          
          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">Description *</label>
            <textarea id="description" name="description" required rows="6" value={formData.description} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent" />
          </div>

          <section className="grid gap-6 border-t border-gray-100 pt-6 md:grid-cols-2">
            <div>
              <label htmlFor="seoTitle" className="mb-1 block text-sm font-medium text-gray-700">SEO title</label>
              <input id="seoTitle" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent"><option value="enabled">Enabled</option><option value="disabled">Disabled</option></select>
            </div>
          </section>

          <div>
            <label htmlFor="seoDescription" className="mb-1 block text-sm font-medium text-gray-700">SEO description</label>
            <textarea id="seoDescription" name="seoDescription" rows="3" value={formData.seoDescription} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent" />
          </div>
          
          <section className="border-t border-gray-100 pt-6">
            <label htmlFor="imageFile" className="mb-1 block text-sm font-medium text-gray-700">Blog Image *</label>
            <input type="file" id="imageFile" accept="image/*" onChange={handleFile} className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-hover" />
            <p className="mt-2 text-xs text-gray-500">Choose an image to preview. Recommend standard banner dimensions.</p>
            {preview && (
              <div className="mt-4 flex h-48 w-full max-w-md items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-2">
                <img src={preview} alt="Blog post preview" className="max-h-full max-w-full object-contain" />
              </div>
            )}
          </section>
          
          <div className="flex justify-end border-t border-gray-100 pt-6">
            <button type="submit" disabled={loading} className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-accent-hover disabled:opacity-50">
              {loading ? (uploadingImage ? "Uploading Image..." : "Saving...") : "Save Blog Post"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
