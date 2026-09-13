"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCouponModal({ isOpen, onClose, store }) {
  const router = useRouter();
  const [couponType, setCouponType] = useState("code"); // "code" or "link"
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountValue: "",
    startsAt: "",
    expiresAt: "",
    code: "",
    couponUrl: "", // changed from link to match model
    terms: "",
    isActive: true,
    isFeatured: false,
    homepageSection: "featured",
    image: "/images/placeholder.png",
    labelTop: "",
    labelBottom: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !store) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Manual validation to avoid silent HTML5 validation failures on scrolled fields
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
      const payload = {
        storeId: store._id,
        type: couponType,
        title: formData.title,
        description: formData.description,
        discount: formData.discountValue,
        terms: formData.terms,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        homepageSection: formData.homepageSection,
        image: formData.image,
        labelTop: formData.labelTop,
        labelBottom: formData.labelBottom,
      };

      if (formData.startsAt) payload.startsAt = formData.startsAt;
      if (formData.expiresAt) payload.expiresAt = formData.expiresAt;

      if (couponType === "code") {
        payload.code = formData.code;
      } else {
        payload.couponUrl = formData.couponUrl;
      }

      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create coupon");
      }

      // Reset and close
      setCouponType("code");
      setFormData({
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
      
      router.refresh(); // Refresh the current page to reflect new data
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black/30 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
            <h3 className="text-xl font-semibold text-gray-800">
              Add Coupon for {store.name}
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
          
          {/* Body */}
          <div className="relative p-6 pt-4 flex-auto max-h-[65vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  placeholder="Optional terms..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startsAt"
                    value={formData.startsAt}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent text-gray-900"
                  />
                </div>
                <div>
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
                    className="w-4 h-4 text-accent focus:ring-accent border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-accent focus:ring-accent border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Homepage Section</label>
                <select
                  name="homepageSection"
                  value={formData.homepageSection}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent text-gray-900 bg-white"
                >
                  <option value="featured">Featured offers (white cards)</option>
                  <option value="secondary">Secondary offers (image cards)</option>
                  <option value="new">New codes</option>
                  <option value="expiring">Expiring codes</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">Choose where this coupon should appear on the homepage.</p>
              </div>

              {formData.homepageSection === "secondary" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card image path</label>
                  <input name="image" value={formData.image} onChange={handleInputChange} placeholder="/images/placeholder.png" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                </div>
              )}

              {(formData.homepageSection === "new" || formData.homepageSection === "expiring") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">List label</label>
                  <input name="labelTop" value={formData.labelTop} onChange={handleInputChange} placeholder="CODICE or SPEDIZIONE" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" />
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-end pt-4 mt-2 border-t border-solid rounded-b border-blueGray-200 gap-2">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-accent border border-transparent rounded-md shadow-sm hover:bg-accent-hover focus:outline-none transition-colors disabled:opacity-50 flex items-center gap-2"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
