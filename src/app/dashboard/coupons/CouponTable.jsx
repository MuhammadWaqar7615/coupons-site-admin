"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EditCouponModal from "./EditCouponModal";

export default function CouponTable({ coupons }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(null);
  
  // Edit modal state
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete");
      }
      router.refresh();
    } catch (err) {
      alert("Error deleting coupon: " + err.message);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      const res = await fetch(`/api/coupons/${coupon._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update");
      }
      router.refresh();
    } catch (err) {
      alert("Error updating coupon: " + err.message);
    }
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingCoupon(null);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Homepage Section</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {coupon.store ? coupon.store.name : <span className="text-red-500">Deleted Store</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-1">{coupon.title}</div>
                    {coupon.isFeatured && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.type === 'code' ? 'bg-accent-light text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {coupon.type === 'code' ? 'Code' : 'Link'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ featured: "Featured offers", secondary: "Secondary offers", new: "New codes", expiring: "Expiring codes" }[coupon.homepageSection || "featured"]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{coupon.discount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleToggleActive(coupon)}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => openEditModal(coupon)}
                      className="text-accent hover:text-accent-hover transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(coupon._id)}
                      disabled={isDeleting === coupon._id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 ml-4 transition-colors"
                    >
                      {isDeleting === coupon._id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No coupons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditCouponModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        coupon={editingCoupon}
      />
    </>
  );
}
