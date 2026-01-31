'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Rss,
  Link as LinkIcon,
  Settings,
  Sparkles,
  Check,
  AlertCircle,
  FileText,
  Database,
  Loader2,
  Trash2,
  Plus,
  GripVertical,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface FieldMapping {
  id: string;
  source_field: string;
  target_field: string;
  transform_type: string;
  transform_value: string;
  default_value: string;
  is_required: boolean;
}

const TARGET_FIELDS = [
  { key: 'title', label: 'Product Name', group: 'basic', required: true },
  { key: 'description', label: 'Description', group: 'basic', required: false },
  { key: 'short_description', label: 'Short Description', group: 'basic', required: false },
  { key: 'price', label: 'Price', group: 'pricing', required: true },
  { key: 'regular_price', label: 'Regular Price', group: 'pricing', required: false },
  { key: 'sale_price', label: 'Sale Price', group: 'pricing', required: false },
  { key: 'ean', label: 'EAN / GTIN', group: 'identifiers', required: false },
  { key: 'sku', label: 'SKU', group: 'identifiers', required: false },
  { key: 'external_id', label: 'External ID', group: 'identifiers', required: false },
  { key: 'image_url', label: 'Main Image URL', group: 'media', required: false },
  { key: 'gallery_images', label: 'Gallery Images', group: 'media', required: false },
  { key: 'category', label: 'Category Path', group: 'taxonomy', required: false },
  { key: 'brand', label: 'Brand', group: 'attributes', required: false },
  { key: 'manufacturer', label: 'Manufacturer', group: 'attributes', required: false },
  { key: 'stock_status', label: 'Stock Status', group: 'inventory', required: false },
  { key: 'stock_quantity', label: 'Stock Quantity', group: 'inventory', required: false },
  { key: 'affiliate_url', label: 'Affiliate URL', group: 'affiliate', required: false },
  { key: 'button_text', label: 'Button Text', group: 'affiliate', required: false },
  { key: 'delivery_time', label: 'Delivery Time', group: 'other', required: false },
];

const TRANSFORM_TYPES = [
  { key: 'none', label: 'No transformation' },
  { key: 'trim', label: 'Trim whitespace' },
  { key: 'lowercase', label: 'Lowercase' },
  { key: 'uppercase', label: 'Uppercase' },
  { key: 'price', label: 'Format as price' },
  { key: 'default', label: 'Use default if empty' },
];

export default function NewFeedPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  // Step 1: Basic info
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [feedUrl, setFeedUrl] = useState('');
  const [feedType, setFeedType] = useState('xml');

  // Step 2: Feed settings
  const [xmlItemPath, setXmlItemPath] = useState('SHOPITEM');
  const [csvDelimiter, setCsvDelimiter] = useState(';');
  const [importMode, setImportMode] = useState('create_update');
  const [matchBy, setMatchBy] = useState('ean');

  // Step 3: Preview & Mapping
  const [previewData, setPreviewData] = useState<any>(null);
  const [sourceFields, setSourceFields] = useState<string[]>([]);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);

  const handlePreview = async () => {
    if (!feedUrl) {
      toast.error('Please enter feed URL');
      return;
    }

    setIsPreviewing(true);
    try {
      const result = await api.previewFeed(feedUrl, feedType, xmlItemPath, csvDelimiter);
      setPreviewData(result);
      setSourceFields(result.fields);

      // Auto-detect feed type if changed
      if (result.feed_type && result.feed_type !== feedType) {
        setFeedType(result.feed_type);
      }

      // Auto-detect item path
      if (result.item_path) {
        setXmlItemPath(result.item_path);
      }

      // Get auto-mappings
      const autoMappings = await api.autoMapping(result.fields);
      const newMappings: FieldMapping[] = autoMappings.map((m, i) => ({
        id: `mapping-${i}`,
        source_field: m.source_field,
        target_field: m.target_field,
        transform_type: 'none',
        transform_value: '',
        default_value: '',
        is_required: TARGET_FIELDS.find(t => t.key === m.target_field)?.required || false,
      }));

      setMappings(newMappings);
      toast.success(`Found ${result.total_count} items with ${result.fields.length} fields`);
      setStep(3);
    } catch (error: any) {
      toast.error(error.message || 'Preview failed');
    } finally {
      setIsPreviewing(false);
    }
  };

  const addMapping = () => {
    setMappings([
      ...mappings,
      {
        id: `mapping-${Date.now()}`,
        source_field: sourceFields[0] || '',
        target_field: '',
        transform_type: 'none',
        transform_value: '',
        default_value: '',
        is_required: false,
      },
    ]);
  };

  const updateMapping = (id: string, field: string, value: any) => {
    setMappings(mappings.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const removeMapping = (id: string) => {
    setMappings(mappings.filter(m => m.id !== id));
  };

  const handleSubmit = async () => {
    // Validate required mappings
    const requiredTargets = TARGET_FIELDS.filter(f => f.required).map(f => f.key);
    const mappedTargets = mappings.map(m => m.target_field);
    const missingRequired = requiredTargets.filter(t => !mappedTargets.includes(t));

    if (missingRequired.length > 0) {
      toast.error(`Missing required mappings: ${missingRequired.join(', ')}`);
      return;
    }

    setIsLoading(true);
    try {
      await api.createFeed({
        name,
        description,
        feed_url: feedUrl,
        feed_type: feedType,
        xml_item_path: xmlItemPath,
        csv_delimiter: csvDelimiter,
        csv_has_header: true,
        import_mode: importMode,
        match_by: matchBy,
        import_images: true,
        create_attributes: true,
        active: true,
        field_mappings: mappings,
      });

      toast.success('Feed created successfully!');
      router.push('/admin/feeds');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create feed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/feeds"
          className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">New Feed</h1>
          <p className="text-gray-400 mt-1">Configure feed import with field mapping</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4">
        {[
          { num: 1, label: 'Basic Info' },
          { num: 2, label: 'Settings' },
          { num: 3, label: 'Field Mapping' },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                step >= s.num
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-400'
              }`}
            >
              {step > s.num ? <Check className="w-4 h-4" /> : s.num}
            </div>
            <span className={step >= s.num ? 'text-white' : 'text-gray-400'}>{s.label}</span>
            {i < 2 && <div className="w-12 h-0.5 bg-white/10 mx-2" />}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Feed Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="My Product Feed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input min-h-[100px]"
              placeholder="Optional description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Feed URL *
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={feedUrl}
                onChange={(e) => setFeedUrl(e.target.value)}
                className="input pl-12"
                placeholder="https://example.com/feed.xml"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Feed Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'xml', label: 'XML', icon: FileText, color: 'orange' },
                { value: 'csv', label: 'CSV', icon: Database, color: 'green' },
                { value: 'json', label: 'JSON', icon: FileText, color: 'blue' },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFeedType(type.value)}
                  className={`p-4 rounded-xl border transition-all ${
                    feedType === type.value
                      ? 'bg-blue-500/20 border-blue-500/50 text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <type.icon className={`w-6 h-6 mx-auto mb-2 text-${type.color}-400`} />
                  <span className="font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!name || !feedUrl}
              className="btn-primary flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Settings */}
      {step === 2 && (
        <div className="card p-6 space-y-6">
          {feedType === 'xml' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                XML Item Path
              </label>
              <input
                type="text"
                value={xmlItemPath}
                onChange={(e) => setXmlItemPath(e.target.value)}
                className="input"
                placeholder="SHOPITEM"
              />
              <p className="text-gray-500 text-xs mt-1">Element name that contains each product</p>
            </div>
          )}

          {feedType === 'csv' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                CSV Delimiter
              </label>
              <select
                value={csvDelimiter}
                onChange={(e) => setCsvDelimiter(e.target.value)}
                className="input"
              >
                <option value=";">Semicolon (;)</option>
                <option value=",">Comma (,)</option>
                <option value="\t">Tab</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Import Mode
            </label>
            <select
              value={importMode}
              onChange={(e) => setImportMode(e.target.value)}
              className="input"
            >
              <option value="create_update">Create & Update</option>
              <option value="create_only">Create Only (skip existing)</option>
              <option value="update_only">Update Only (skip new)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Match Products By
            </label>
            <select
              value={matchBy}
              onChange={(e) => setMatchBy(e.target.value)}
              className="input"
            >
              <option value="ean">EAN / GTIN</option>
              <option value="sku">SKU</option>
              <option value="external_id">External ID</option>
              <option value="title">Product Title</option>
            </select>
            <p className="text-gray-500 text-xs mt-1">How to identify existing products for updates</p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handlePreview}
              disabled={isPreviewing}
              className="btn-primary flex items-center gap-2"
            >
              {isPreviewing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading Preview...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Preview & Auto-Map
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Field Mapping */}
      {step === 3 && previewData && (
        <div className="space-y-6">
          {/* Preview Info */}
          <div className="card p-4 bg-green-500/10 border-green-500/20">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-medium">
                  Feed loaded successfully: {previewData.total_count} items found
                </p>
                <p className="text-gray-400 text-sm">
                  Detected {sourceFields.length} fields • Type: {previewData.feed_type?.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Field Mappings */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Field Mappings</h2>
              <button onClick={addMapping} className="btn-secondary flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" />
                Add Mapping
              </button>
            </div>

            <div className="space-y-4">
              {mappings.map((mapping) => (
                <div
                  key={mapping.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <GripVertical className="w-5 h-5 text-gray-600 cursor-grab" />

                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Source Field */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Source Field</label>
                      <select
                        value={mapping.source_field}
                        onChange={(e) => updateMapping(mapping.id, 'source_field', e.target.value)}
                        className="input text-sm py-2"
                      >
                        <option value="">Select...</option>
                        {sourceFields.map((field) => (
                          <option key={field} value={field}>{field}</option>
                        ))}
                      </select>
                    </div>

                    {/* Target Field */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Target Field</label>
                      <select
                        value={mapping.target_field}
                        onChange={(e) => updateMapping(mapping.id, 'target_field', e.target.value)}
                        className="input text-sm py-2"
                      >
                        <option value="">Select...</option>
                        {Object.entries(
                          TARGET_FIELDS.reduce((acc, f) => {
                            if (!acc[f.group]) acc[f.group] = [];
                            acc[f.group].push(f);
                            return acc;
                          }, {} as Record<string, typeof TARGET_FIELDS>)
                        ).map(([group, fields]) => (
                          <optgroup key={group} label={group.charAt(0).toUpperCase() + group.slice(1)}>
                            {fields.map((field) => (
                              <option key={field.key} value={field.key}>
                                {field.label} {field.required && '*'}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    {/* Transform */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Transform</label>
                      <select
                        value={mapping.transform_type}
                        onChange={(e) => updateMapping(mapping.id, 'transform_type', e.target.value)}
                        className="input text-sm py-2"
                      >
                        {TRANSFORM_TYPES.map((t) => (
                          <option key={t.key} value={t.key}>{t.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Default Value */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Default Value</label>
                      <input
                        type="text"
                        value={mapping.default_value}
                        onChange={(e) => updateMapping(mapping.id, 'default_value', e.target.value)}
                        className="input text-sm py-2"
                        placeholder="Optional..."
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => removeMapping(mapping.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}

              {mappings.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No field mappings configured</p>
                  <button onClick={addMapping} className="text-blue-400 hover:text-blue-300 text-sm mt-2">
                    Add first mapping
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sample Data Preview */}
          {previewData.items && previewData.items.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Sample Data</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      {sourceFields.slice(0, 6).map((field) => (
                        <th key={field} className="text-left py-3 px-4 text-gray-400 font-medium">
                          {field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.items.slice(0, 3).map((item: any, i: number) => (
                      <tr key={i} className="border-b border-white/5">
                        {sourceFields.slice(0, 6).map((field) => (
                          <td key={field} className="py-3 px-4 text-gray-300 truncate max-w-[200px]">
                            {String(item[field] || '-')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Create Feed
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
