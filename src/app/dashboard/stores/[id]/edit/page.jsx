"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import Image from "next/image";

export default function EditStorePage({ params }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logoPath: "",
    logoPublicId: "",
    description: "",
    seoTitle: "",
    seoDescription: "",
    websiteUrl: "",
    categories: [],
    subcategories: [],
    isActive: true,
  });

  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await fetch(`/api/stores/${unwrappedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.store.name || "",
            slug: data.store.slug || "",
            logoPath: data.store.logoPath || "",
            logoPublicId: data.store.logoPublicId || "",
            description: data.store.description || "",
            seoTitle: data.store.seoTitle || "",
            seoDescription: data.store.seoDescription || "",
            websiteUrl: data.store.websiteUrl || "",
            categories: data.store.categories || [],
            subcategories: data.store.subcategories || [],
            isActive: data.store.isActive,
          });

          Promise.all([
            fetch("/api/categories").then(res => res.json()),
            fetch("/api/subcategories").then(res => res.json())
          ]).then(([catData, subData]) => {
            setAvailableCategories(catData.categories || []);
            setAvailableSubcategories(subData.subcategories || []);
          }).catch(err => console.error("Failed to load categories", err));
          if (data.store.logoPath) {
            setLogoPreview(data.store.logoPath);
          }
        } else {
          setError("Failed to load store data.");
        }
      } catch (err) {
        console.error(err);
        setError("Error loading store.");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchStore();
  }, [unwrappedParams.id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "select-multiple") {
      const options = Array.from(e.target.options);
      const selectedValues = options.filter(o => o.selected).map(o => o.value);
      setFormData((prev) => ({ ...prev, [name]: selectedValues }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let storeData = { ...formData };

      // 1. Upload new image if selected
      if (logoFile) {
        setUploadingImage(true);
        const imageFormData = new FormData();
        imageFormData.append("file", logoFile);
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

        storeData.logoPath = uploadData.url;
        storeData.logoPublicId = uploadData.public_id;
        storeData.logoStoragePath = uploadData.storagePath;
      }

      // 2. Submit store data
      const res = await fetch(`/api/stores/${unwrappedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeData),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to update store.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  if (initialLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center items-center">
        <p className="text-gray-500">Loading store data...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Store</h1>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            Cancel
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    required
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">Unique identifier (e.g. nike, booking-com)</p>
                </div>
              </div>

              {/* Logo File Upload */}
              <div>
                <label htmlFor="logoFile" className="block text-sm font-medium text-gray-700 mb-1">
                  Store Logo
                </label>
                <input
                  type="file"
                  id="logoFile"
                  name="logoFile"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-hover"
                />
                <p className="text-xs text-gray-500 mt-1">Select an image file (JPG, PNG, WEBP) to replace the current logo.</p>
                
                {logoPreview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Current/Preview Logo:</p>
                    <div className="relative w-32 h-32 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="max-h-full max-w-full object-contain p-2"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    id="seoTitle"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Description
                  </label>
                  <textarea
                    id="seoDescription"
                    name="seoDescription"
                    rows={3}
                    value={formData.seoDescription}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-y"
                  ></textarea>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-y"
                ></textarea>
              </div>

              {/* Website URL */}
              <div>
                <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-1">
                    Categories (Hold Ctrl/Cmd to select multiple)
                  </label>
                  <select
                    multiple
                    id="categories"
                    name="categories"
                    value={formData.categories}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"
                    size="5"
                  >
                    {availableCategories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="subcategories" className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategories
                  </label>
                  <select
                    multiple
                    id="subcategories"
                    name="subcategories"
                    value={formData.subcategories}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"
                    size="5"
                  >
                    {availableSubcategories
                      .filter(sub => formData.categories.includes(sub.parentCategory?._id || sub.parentCategory))
                      .map(sub => (
                      <option key={sub._id} value={sub._id}>{sub.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Is Active */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active (visible on /negozi)
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? (uploadingImage ? "Uploading Image..." : "Saving...") : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
