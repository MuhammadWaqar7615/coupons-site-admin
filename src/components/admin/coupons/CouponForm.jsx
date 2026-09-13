"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const initialForm = {
  storeId: "",
  type: "code",
  title: "",
  description: "",
  discount: "",
  code: "",
  couponUrl: "",
  terms: "",
  startsAt: "",
  expiresAt: "",
  isActive: true,
  isFeatured: false,
  homepageSection: "featured",
  image: "/images/placeholder.png",
  labelTop: "",
  labelBottom: "",
};

export default function CouponForm({ stores }) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      let imageUrl = formData.image;
      let imageStoragePath = formData.imageStoragePath || null;
      let imagePublicId = formData.imagePublicId || null;
      if (imageFile) {
        setUploadingImage(true);
        const imageFormData = new FormData();
        imageFormData.append("file", imageFile);
        imageFormData.append("bucket", "coupon-banners");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(errData.message || "Failed to upload image");
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
        imageStoragePath = uploadData.storagePath;
        imagePublicId = uploadData.public_id;
        setUploadingImage(false);
      }

      const payload = {
        ...formData,
        image: imageUrl,
        imageStoragePath,
        imagePublicId,
      };

      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Unable to create coupon.");
      router.push("/dashboard/coupons");
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
        <div className="mb-6 flex items-center justify-between gap-4"><h1 className="text-2xl font-bold text-gray-800">Add Coupon</h1><Link href="/dashboard/coupons" className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</Link></div>
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8">
          {error && <div className="border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          <div className="grid gap-6 md:grid-cols-2"><div><label htmlFor="storeId" className="mb-1 block text-sm font-medium text-gray-700">Store *</label><select id="storeId" name="storeId" required value={formData.storeId} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900"><option value="">Select store</option>{stores.map((store) => <option key={store._id} value={store._id}>{store.name}</option>)}</select></div><div><label htmlFor="type" className="mb-1 block text-sm font-medium text-gray-700">Coupon Type *</label><select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900"><option value="code">Code expose</option><option value="link">Embedded link</option></select></div></div>
          <div className="grid gap-6 md:grid-cols-2"><div><label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">Title *</label><input id="title" name="title" required value={formData.title} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900" /></div><div><label htmlFor="discount" className="mb-1 block text-sm font-medium text-gray-700">Discount *</label><input id="discount" name="discount" required value={formData.discount} onChange={handleChange} placeholder="20% or 15€" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900" /></div></div>
          <div><label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">Description *</label><textarea id="description" name="description" required rows="4" value={formData.description} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900" /></div>
          {formData.type === "code" ? <div><label htmlFor="code" className="mb-1 block text-sm font-medium text-gray-700">Coupon Code *</label><input id="code" name="code" required value={formData.code} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900" /></div> : <div><label htmlFor="couponUrl" className="mb-1 block text-sm font-medium text-gray-700">Coupon URL *</label><input id="couponUrl" name="couponUrl" type="url" required value={formData.couponUrl} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900" /></div>}
          <div className="border-t border-gray-100 pt-6"><label htmlFor="homepageSection" className="mb-1 block text-sm font-medium text-gray-700">Homepage Section</label><select id="homepageSection" name="homepageSection" value={formData.homepageSection} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900"><option value="featured">Featured offers (white cards)</option><option value="secondary">Secondary offers (image cards)</option><option value="new">New codes</option><option value="expiring">Expiring codes</option></select><p className="mt-1 text-xs text-gray-500">Choose where this coupon appears on the homepage.</p></div>
          <div>
            <label htmlFor="imageFile" className="mb-1 block text-sm font-medium text-gray-700">Coupon Image (Optional)</label>
            <input type="file" id="imageFile" name="imageFile" accept="image/*" onChange={handleFileChange} className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-hover" />
            <p className="mt-1 text-xs text-gray-500">Upload an image for this coupon (will be stored in Supabase Storage).</p>
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                <div className="relative w-32 h-32 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain p-2" />
                </div>
              </div>
            )}
          </div>
          {(formData.homepageSection === "new" || formData.homepageSection === "expiring") && <div className="grid gap-6 md:grid-cols-2"><div><label htmlFor="labelTop" className="mb-1 block text-sm font-medium text-gray-700">List label</label><input id="labelTop" name="labelTop" value={formData.labelTop} onChange={handleChange} placeholder="CODICE or SPEDIZIONE" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900" /></div><div><label htmlFor="labelBottom" className="mb-1 block text-sm font-medium text-gray-700">Secondary label</label><input id="labelBottom" name="labelBottom" value={formData.labelBottom} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900" /></div></div>}
          <div className="grid gap-6 md:grid-cols-2"><div><label htmlFor="startsAt" className="mb-1 block text-sm font-medium text-gray-700">Start Date</label><input id="startsAt" name="startsAt" type="date" value={formData.startsAt} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900" /></div><div><label htmlFor="expiresAt" className="mb-1 block text-sm font-medium text-gray-700">Expiry Date</label><input id="expiresAt" name="expiresAt" type="date" value={formData.expiresAt} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900" /></div></div>
          <div className="flex gap-6"><label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 accent-accent" />Active</label><label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="h-4 w-4 accent-accent" />Featured</label></div>
          <div className="flex justify-end border-t border-gray-100 pt-6"><button type="submit" disabled={loading || stores.length === 0} className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50">{loading ? (uploadingImage ? "Uploading Image..." : "Saving...") : "Create Coupon"}</button></div>
        </form>
      </div>
    </main>
  );
}
