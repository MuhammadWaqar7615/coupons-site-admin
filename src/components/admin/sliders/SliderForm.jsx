"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const emptySlider = {
  image: "",
  imagePublicId: "",
  imageStoragePath: "",
  mobileImage: "",
  mobileImagePublicId: "",
  mobileImageStoragePath: "",
  status: "enabled",
};

const getAspectRatio = (file) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image.width / image.height);
  image.onerror = () => reject(new Error("Unable to read image dimensions."));
  image.src = URL.createObjectURL(file);
});

async function validateImage(file, expectedRatio, label) {
  if (!file.type.startsWith("image/")) throw new Error(`${label} must be an image file.`);
  const ratio = await getAspectRatio(file);
  if (Math.abs(ratio - expectedRatio) > 0.03) {
    throw new Error(`${label} must use a ${expectedRatio === 16 / 9 ? "16:9" : "9:16"} aspect ratio.`);
  }
}

export default function SliderForm({ slider }) {
  const router = useRouter();
  const isEditing = Boolean(slider?._id);
  const [formData, setFormData] = useState(slider ? { ...emptySlider, ...slider } : emptySlider);
  const [desktopPreview, setDesktopPreview] = useState(slider?.image || "");
  const [mobilePreview, setMobilePreview] = useState(slider?.mobileImage || "");
  const [desktopFile, setDesktopFile] = useState(null);
  const [mobileFile, setMobileFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await validateImage(file, type === "desktop" ? 16 / 9 : 9 / 16, type === "desktop" ? "Desktop image" : "Mobile image");
      const preview = URL.createObjectURL(file);
      if (type === "desktop") {
        setDesktopFile(file);
        setDesktopPreview(preview);
      } else {
        setMobileFile(file);
        setMobilePreview(preview);
      }
      setError("");
    } catch (fileError) {
      event.target.value = "";
      setError(fileError.message);
    }
  };

  const uploadImage = async (file) => {
    const imageFormData = new FormData();
    imageFormData.append("file", file);
    imageFormData.append("bucket", "coupon-banners");
    const response = await fetch("/api/upload", { method: "POST", body: imageFormData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to upload slider image.");
    return data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!desktopFile && !formData.image) throw new Error("Desktop image is required.");
      if (!mobileFile && !formData.mobileImage) throw new Error("Mobile image is required.");
      const finalFormData = { ...formData };
      if (desktopFile || mobileFile) setUploadingImage(true);
      if (desktopFile) {
        const data = await uploadImage(desktopFile);
        finalFormData.image = data.url;
        finalFormData.imagePublicId = data.public_id;
        finalFormData.imageStoragePath = data.storagePath;
      }
      if (mobileFile) {
        const data = await uploadImage(mobileFile);
        finalFormData.mobileImage = data.url;
        finalFormData.mobileImagePublicId = data.public_id;
        finalFormData.mobileImageStoragePath = data.storagePath;
      }

      const response = await fetch(isEditing ? `/api/sliders/${slider._id}` : "/api/sliders", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalFormData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save slider.");
      router.push("/dashboard/sliders");
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
          <h1 className="text-2xl font-bold text-gray-800">{isEditing ? "Edit Slider Images" : "Add Slider Images"}</h1>
          <Link href="/dashboard/sliders" className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</Link>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8 rounded-xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8">
          {error && <div className="border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          <p className="text-sm text-gray-600">Upload one high-quality desktop image in 16:9 and one mobile image in 9:16. Titles, descriptions, logos, and discounts are not used for sliders.</p>
          <section>
            <label htmlFor="desktopImage" className="mb-1 block text-sm font-medium text-gray-700">Desktop image (16:9) *</label>
            <input type="file" id="desktopImage" accept="image/*" onChange={(event) => handleFile(event, "desktop")} className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-accent-hover" />
            {desktopPreview && <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50"><img src={desktopPreview} alt="Desktop slider preview" className="h-full w-full object-contain" /></div>}
          </section>
          <section className="border-t border-gray-100 pt-6">
            <label htmlFor="mobileImage" className="mb-1 block text-sm font-medium text-gray-700">Mobile image (9:16) *</label>
            <input type="file" id="mobileImage" accept="image/*" onChange={(event) => handleFile(event, "mobile")} className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-accent-hover" />
            {mobilePreview && <div className="mt-4 flex h-72 w-40 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50"><img src={mobilePreview} alt="Mobile slider preview" className="h-full w-full object-contain" /></div>}
          </section>
          <div className="border-t border-gray-100 pt-6"><label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">Status</label><select id="status" name="status" value={formData.status} onChange={(event) => setFormData((current) => ({ ...current, status: event.target.value }))} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent"><option value="enabled">Enabled</option><option value="disabled">Disabled</option></select></div>
          <div className="flex justify-end border-t border-gray-100 pt-6"><button type="submit" disabled={loading} className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-accent-hover disabled:opacity-50">{loading ? (uploadingImage ? "Uploading Images..." : "Saving...") : "Save Slider Images"}</button></div>
        </form>
      </div>
    </main>
  );
}
