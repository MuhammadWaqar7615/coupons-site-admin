"use client";

import { useState } from "react";
import Link from "next/link";
import ClientDeleteButton from "./stores/ClientDeleteButton";
import AddCouponModal from "./AddCouponModal";

export default function StoreTable({ stores }) {
  const [selectedStore, setSelectedStore] = useState(null);

  const handleRowClick = (store) => {
    setSelectedStore(store);
  };

  const closeModal = () => {
    setSelectedStore(null);
  };

  return (
    <div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stores.map((store) => (
                <tr 
                  key={store._id} 
                  onClick={() => handleRowClick(store)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-10 w-10 flex items-center justify-center bg-gray-50 rounded p-1">
                      <img src={store.logoPath} alt={store.name} className="max-h-full max-w-full object-contain" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{store.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{store.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${store.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {store.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <Link href={`/dashboard/stores/${store._id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Edit
                    </Link>
                    <ClientDeleteButton storeId={store._id} />
                  </td>
                </tr>
              ))}
              {stores.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No stores found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <AddCouponModal 
        isOpen={!!selectedStore} 
        onClose={closeModal} 
        store={selectedStore} 
      />
    </div>
  );
}
