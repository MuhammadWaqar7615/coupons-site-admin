"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientDeleteButton({ storeId }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this store?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/stores/${storeId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete store.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 cursor-pointer disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
