'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

const SETTING_KEYS = [
  'hero_slides',
  'hero_headline',
  'hero_subheadline',
  'hero_tag_text',
  'hero_primary_btn_text',
  'hero_primary_btn_link',
  'hero_secondary_btn_text',
  'hero_secondary_btn_link',
  'hero_badge_label',
  'hero_badge_text',
  'hero_badge_subtext',
  'hero_stat1_title',
  'hero_stat1_desc',
  'hero_stat2_title',
  'hero_stat2_desc',
  'hero_stat3_title',
  'hero_stat3_desc',
  'feature1_icon',
  'feature1_title',
  'feature1_desc',
  'feature2_icon',
  'feature2_title',
  'feature2_desc',
  'feature3_icon',
  'feature3_title',
  'feature3_desc',
  'feature4_icon',
  'feature4_title',
  'feature4_desc',
];

const DEFAULT_SLIDES = ['/brand-hero1.png', '/brand-hero2.png', '/brand-hero3.png'];

export default function HomepageConfigPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [heroSlides, setHeroSlides] = useState<string[]>(DEFAULT_SLIDES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingSlide, setUploadingSlide] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingSlideIndex, setPendingSlideIndex] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('key, value')
          .in('key', SETTING_KEYS);

        if (error) throw error;

        const map: Record<string, string> = {};
        data?.forEach((row: { key: string; value: unknown }) => {
          const v = row.value != null ? String(row.value).replace(/^"|"$/g, '') : '';
          map[row.key] = v;
        });

        setSettings(map);

        if (map.hero_slides) {
          try {
            const parsed = JSON.parse(map.hero_slides);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setHeroSlides(parsed);
            }
          } catch {
            // keep defaults
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const updateField = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const rows = Object.entries(settings).map(([key, value]) => ({
        key,
        value: JSON.stringify(value),
        updated_at: new Date().toISOString(),
      }));

      rows.push({
        key: 'hero_slides',
        value: JSON.stringify(heroSlides),
        updated_at: new Date().toISOString(),
      });

      const { error } = await supabase
        .from('store_settings')
        .upsert(rows, { onConflict: 'key' });

      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSlideUpload = async (file: File, index: number) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Max 10MB.');
      return;
    }

    setUploadingSlide(index);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
      const filePath = `hero/hero-slide-${index}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('site-assets').getPublicUrl(filePath);
      const newSlides = [...heroSlides];
      newSlides[index] = data.publicUrl;
      setHeroSlides(newSlides);
      setSaved(false);
    } catch (err: any) {
      console.error('Upload failed:', err);
      alert('Upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setUploadingSlide(null);
    }
  };

  const triggerFileInput = (index: number) => {
    setPendingSlideIndex(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && pendingSlideIndex !== null) {
      handleSlideUpload(file, pendingSlideIndex);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setPendingSlideIndex(null);
  };

  const addSlide = () => {
    setHeroSlides(prev => [...prev, '']);
    setSaved(false);
  };

  const removeSlide = (index: number) => {
    if (heroSlides.length <= 1) return;
    setHeroSlides(prev => prev.filter((_, i) => i !== index));
    setSaved(false);
  };

  const moveSlide = (from: number, to: number) => {
    if (to < 0 || to >= heroSlides.length) return;
    const arr = [...heroSlides];
    [arr[from], arr[to]] = [arr[to], arr[from]];
    setHeroSlides(arr);
    setSaved(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Configuration</h1>
          <p className="text-gray-500 mt-1">Manage hero images, headings, buttons, and feature sections.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          } disabled:opacity-60`}
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </span>
          ) : saved ? (
            <span className="flex items-center gap-2">
              <i className="ri-check-line"></i> Saved!
            </span>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>

      <div className="space-y-8">
        {/* Hero Slides */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Hero Slideshow</h2>
              <p className="text-sm text-gray-500 mt-1">These images rotate in the hero banner. Recommended size: 1920x1080 or larger.</p>
            </div>
            <button
              onClick={addSlide}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <i className="ri-add-line"></i> Add Slide
            </button>
          </div>

          <div className="space-y-4">
            {heroSlides.map((slide, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveSlide(i, i - 1)}
                    disabled={i === 0}
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-gray-200 transition-colors"
                    title="Move up"
                  >
                    <i className="ri-arrow-up-s-line text-lg"></i>
                  </button>
                  <button
                    onClick={() => moveSlide(i, i + 1)}
                    disabled={i === heroSlides.length - 1}
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-gray-200 transition-colors"
                    title="Move down"
                  >
                    <i className="ri-arrow-down-s-line text-lg"></i>
                  </button>
                </div>

                <div
                  className="w-40 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer relative group"
                  onClick={() => triggerFileInput(i)}
                >
                  {uploadingSlide === i ? (
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
                  ) : slide ? (
                    <>
                      <img
                        src={slide}
                        alt={`Hero slide ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <i className="ri-upload-2-line text-white text-xl"></i>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <i className="ri-image-add-line text-xl"></i>
                      <span className="text-[10px]">Upload</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Slide {i + 1}</label>
                  <input
                    type="text"
                    value={slide}
                    onChange={(e) => {
                      const arr = [...heroSlides];
                      arr[i] = e.target.value;
                      setHeroSlides(arr);
                      setSaved(false);
                    }}
                    placeholder="Image URL or upload..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-gray-600 focus:border-gray-600 bg-white"
                  />
                </div>

                <button
                  onClick={() => removeSlide(i)}
                  disabled={heroSlides.length <= 1}
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Remove slide"
                >
                  <i className="ri-delete-bin-line text-lg"></i>
                </button>
              </div>
            ))}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </section>

        {/* Hero Text */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Hero Text</h2>
          <p className="text-sm text-gray-500 mb-6">The main headline and subheadline shown over the hero images.</p>

          <div className="grid gap-5">
            <Field
              label="Headline"
              value={settings.hero_headline || ''}
              onChange={(v) => updateField('hero_headline', v)}
              placeholder="Your Hair, Your Crown"
            />
            <Field
              label="Subheadline"
              value={settings.hero_subheadline || ''}
              onChange={(v) => updateField('hero_subheadline', v)}
              placeholder="Premium wigs, bundles & extensions..."
              textarea
            />
            <Field
              label="Tag Text (small pill above headline)"
              value={settings.hero_tag_text || ''}
              onChange={(v) => updateField('hero_tag_text', v)}
              placeholder="Luxury Strand Haven — Premium Hair"
            />
          </div>
        </section>

        {/* Hero Buttons */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Hero Buttons</h2>
          <p className="text-sm text-gray-500 mb-6">Configure the call-to-action buttons on the hero section.</p>

          <div className="grid md:grid-cols-2 gap-5">
            <Field
              label="Primary Button Text"
              value={settings.hero_primary_btn_text || ''}
              onChange={(v) => updateField('hero_primary_btn_text', v)}
              placeholder="Shop Now"
            />
            <Field
              label="Primary Button Link"
              value={settings.hero_primary_btn_link || ''}
              onChange={(v) => updateField('hero_primary_btn_link', v)}
              placeholder="/shop"
            />
            <Field
              label="Secondary Button Text"
              value={settings.hero_secondary_btn_text || ''}
              onChange={(v) => updateField('hero_secondary_btn_text', v)}
              placeholder="Academia"
            />
            <Field
              label="Secondary Button Link"
              value={settings.hero_secondary_btn_link || ''}
              onChange={(v) => updateField('hero_secondary_btn_link', v)}
              placeholder="/academia"
            />
          </div>
        </section>

        {/* Trust Features */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Trust Feature Icons</h2>
          <p className="text-sm text-gray-500 mb-6">
            Four feature blocks shown below the featured products.
            Use <a href="https://remixicon.com/" target="_blank" rel="noreferrer" className="underline text-gray-700">Remix Icon</a> class names (e.g. <code className="text-xs bg-gray-100 px-1 rounded">ri-truck-line</code>).
          </p>

          {[1, 2, 3, 4].map(n => (
            <div key={n} className="mb-6 last:mb-0">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Feature {n}</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Field
                  label="Icon Class"
                  value={settings[`feature${n}_icon`] || ''}
                  onChange={(v) => updateField(`feature${n}_icon`, v)}
                  placeholder="ri-truck-line"
                />
                <Field
                  label="Title"
                  value={settings[`feature${n}_title`] || ''}
                  onChange={(v) => updateField(`feature${n}_title`, v)}
                  placeholder="Free Shipping"
                />
                <Field
                  label="Description"
                  value={settings[`feature${n}_desc`] || ''}
                  onChange={(v) => updateField(`feature${n}_desc`, v)}
                  placeholder="On orders over GH₵500"
                />
              </div>
            </div>
          ))}
        </section>

        {/* Bottom Save */}
        <div className="flex justify-end pb-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            } disabled:opacity-60`}
          >
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-gray-600 focus:border-gray-600 resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-gray-600 focus:border-gray-600"
        />
      )}
    </div>
  );
}
