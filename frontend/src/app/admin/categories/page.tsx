'use client';

import { useEffect, useState } from 'react';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  product_count: number;
  is_active: boolean;
  children?: Category[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_id: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await api.adminGetCategories();
      setCategories(buildTree(data));
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const buildTree = (items: Category[]): Category[] => {
    const map = new Map<string, Category>();
    const roots: Category[] = [];

    items.forEach(item => {
      map.set(item.id, { ...item, children: [] });
    });

    items.forEach(item => {
      const node = map.get(item.id)!;
      if (item.parent_id && map.has(item.parent_id)) {
        map.get(item.parent_id)!.children!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const flattenCategories = (cats: Category[], level = 0): { category: Category; level: number }[] => {
    let result: { category: Category; level: number }[] = [];
    cats.forEach(cat => {
      result.push({ category: cat, level });
      if (cat.children && cat.children.length > 0) {
        result = result.concat(flattenCategories(cat.children, level + 1));
      }
    });
    return result;
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        parent_id: category.parent_id || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', parent_id: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', parent_id: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        name: formData.name,
        description: formData.description || null,
        parent_id: formData.parent_id || null,
        is_active: true,
      };

      if (editingCategory) {
        await api.updateCategory(editingCategory.id, data);
        toast.success('Category updated');
      } else {
        await api.createCategory(data);
        toast.success('Category created');
      }

      closeModal();
      loadCategories();
    } catch (error) {
      toast.error('Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;

    try {
      await api.deleteCategory(id);
      toast.success('Category deleted');
      loadCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const renderCategory = (category: Category, level: number) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.includes(category.id);

    return (
      <div key={category.id}>
        <div
          className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
          style={{ paddingLeft: `${level * 24 + 16}px` }}
        >
          <div className="flex items-center gap-3">
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(category.id)}
                className="p-1 rounded hover:bg-white/10"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}
            <FolderTree className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-white font-medium">{category.name}</p>
              <p className="text-gray-400 text-sm">{category.slug}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">
              {category.product_count} products
            </span>
            <span className={`px-2 py-1 rounded text-xs ${
              category.is_active
                ? 'bg-green-500/20 text-green-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {category.is_active ? 'Active' : 'Inactive'}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => openModal(category)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {category.children!.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Categories</h1>
          <p className="text-gray-400 mt-1">Organize your products into categories</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Categories List */}
      <div className="card divide-y divide-white/5">
        {categories.length === 0 ? (
          <div className="text-center py-16">
            <FolderTree className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No categories yet</h2>
            <p className="text-gray-400 mb-6">Create your first category to organize products</p>
            <button onClick={() => openModal()} className="btn-primary">
              Add Category
            </button>
          </div>
        ) : (
          categories.map(category => renderCategory(category, 0))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              {editingCategory ? 'Edit Category' : 'New Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Parent Category</label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="input"
                >
                  <option value="">No parent (root category)</option>
                  {flattenCategories(categories)
                    .filter(({ category }) => category.id !== editingCategory?.id)
                    .map(({ category, level }) => (
                      <option key={category.id} value={category.id}>
                        {'—'.repeat(level)} {category.name}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
