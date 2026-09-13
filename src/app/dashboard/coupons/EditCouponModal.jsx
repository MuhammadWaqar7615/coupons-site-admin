"use client";

import { startTransition, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditCouponModal({ isOpen, onClose, coupon }) {
  const router = useRouter();

  const [couponType, setCouponType] = useState("code");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountValue: "",
    startsAt: "",
    expiresAt: "",
    code: "",
    couponUrl: "",
    terms: "",
    isActive: true,
    isFeatured: false,
    homepageSection: "featured",
    image: "/images/placeholder.png",
    labelTop: "",
    labelBottom: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (coupon && isOpen) {
      startTransition(() => {
        setCouponType(coupon.type || "code");
        setFormData({
          title: coupon.title || "",
          description: coupon.description || "",
          discountValue: coupon.discount || "",
          startsAt: coupon.startsAt ? coupon.startsAt.split("T")[0] : "",
          expiresAt: coupon.expiresAt ? coupon.expiresAt.split("T")[0] : "",
          code: coupon.code || "",
          couponUrl: coupon.couponUrl || "",
          terms: coupon.terms || "",
          isActive: coupon.isActive ?? true,
          isFeatured: coupon.isFeatured ?? false,
          homepageSection: coupon.homepageSection || "featured",
          image: coupon.image || "/images/placeholder.png",
          labelTop: coupon.labelTop || "",
          labelBottom: coupon.labelBottom || "",
        });
        setImagePreview(coupon.image && coupon.image !== "/images/placeholder.png" ? coupon.image : "");
        setImageFile(null);
        setError("");
      });
    }
  }, [coupon, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.title.trim()) {
      setError("Title is required.");
      setIsLoading(false);
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required.");
      setIsLoading(false);
      return;
    }
    if (!formData.discountValue.trim()) {
      setError("Discount Value is required.");
      setIsLoading(false);
      return;
    }
    if (couponType === "code" && !formData.code.trim()) {
      setError("Coupon Code is required for Code Expose coupons.");
      setIsLoading(false);
      return;
    }
    if (couponType === "link" && !formData.couponUrl.trim()) {
      setError("Deal Link is required for Embedded Link coupons.");
      setIsLoading(false);
      return;
    }

    try {
      let imageUrl = formData.image;
      let imageStoragePath = coupon.imageStoragePath || null;
      let imagePublicId = coupon.imagePublicId || null;
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
        type: couponType,
        title: formData.title,
        description: formData.description,
        discount: formData.discountValue,
        terms: formData.terms,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        homepageSection: formData.homepageSection,
        image: imageUrl,
        imageStoragePath,
        imagePublicId,
        labelTop: formData.labelTop,
        labelBottom: formData.labelBottom,
      };

      if (formData.startsAt) payload.startsAt = formData.startsAt;
      if (formData.expiresAt) payload.expiresAt = formData.expiresAt;

      if (couponType === "code") {
        payload.code = formData.code;
        payload.couponUrl = "";
      } else {
        payload.couponUrl = formData.couponUrl;
        payload.code = "";
      }

      const res = await fetch(`/api/coupons/${coupon._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update coupon");
      }
      
      router.refresh();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setUploadingImage(false);
    }
  };

  if (!isOpen || !coupon) return null;

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full my-6 mx-auto max-w-2xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Edit Coupon
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-50 hover:opacity-100 float-right text-3xl leading-none font-semibold outline-none focus:outline-none transition-opacity"
                onClick={onClose}
                disabled={isLoading}
              >
                <span className="bg-transparent text-gray-700 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            
            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm sticky top-0 z-10 shadow-sm">
                {error}
              </div>
            )}
            
            <div className="relative p-6 pt-4 flex-auto max-h-[65vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store (Uneditable)</label>
                  <input
                    type="text"
                    disabled
                    value={coupon.store ? coupon.store.name : "Unknown Store"}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Type</label>
                  <select
                    name="couponType"
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent text-gray-900 bg-white"
                  >
                    <option value="code">Code Expose</option>
                    <option value="link">Embedded Link</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent text-gray-900"
                    placeholder="e.g. 20% Off All Orders"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    name="description"
                    rows="2"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent text-gray-900"
                    placeholder="Brief description of the deal..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value *</label>
                  <input
                    type="text"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent text-gray-900"
                    placeholder="e.g. 20%, 15€, FREE SHIPPING"
                  />
                </div>

                {couponType === "code" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-accent rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent text-gray-900 bg-pink-50/30"
                      placeholder="e.g. SAVE20"
                    />
                  </div>
                )}

                {couponType === "link" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deal Link / Coupon URL *</label>
                    <input
                      type="url"
                      name="couponUrl"
                      value={formData.couponUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-blue-50/50"
                      placeholder="https://example.com/deal"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
                  <textarea
                    name="terms"
                    rows="2"
                    value={formData.terms}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent text-gray-900"
                    placeholder="Optional conditions..."
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startsAt"
                      value={formData.startsAt}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent text-gray-900"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      name="expiresAt"
                      value={formData.expiresAt}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent text-gray-900"
                    />
                  </div>
                </div>

                <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                    />
                    <span className="text-sm text-gray-700">Is Active</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                    />
                    <span className="text-sm text-gray-700">Featured (Pin to top)</span>
                  </label>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Homepage Section</label>
                  <select name="homepageSection" value={formData.homepageSection} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900">
                    <option value="featured">Featured offers (white cards)</option>
                    <option value="secondary">Secondary offers (image cards)</option>
                    <option value="new">New codes</option>
                    <option value="expiring">Expiring codes</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Choose where this coupon should appear on the homepage.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Image (Optional)</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-accent focus:border-accent file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-hover" />
                  <p className="mt-1 text-xs text-gray-500">Upload an image for this coupon (will be stored in Supabase Storage).</p>
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                      <div className="relative w-32 h-32 border border-gray-200 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain p-2" />
                      </div>
                    </div>
                  )}
                </div>

                {(formData.homepageSection === "new" || formData.homepageSection === "expiring") && (
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">List label</label><input name="labelTop" value={formData.labelTop} onChange={handleInputChange} placeholder="CODICE or SPEDIZIONE" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" /></div>
                )}
              </form>
            </div>
            
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b bg-gray-50">
              <button
                className="text-gray-500 hover:text-gray-800 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 transition-all"
                type="button"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="bg-accent hover:bg-accent-hover text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 transition-all disabled:opacity-50"
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (uploadingImage ? "Uploading Image..." : "Saving...") : "Update Coupon"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-30 fixed inset-0 z-40 bg-black backdrop-blur-sm"></div>
    </>
  );
}
