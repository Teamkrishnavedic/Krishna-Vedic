import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { slugify } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    sortOrder: 0,
  });

  // Modal for deleting a category that has products
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    category: any | null;
    targetCategoryId: string;
  }>({
    isOpen: false,
    category: null,
    targetCategoryId: '',
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories-full'],
    queryFn: async () => {
      const res = await api.get('/admin/categories');
      return res.data.categories || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEditing) {
        return api.put(`/admin/categories/${isEditing}`, data);
      } else {
        return api.post('/admin/categories', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories-full'] });
      toast({ title: isEditing ? 'Category Updated' : 'Category Created', variant: 'success' });
      resetForm();
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || err.response?.data?.error || 'Could not save category', variant: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, reassignTo }: { id: string; reassignTo?: string }) => {
      const query = reassignTo ? `?reassignTo=${encodeURIComponent(reassignTo)}` : '';
      return api.delete(`/admin/categories/${id}${query}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories-full'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Category Deleted', description: 'Category and product assignments updated', variant: 'success' });
      setDeleteModal({ isOpen: false, category: null, targetCategoryId: '' });
    },
    onError: (err: any) => {
      toast({ title: 'Delete Failed', description: err.message || err.response?.data?.error || 'Cannot delete category', variant: 'error' });
    },
  });

  const handleDeleteClick = (cat: any) => {
    const productCount = cat._count?.products || 0;
    if (productCount === 0) {
      if (window.confirm(`Delete category "${cat.name}"?`)) {
        deleteMutation.mutate({ id: cat.id });
      }
    } else {
      // Find a default target category other than this one
      const otherCats = categories.filter((c: any) => c.id !== cat.id);
      const defaultTarget = otherCats.length > 0 ? otherCats[0].id : '';
      setDeleteModal({
        isOpen: true,
        category: cat,
        targetCategoryId: defaultTarget,
      });
    }
  };

  const handleConfirmReassignDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteModal.category) return;
    if (!deleteModal.targetCategoryId) {
      toast({ title: 'Select Category', description: 'Please select a replacement category for the products', variant: 'error' });
      return;
    }
    deleteMutation.mutate({
      id: deleteModal.category.id,
      reassignTo: deleteModal.targetCategoryId,
    });
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({ name: '', slug: '', description: '', sortOrder: 0 });
  };

  const handleEdit = (cat: any) => {
    setIsEditing(cat.id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      sortOrder: cat.sortOrder || 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return;
    saveMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-outline-variant/30">
        <h1 className="font-headline-lg text-headline-lg font-serif text-primary">Store Categories</h1>
        <p className="text-xs text-on-surface-variant mt-1">Organize store products into logical Vedic collections</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Category List (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-low border border-outline-variant/30 overflow-hidden rounded-3xl shadow-sm">
          <div className="p-5 border-b border-outline-variant/30 font-serif font-bold text-primary text-sm flex items-center justify-between">
            <span>Existing Categories ({categories.length})</span>
            <span className="text-[11px] font-sans font-normal text-on-surface-variant">Live from Aiven Cloud</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-high border-b border-outline-variant/30 text-on-surface uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Products</th>
                  <th className="py-3 px-4 text-center">Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {categories.map((c: any) => (
                  <tr key={c.id} className="hover:bg-surface-container transition-colors">
                    <td className="py-3.5 px-4 font-bold text-on-surface">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-outline">
                      /{c.slug}
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant">
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high font-semibold text-[11px]">
                        {c._count?.products || 0} items
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-on-surface">
                      {c.sortOrder}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(c)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(c)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Form (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-low p-6 border border-outline-variant/30 rounded-3xl shadow-sm">
          <h2 className="font-serif text-base font-bold text-primary mb-4 pb-2 border-b border-outline-variant/30 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">create_new_folder</span>
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Category Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    name: val,
                    slug: isEditing ? formData.slug : slugify(val),
                  });
                }}
                className="input text-xs rounded-xl"
                placeholder="e.g. Cold-Pressed Edible Oils"
              />
            </div>

            <div>
              <label className="label">URL Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="input font-mono text-xs rounded-xl"
                placeholder="cold-pressed-edible-oils"
              />
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input text-xs rounded-xl"
                placeholder="Brief summary for category headers"
              />
            </div>

            <div>
              <label className="label">Sort Order (display priority)</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                className="input text-xs w-28 rounded-xl"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="btn-primary py-2.5 px-6 text-xs uppercase font-label-md tracking-wider font-semibold rounded-full cursor-pointer disabled:opacity-50"
              >
                {saveMutation.isPending ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-ghost py-2.5 px-4 text-xs uppercase font-label-md tracking-wider rounded-full cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Reassignment Modal when deleting category with products */}
      {deleteModal.isOpen && deleteModal.category && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-outline-variant/30 rounded-3xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">move_up</span>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-primary">
                  Reassign Products &amp; Delete
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Category <strong className="text-on-surface">"{deleteModal.category.name}"</strong> has{' '}
                  <strong className="text-primary">{deleteModal.category._count?.products || 0} active products</strong>.
                  Select a replacement category to safely move these products to before deleting.
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmReassignDelete} className="space-y-4 pt-2">
              <div>
                <label className="label">Move products to category *</label>
                <select
                  required
                  value={deleteModal.targetCategoryId}
                  onChange={(e) => setDeleteModal({ ...deleteModal, targetCategoryId: e.target.value })}
                  className="input text-xs rounded-xl"
                >
                  <option value="" disabled>-- Select Replacement Category --</option>
                  {categories
                    .filter((c: any) => c.id !== deleteModal.category?.id)
                    .map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c._count?.products || 0} products currently)
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: false, category: null, targetCategoryId: '' })}
                  className="btn-ghost py-2 px-4 text-xs font-semibold rounded-full cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleteMutation.isPending || !deleteModal.targetCategoryId}
                  className="bg-red-700 hover:bg-red-800 text-white py-2 px-5 text-xs font-semibold rounded-full cursor-pointer disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  {deleteMutation.isPending ? 'Reassigning & Deleting...' : 'Move Products & Delete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
