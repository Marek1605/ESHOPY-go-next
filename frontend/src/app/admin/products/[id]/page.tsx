'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Package,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const isNew = productId === 'new';

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    price: '',
    regular_price: '',
    sale_price: '',
    ean: '',
    sku: '',
    image_url: '',
    gallery_images: [] as string[],
    category_id: '',
    brand: '',
    manufacturer: '',
    stock_status: 'in_stock',
    stock_quantity: '',
    affiliate_url: '',
    button_text: 'Kúpiť',
    is_active: true,
  });

  useEffect(() => {
    loadCategories();
    if (!isNew) {
      loadProduct();
    }
  }, [productId]);

  const loadCategories = async () => {
    try {
      const data = await api.adminGetCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const loadProduct = async () => {
    try {
      const product = await api.adminGetProduct(productId);
      setFormData({
        title: product.title || '',
        description: product.description || '',
        short_description: product.short_description || '',
        price: product.price?.toString() || '',
        regular_price: product.regular_price?.toString() || '',
        sale_price: product.sale_price?.toString() || '',
        ean: product.ean || '',
        sku: product.sku || '',
        image_url: product.image_url || '',
        gallery_images: product.gallery_images || [],
        category_id: product.category_id || '',
        brand: product.brand || '',
        manufacturer: product.manufacturer || '',
        stock_status: product.stock_status || 'in_stock',
        stock_quantity: product.stock_quantity?.toString() || '',
        affiliate_url: product.affiliate_url || '',
        button_text: product.button_text || 'Kúpiť',
        is_active: product.is_active ?? true,
      });
    } catch (error) {
      toast.error('Failed to load product');
      router.push('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price) {
      toast.error('Title and price are required');
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        regular_price: formData.regular_price ? parseFloat(formData.regular_price) : null,
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : null,
        category_id: formData.category_id || null,
      };

      if (isNew) {
        await api.createProduct(data);
        toast.success('Product created');
      } else {
        await api.updateProduct(productId, data);
        toast.success('Product updated');
      }

      router.push('/admin/products');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const flattenCategories = (cats: Category[], parentId: string | null = null, level = 0): { category: Category; level: number }[] => {
    let result: { category: Category; level: number }[] = [];
    const filtered = cats.filter(c => c.parent_id === parentId);
    filtered.forEach(cat => {
      result.push({ category: cat, level });
      result = result.concat(flattenCategories(cats, cat.id, level + 1));
    });
    return result;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">
            {isNew ? 'New Product' : 'Edit Product'}
          </h1>
          <p className="text-gray-400 mt-1">
            {isNew ? 'Add a new product to your catalog' : 'Update product details'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Short Description
            </label>
            <input
              type="text"
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              className="input"
              placeholder="Brief product description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input min-h-[150px]"
              placeholder="Detailed product description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="input"
            >
              <option value="">No category</option>
              {flattenCategories(categories).map(({ category, level }) => (
                <option key={category.id} value={category.id}>
                  {'—'.repeat(level)} {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div className="card p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">Pricing</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price (€) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="input"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Regular Price (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.regular_price}
                onChange={(e) => setFormData({ ...formData, regular_price: e.target.value })}
                className="input"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sale Price (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.sale_price}
                onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                className="input"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Identifiers */}
        <div className="card p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">Identifiers</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">EAN / GTIN</label>
              <input
                type="text"
                value={formData.ean}
                onChange={(e) => setFormData({ ...formData, ean: e.target.value })}
                className="input"
                placeholder="8594000000000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">SKU</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="input"
                placeholder="PROD-001"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="input"
                placeholder="Brand name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Manufacturer</label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="input"
                placeholder="Manufacturer name"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">Images</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Main Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="input"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {formData.image_url && (
            <div className="flex gap-4">
              <div className="w-32 h-32 rounded-xl bg-white/5 overflow-hidden">
                <img
                  src={formData.image_url}
                  alt="Product"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Inventory */}
        <div className="card p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">Inventory</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Stock Status</label>
              <select
                value={formData.stock_status}
                onChange={(e) => setFormData({ ...formData, stock_status: e.target.value })}
                className="input"
              >
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="on_backorder">On Backorder</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Stock Quantity</label>
              <input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                className="input"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Affiliate */}
        <div className="card p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">Affiliate Settings</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Affiliate URL</label>
            <input
              type="url"
              value={formData.affiliate_url}
              onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value })}
              className="input"
              placeholder="https://partner.com/product?id=123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Button Text</label>
            <input
              type="text"
              value={formData.button_text}
              onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
              className="input"
              placeholder="Kúpiť"
            />
          </div>
        </div>

        {/* Status */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Product Status</h2>
              <p className="text-gray-400 text-sm mt-1">
                Active products are visible on the shop
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-white/10 peer-focus:ring-2 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500 peer-checked:after:bg-white"></div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/products" className="btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isNew ? 'Create Product' : 'Save Changes'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
