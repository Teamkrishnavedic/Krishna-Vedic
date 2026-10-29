import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatPrice, slugify } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

interface ProductImageItem {
  id?: string;
  url: string;
  altText?: string;
  sortOrder?: number;
}

const IMAGE_PRESETS = [
  { label: 'Kachi Ghani Mustard Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Yellow Mustard (Peeli Sarson)', url: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Virgin Sesame / Gingelly Oil', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Wood-Pressed Groundnut Oil', url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Virgin Coconut Oil', url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Sweet Almond Oil', url: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Cold-Pressed Castor Oil', url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Cold-Pressed Flaxseed Oil', url: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Whole Wheat Atta & Grains', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Pearl Millet (Bajra)', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Pure Desi Bilona Ghee', url: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Raw Honey (Chhoti Makhi)', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Traditional Desi Jaggery / Shakkar', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Salem Golden Turmeric', url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Sun-Dried Red Chilli', url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Green Coriander (Dhaniya)', url: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Aromatic Whole Spices (Khade Masale)', url: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Imperial Garam Masala', url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Organic Oil Cake (Khal)', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80' },
];

export default function AdminProductEdit() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id && id !== 'new';
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    categoryId: '',
    shortDescription: '',
    description: '',
    status: 'PUBLISHED',
    isFeatured: false,
    variants: [
      { name: '500 ml Bottle', sku: '', price: 299, compareAtPrice: 349, stock: 50, lowStockThreshold: 5 },
    ],
  });

  // State for image management
  const [images, setImages] = useState<ProductImageItem[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [pushingIdx, setPushingIdx] = useState<number | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Cloudinary connection diagnostics
  const { data: cloudStatus, refetch: refetchCloudStatus } = useQuery({
    queryKey: ['cloudinary-status'],
    queryFn: async () => {
      const res = await api.get('/upload/status');
      return res.data;
    },
    staleTime: 60000,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories-select'],
    queryFn: async () => {
      const res = await api.get('/admin/categories');
      return res.data.categories || [];
    },
  });

  const { data: existingProduct, isLoading } = useQuery({
    queryKey: ['admin-product-detail', id],
    queryFn: async () => {
      const res = await api.get(`/admin/products/${id}`);
      return res.data.product;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name || '',
        slug: existingProduct.slug || '',
        sku: existingProduct.sku || '',
        categoryId: existingProduct.categoryId || '',
        shortDescription: existingProduct.shortDescription || '',
        description: existingProduct.description || '',
        status: existingProduct.status || 'PUBLISHED',
        isFeatured: existingProduct.isFeatured || false,
        variants: existingProduct.variants?.map((v: any) => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          price: Math.round(v.price / 100),
          compareAtPrice: v.compareAtPrice ? Math.round(v.compareAtPrice / 100) : undefined,
          stock: v.stock,
          lowStockThreshold: v.lowStockThreshold,
        })) || [],
      });

      // Normalize images from backend
      if (Array.isArray(existingProduct.images)) {
        const normalized = existingProduct.images.map((img: any) => {
          if (typeof img === 'string') return { url: img, altText: existingProduct.name };
          return { id: img.id, url: img.url, altText: img.altText || existingProduct.name, sortOrder: img.sortOrder };
        });
        setImages(normalized);
      }
    }
  }, [existingProduct]);

  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: isEditing ? prev.slug : slugify(val),
    }));
  };

  // Add Image Handler (works for both existing product via API & new product via state)
  const handleAddImage = async (urlToAdd?: string) => {
    const targetUrl = (urlToAdd || newImageUrl).trim();
    if (!targetUrl) {
      toast({ title: 'Image URL Required', description: 'Please paste or select a valid image URL', variant: 'error' });
      return;
    }

    try {
      setIsAddingImage(true);
      if (isEditing) {
        // Direct API call to save in cloud database immediately
        const res = await api.post(`/admin/products/${id}/images`, {
          url: targetUrl,
          altText: newImageAlt.trim() || formData.name || 'Product Image',
          sortOrder: images.length,
        });
        toast({ title: 'Image Added', description: 'Visual asset linked to product', variant: 'success' });
        queryClient.invalidateQueries({ queryKey: ['admin-product-detail', id] });
        queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        setImages((prev) => [...prev, res.data.image]);
      } else {
        // For new product draft
        setImages((prev) => [...prev, { url: targetUrl, altText: newImageAlt.trim() || formData.name, sortOrder: prev.length }]);
      }
      setNewImageUrl('');
      setNewImageAlt('');
    } catch (err: any) {
      toast({
        title: 'Could Not Add Image',
        description: err.message || err.response?.data?.error || 'Failed to save product image',
        variant: 'error',
      });
    } finally {
      setIsAddingImage(false);
    }
  };

  // Device File Upload Handler (uploads to Cloudinary / storage)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      setIsUploadingFile(true);
      const res = await api.post('/upload/product-image', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrl = res.data.url;
      const isCloud = res.data.provider === 'cloudinary';

      toast({
        title: isCloud ? 'Uploaded to Cloudinary' : 'Uploaded to Storage',
        description: isCloud
          ? 'Image stored in your Cloudinary media bucket.'
          : res.data.message || 'Image saved on server storage.',
        variant: 'success',
      });

      await handleAddImage(uploadedUrl);
    } catch (err: any) {
      toast({
        title: 'Upload Failed',
        description: err.message || err.response?.data?.error || 'Could not upload image from device',
        variant: 'error',
      });
    } finally {
      setIsUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Transfer external image URL to Cloudinary
  const handlePushToCloudinary = async (img: ProductImageItem, idx: number) => {
    try {
      setPushingIdx(idx);
      const res = await api.post('/upload/push-url-to-cloudinary', { imageUrl: img.url });
      const newCloudUrl = res.data.url;

      if (isEditing && img.id) {
        await api.delete(`/admin/products/${id}/images/${img.id}`);
        const addRes = await api.post(`/admin/products/${id}/images`, {
          url: newCloudUrl,
          altText: img.altText || formData.name,
          sortOrder: idx,
        });
        setImages((prev) => prev.map((item, i) => (i === idx ? addRes.data.image : item)));
      } else {
        setImages((prev) => prev.map((item, i) => (i === idx ? { ...item, url: newCloudUrl } : item)));
      }

      toast({
        title: 'Pushed to Cloudinary',
        description: 'Image asset transferred to Cloudinary media library',
        variant: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-product-detail', id] });
    } catch (err: any) {
      toast({
        title: 'Cloudinary Push Error',
        description: err.message || err.response?.data?.error || 'Failed to upload to Cloudinary',
        variant: 'error',
      });
    } finally {
      setPushingIdx(null);
    }
  };

  // Delete Image Handler
  const handleDeleteImage = async (img: ProductImageItem, index: number) => {
    try {
      if (isEditing && img.id) {
        await api.delete(`/admin/products/${id}/images/${img.id}`);
        toast({ title: 'Image Removed', variant: 'success' });
        queryClient.invalidateQueries({ queryKey: ['admin-product-detail', id] });
        queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      }
      setImages((prev) => prev.filter((_, idx) => idx !== index));
    } catch (err: any) {
      toast({
        title: 'Error Deleting Image',
        description: err.message || err.response?.data?.error || 'Could not delete visual asset',
        variant: 'error',
      });
    }
  };

  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          name: '1 Litre Bottle',
          sku: `${prev.sku || 'KV'}-${Date.now().toString().slice(-4)}`,
          price: 499,
          compareAtPrice: 599,
          stock: 30,
          lowStockThreshold: 5,
        },
      ],
    }));
  };

  const handleRemoveVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, idx) => idx !== index),
    }));
  };

  const handleVariantChange = (index: number, field: string, val: any) => {
    setFormData((prev) => {
      const nextVars = [...prev.variants];
      nextVars[index] = { ...nextVars[index], [field]: val };
      return { ...prev, variants: nextVars };
    });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        sku: formData.sku,
        categoryId: formData.categoryId,
        shortDescription: formData.shortDescription,
        description: formData.description,
        status: formData.status,
        isFeatured: formData.isFeatured,
      };

      if (isEditing) {
        return api.put(`/admin/products/${id}`, payload);
      } else {
        const createRes = await api.post('/admin/products', payload);
        const newProd = createRes.data.product;

        // Automatically link pending images
        if (images.length > 0) {
          for (let i = 0; i < images.length; i++) {
            await api.post(`/admin/products/${newProd.id}/images`, {
              url: images[i].url,
              altText: images[i].altText || newProd.name,
              sortOrder: i,
            }).catch(() => {});
          }
        }

        // Create variants for new product
        if (formData.variants.length > 0) {
          for (const v of formData.variants) {
            await api.post('/admin/variants', {
              productId: newProd.id,
              name: v.name,
              sku: v.sku || `${newProd.sku}-${v.name.replace(/\s+/g, '')}`,
              price: v.price * 100, // into paise
              compareAtPrice: v.compareAtPrice ? v.compareAtPrice * 100 : undefined,
              stock: v.stock,
              lowStockThreshold: v.lowStockThreshold || 5,
            }).catch(() => {});
          }
        }

        return createRes;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({
        title: isEditing ? 'Product Updated' : 'Product Created',
        description: 'Product specifications and visual assets saved successfully',
        variant: 'success',
      });
      navigate('/admin/products');
    },
    onError: (err: any) => {
      toast({
        title: 'Save Failed',
        description: err.message || err.response?.data?.error || 'Could not save product',
        variant: 'error',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug || !formData.sku || !formData.categoryId) {
      toast({ title: 'Validation Error', description: 'Please fill in Name, Slug, SKU, and Category', variant: 'error' });
      return;
    }
    saveMutation.mutate();
  };

  if (isEditing && isLoading) {
    return (
      <div className="py-20 text-center font-sans text-xs uppercase tracking-widest text-[#7d7567]">
        Loading product specification register...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Action Header with smooth curves */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e5e2da]">
        <div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7d7567] hover:text-[#6e3418] uppercase tracking-wider mb-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Products
          </Link>
          <h1 className="font-serif text-2xl font-bold text-[#2d2a26]">
            {isEditing ? `Edit: ${formData.name || 'Product'}` : 'Create New Product'}
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saveMutation.isPending}
          className="bg-[#6e3418] hover:bg-[#522510] text-[#fafbf5] py-2.5 px-6 text-xs uppercase tracking-wider font-semibold rounded-full flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
        >
          <span className="material-symbols-outlined text-base">save</span>
          {saveMutation.isPending ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. VISUAL ASSETS & IMAGERY CARD (WITH CLOUDINARY & LOCAL STORAGE) */}
        <div className="bg-[#fafbf5] p-6 rounded-3xl border border-[#e5e2da] space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e2da] pb-4">
            <div>
              <h2 className="font-serif text-base font-bold text-[#2d2a26] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6e3418] text-xl">photo_library</span>
                Product Pictures &amp; Visual Gallery ({images.length})
              </h2>
              <p className="text-xs text-[#7d7567] mt-0.5">
                Upload real photos from your phone/computer directly to Cloudinary or attach online photo links
              </p>
            </div>

            {/* Cloudinary Status & Image Count */}
            <div className="flex items-center gap-2 flex-wrap">
              {cloudStatus?.connected ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Cloudinary Connected ({cloudStatus.cloudName})
                </span>
              ) : (
                <div className="group relative">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1 rounded-full cursor-help">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Cloudinary: {cloudStatus?.message ? 'Configuration Alert' : 'Checking...'}
                  </span>
                  <div className="absolute right-0 top-full mt-2 w-72 p-3 bg-[#2d2a26] text-white text-[11px] rounded-2xl shadow-xl z-50 invisible group-hover:visible transition-all">
                    <p className="font-bold text-amber-300 mb-1">Cloudinary Sync Info:</p>
                    <p className="leading-relaxed">{cloudStatus?.tip || cloudStatus?.message || 'Cloudinary credentials configured. Ensure your Cloud Name matches your Cloudinary account console.'}</p>
                    <p className="mt-1 text-[10px] text-gray-300">File uploads will automatically use resilient server storage if Cloudinary returns a mismatch.</p>
                  </div>
                </div>
              )}

              {images.length > 0 && (
                <span className="text-[11px] font-semibold text-[#3f674f] bg-[#3f674f]/10 px-3 py-1 rounded-full">
                  {images.length} Image(s) Attached
                </span>
              )}
            </div>
          </div>

          {/* Device File Upload Bar */}
          <div className="p-4 bg-gradient-to-r from-[#f4f4ec] to-[#fafbf5] rounded-2xl border border-[#e5e2da] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-2xl bg-[#6e3418]/10 text-[#6e3418] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">cloud_upload</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#2d2a26]">Upload Picture from Computer / Mobile</p>
                <p className="text-[11px] text-[#7d7567]">JPEG, PNG, WebP up to 10 MB. Pushes directly to Cloudinary storage.</p>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
            />

            <button
              type="button"
              disabled={isUploadingFile}
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto bg-[#6e3418] hover:bg-[#522510] disabled:opacity-50 text-[#fafbf5] px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
            >
              <span className="material-symbols-outlined text-base">upload_file</span>
              {isUploadingFile ? 'Uploading to Cloud...' : 'Choose File to Upload'}
            </button>
          </div>

          {/* Current Gallery Grid */}
          {images.length === 0 ? (
            <div className="py-8 px-4 text-center border-2 border-dashed border-[#e5e2da] rounded-2xl bg-[#f4f4ec]/50 space-y-2">
              <span className="material-symbols-outlined text-4xl text-[#7d7567]">add_photo_alternate</span>
              <p className="text-xs font-semibold text-[#2d2a26]">No pictures currently attached to this product.</p>
              <p className="text-[11px] text-[#7d7567]">Click 'Choose File to Upload' above, paste an image link, or select a Vedic preset.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {images.map((img, idx) => {
                const isCloudinary = img.url.includes('res.cloudinary.com');
                return (
                  <div
                    key={idx}
                    className="relative group bg-[#f4f4ec] rounded-2xl border border-[#e5e2da] overflow-hidden aspect-square shadow-xs"
                  >
                    <img
                      src={img.url}
                      alt={img.altText || formData.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-[#6e3418] text-[#fafbf5] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        Primary
                      </span>
                    )}

                    {isCloudinary && (
                      <span className="absolute bottom-2 left-2 bg-blue-600/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        Cloudinary
                      </span>
                    )}

                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!isCloudinary && cloudStatus?.connected && (
                        <button
                          type="button"
                          disabled={pushingIdx === idx}
                          onClick={() => handlePushToCloudinary(img, idx)}
                          className="w-7 h-7 bg-blue-600/90 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-sm cursor-pointer"
                          title="Push this image to Cloudinary"
                        >
                          <span className="material-symbols-outlined text-xs">
                            {pushingIdx === idx ? 'sync' : 'cloud_upload'}
                          </span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img, idx)}
                        className="w-7 h-7 bg-red-600/90 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-sm cursor-pointer"
                        title="Remove Image"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>

                    <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs text-white p-1.5 text-[10px] truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {img.altText || 'Product Photo'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Image URL Input Bar */}
          <div className="bg-[#f4f4ec] p-4 rounded-2xl border border-[#e5e2da] space-y-3">
            <label className="text-xs font-bold text-[#2d2a26] block uppercase tracking-wider">
              Or Attach Picture from Web URL
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste direct image link (e.g. https://images.unsplash.com/... or https://res.cloudinary.com/...)"
                className="flex-1 bg-[#fafbf5] border border-[#e5e2da] rounded-full px-4 py-2.5 text-xs text-[#2d2a26] focus:outline-none focus:border-[#6e3418] focus:ring-1 focus:ring-[#6e3418]"
              />
              <input
                type="text"
                value={newImageAlt}
                onChange={(e) => setNewImageAlt(e.target.value)}
                placeholder="Alt description (optional)"
                className="w-full sm:w-48 bg-[#fafbf5] border border-[#e5e2da] rounded-full px-4 py-2.5 text-xs text-[#2d2a26] focus:outline-none focus:border-[#6e3418]"
              />
              <button
                type="button"
                disabled={isAddingImage || !newImageUrl.trim()}
                onClick={() => handleAddImage()}
                className="bg-[#3f674f] hover:bg-[#2e4d3a] disabled:opacity-40 text-[#fafbf5] px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-xs active:scale-95"
              >
                {isAddingImage ? 'Attaching...' : 'Add Link'}
              </button>
            </div>

            {/* 1-Click Traditional Product Photography Presets */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-[#7d7567] block mb-2 uppercase tracking-wider">
                1-Click Authentic Indian Harvest Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleAddImage(preset.url)}
                    className="text-[11px] bg-[#fafbf5] hover:bg-[#6e3418] hover:text-[#fafbf5] text-[#52443c] border border-[#e5e2da] rounded-full px-3 py-1 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Basic Info Card */}
        <div className="bg-[#fafbf5] p-6 rounded-3xl border border-[#e5e2da] space-y-4 shadow-xs">
          <h2 className="font-serif text-base font-bold text-[#2d2a26] border-b border-[#e5e2da] pb-2">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Pure Wood-Pressed Mustard Oil"
                className="input"
              />
            </div>
            <div>
              <label className="label">URL Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="pure-wood-pressed-mustard-oil"
                className="input font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">SKU (Master) *</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="KV-MUST-01"
                className="input font-mono text-xs uppercase"
              />
            </div>

            <div>
              <label className="label">Category *</label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="select"
              >
                <option value="">Select Category</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="select"
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Short Description</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="One-liner for product cards and search results"
              className="input text-xs"
            />
          </div>

          <div>
            <label className="label">Full Vedic Extraction &amp; Benefits Story</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe extraction in Vagai wood, stone-pulverization, traditional uses, and lab assays..."
              className="input text-xs rounded-2xl"
            />
          </div>
        </div>

        {/* 3. Variants & Pricing Card */}
        <div className="bg-[#fafbf5] p-6 rounded-3xl border border-[#e5e2da] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#e5e2da] pb-2">
            <h2 className="font-serif text-base font-bold text-[#2d2a26] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#6e3418] text-base">layers</span> Packaging Sizes &amp; Pricing
            </h2>
            <button
              type="button"
              onClick={handleAddVariant}
              className="bg-[#3f674f] hover:bg-[#2e4d3a] text-[#fafbf5] py-1.5 px-4 rounded-full text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-sm">add</span> Add Pack Size
            </button>
          </div>

          <div className="space-y-3">
            {formData.variants.map((v: any, index: number) => (
              <div
                key={index}
                className="p-4 rounded-2xl border border-[#e5e2da] bg-[#f4f4ec] grid grid-cols-2 sm:grid-cols-6 gap-3 items-end shadow-xs"
              >
                <div>
                  <label className="text-[11px] font-semibold text-[#7d7567] block mb-1">Pack Title</label>
                  <input
                    type="text"
                    value={v.name}
                    onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                    placeholder="e.g. 1 Litre Bottle"
                    className="input text-xs py-1.5"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#7d7567] block mb-1">Variant SKU</label>
                  <input
                    type="text"
                    value={v.sku}
                    onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                    placeholder="KV-01-1L"
                    className="input text-xs py-1.5 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#7d7567] block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={v.price}
                    onChange={(e) => handleVariantChange(index, 'price', parseInt(e.target.value) || 0)}
                    className="input text-xs py-1.5 font-semibold text-[#6e3418]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#7d7567] block mb-1">MRP / Compare (₹)</label>
                  <input
                    type="number"
                    value={v.compareAtPrice || ''}
                    onChange={(e) => handleVariantChange(index, 'compareAtPrice', parseInt(e.target.value) || undefined)}
                    className="input text-xs py-1.5"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#7d7567] block mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={v.stock}
                    onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                    className="input text-xs py-1.5"
                  />
                </div>

                <div className="flex items-center justify-end">
                  {formData.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#7d7567] hover:text-red-700 hover:bg-red-50 transition-colors"
                      title="Remove variant"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bottom Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5e2da]">
          <Link
            to="/admin/products"
            className="px-6 py-2.5 rounded-full border border-[#e5e2da] text-xs font-semibold uppercase tracking-wider text-[#52443c] hover:bg-[#f4f4ec] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="bg-[#6e3418] hover:bg-[#522510] text-[#fafbf5] py-2.5 px-7 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
          >
            <span className="material-symbols-outlined text-base">save</span>
            {saveMutation.isPending ? 'Saving Product...' : 'Save Product & Visuals'}
          </button>
        </div>
      </form>
    </div>
  );
}
