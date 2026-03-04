'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { defaultSettings } from '@/context/CMSContext';
import ImageUpload from '@/components/admin/ImageUpload';

// ── Types ──────────────────────────────────────────────────────────
type TabId = 'general' | 'appearance' | 'homepage' | 'pages' | 'header-footer' | 'seo' | 'integrations';

interface NavLink { label: string; href: string; }
interface TeamContact { name: string; phone: string; role: string; }

const TABS: { id: TabId; label: string; icon: string }[] = [
    { id: 'general', label: 'General', icon: 'ri-store-2-line' },
    { id: 'appearance', label: 'Appearance', icon: 'ri-palette-line' },
    { id: 'homepage', label: 'Homepage', icon: 'ri-home-4-line' },
    { id: 'pages', label: 'Pages', icon: 'ri-pages-line' },
    { id: 'header-footer', label: 'Header & Footer', icon: 'ri-layout-top-2-line' },
    { id: 'seo', label: 'SEO', icon: 'ri-search-eye-line' },
    { id: 'integrations', label: 'Integrations', icon: 'ri-plug-line' },
];

// ── Helpers ────────────────────────────────────────────────────────
function FieldGroup({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">{label}</label>
            {description && <p className="text-xs text-gray-500">{description}</p>}
            {children}
        </div>
    );
}

function SectionCard({ title, description, icon, children }: { title: string; description?: string; icon?: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    {icon && <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center"><i className={`${icon} text-xl text-gray-900`}></i></div>}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
                    </div>
                </div>
            </div>
            <div className="px-6 py-5 space-y-5">{children}</div>
        </div>
    );
}

const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-sm bg-white transition-colors";
const textareaClass = `${inputClass} resize-none`;

// ── Main Component ─────────────────────────────────────────────────
export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabId>('general');
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Load settings from DB
    const fetchSettings = useCallback(async () => {
        try {
            const { data, error } = await supabase.from('store_settings').select('key, value');
            if (error) throw error;
            const map: Record<string, string> = {};
            (data || []).forEach((row: any) => {
                map[row.key] = typeof row.value === 'string' ? row.value : JSON.stringify(row.value);
            });
            setSettings(map);
        } catch (err) {
            console.error('Failed to load settings:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchSettings(); }, [fetchSettings]);

    // Get value with default fallback
    const val = (key: string): string => settings[key] ?? defaultSettings[key] ?? '';

    // Update in-memory state
    const set = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    // Save all settings to DB
    const handleSave = async () => {
        setSaving(true);
        try {
            // Upsert each setting
            const entries = Object.entries(settings).filter(([_, v]) => v !== undefined);
            for (const [key, value] of entries) {
                await supabase.from('store_settings').upsert(
                    { key, value, updated_at: new Date().toISOString() },
                    { onConflict: 'key' }
                );
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error('Failed to save settings:', err);
            alert('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // JSON list helpers
    const getJSONList = <T,>(key: string, fallback: T[]): T[] => {
        try {
            return JSON.parse(val(key)) as T[];
        } catch {
            return fallback;
        }
    };

    const setJSONList = (key: string, list: any[]) => {
        set(key, JSON.stringify(list));
    };

    // ── Color Picker Input ─────────────────────────────────────────
    const ColorInput = ({ label, settingKey, description }: { label: string; settingKey: string; description?: string }) => (
        <FieldGroup label={label} description={description}>
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={val(settingKey)}
                    onChange={e => set(settingKey, e.target.value)}
                    className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                />
                <input
                    type="text"
                    value={val(settingKey)}
                    onChange={e => set(settingKey, e.target.value)}
                    className={inputClass}
                    placeholder="#000000"
                />
            </div>
        </FieldGroup>
    );

    // ── Editable Link List ─────────────────────────────────────────
    const LinkListEditor = ({ settingKey, label }: { settingKey: string; label: string }) => {
        const links = getJSONList<NavLink>(settingKey, []);
        const updateLink = (index: number, field: keyof NavLink, value: string) => {
            const updated = [...links];
            updated[index] = { ...updated[index], [field]: value };
            setJSONList(settingKey, updated);
        };
        const addLink = () => setJSONList(settingKey, [...links, { label: '', href: '' }]);
        const removeLink = (index: number) => setJSONList(settingKey, links.filter((_, i) => i !== index));

        return (
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700">{label}</label>
                    <button onClick={addLink} className="text-xs bg-gray-50 text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                        <i className="ri-add-line mr-1"></i> Add Link
                    </button>
                </div>
                <div className="space-y-2">
                    {links.map((link, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={link.label}
                                onChange={e => updateLink(i, 'label', e.target.value)}
                                placeholder="Label"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-600"
                            />
                            <input
                                type="text"
                                value={link.href}
                                onChange={e => updateLink(i, 'href', e.target.value)}
                                placeholder="/path"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-600"
                            />
                            <button onClick={() => removeLink(i)} className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <i className="ri-delete-bin-line"></i>
                            </button>
                        </div>
                    ))}
                    {links.length === 0 && <p className="text-sm text-gray-400 py-2">No links added yet.</p>}
                </div>
            </div>
        );
    };

    // ── Team Contacts Editor ───────────────────────────────────────
    const TeamContactsEditor = () => {
        const contacts = getJSONList<TeamContact>('contact_team_json', []);
        const updateContact = (index: number, field: keyof TeamContact, value: string) => {
            const updated = [...contacts];
            updated[index] = { ...updated[index], [field]: value };
            setJSONList('contact_team_json', updated);
        };
        const addContact = () => setJSONList('contact_team_json', [...contacts, { name: '', phone: '', role: '' }]);
        const removeContact = (index: number) => setJSONList('contact_team_json', contacts.filter((_, i) => i !== index));

        return (
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700">Team Contacts</label>
                    <button onClick={addContact} className="text-xs bg-gray-50 text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                        <i className="ri-add-line mr-1"></i> Add Contact
                    </button>
                </div>
                <div className="space-y-2">
                    {contacts.map((c, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <input type="text" value={c.name} onChange={e => updateContact(i, 'name', e.target.value)} placeholder="Name" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                            <input type="text" value={c.phone} onChange={e => updateContact(i, 'phone', e.target.value)} placeholder="Phone" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                            <input type="text" value={c.role} onChange={e => updateContact(i, 'role', e.target.value)} placeholder="Role" className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                            <button onClick={() => removeContact(i)} className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg"><i className="ri-delete-bin-line"></i></button>
                        </div>
                    ))}
                    {contacts.length === 0 && <p className="text-sm text-gray-400 py-2">No team contacts configured.</p>}
                </div>
            </div>
        );
    };

    // ── Tab Content ────────────────────────────────────────────────
    const renderTabContent = () => {
        switch (activeTab) {
            // ═══════════════════════════════════════════════════════
            case 'general':
                return (
                    <div className="space-y-6">
                        <SectionCard title="Store Information" icon="ri-store-2-line" description="Basic details about your store">
                            <div className="grid md:grid-cols-2 gap-5">
                                <FieldGroup label="Store Name"><input type="text" value={val('site_name')} onChange={e => set('site_name', e.target.value)} className={inputClass} /></FieldGroup>
                                <FieldGroup label="Tagline / Slogan"><input type="text" value={val('site_tagline')} onChange={e => set('site_tagline', e.target.value)} className={inputClass} /></FieldGroup>
                                <ImageUpload label="Store Logo" description="Your store's main logo" value={val('site_logo')} onChange={(url) => set('site_logo', url)} folder="branding" previewHeight={80} />
                                <ImageUpload label="Favicon" description="Browser tab icon (ICO, PNG, SVG)" value={val('site_favicon')} onChange={(url) => set('site_favicon', url)} folder="branding" accept="image/x-icon,image/vnd.microsoft.icon,image/png,image/svg+xml" previewHeight={48} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-5">
                                <FieldGroup label="Currency Code"><input type="text" value={val('currency')} onChange={e => set('currency', e.target.value)} className={inputClass} placeholder="GHS" /></FieldGroup>
                                <FieldGroup label="Currency Symbol"><input type="text" value={val('currency_symbol')} onChange={e => set('currency_symbol', e.target.value)} className={inputClass} placeholder="GH₵" /></FieldGroup>
                            </div>
                        </SectionCard>

                        <SectionCard title="Contact Details" icon="ri-contacts-line" description="How customers can reach you">
                            <div className="grid md:grid-cols-2 gap-5">
                                <FieldGroup label="Contact Email"><input type="email" value={val('contact_email')} onChange={e => set('contact_email', e.target.value)} className={inputClass} /></FieldGroup>
                                <FieldGroup label="Contact Phone"><input type="tel" value={val('contact_phone')} onChange={e => set('contact_phone', e.target.value)} className={inputClass} /></FieldGroup>
                            </div>
                            <FieldGroup label="Store Address"><input type="text" value={val('contact_address')} onChange={e => set('contact_address', e.target.value)} className={inputClass} /></FieldGroup>
                        </SectionCard>

                        <SectionCard title="Social Media" icon="ri-share-line" description="Links to your social media profiles">
                            <div className="grid md:grid-cols-2 gap-5">
                                <FieldGroup label="Facebook"><input type="url" value={val('social_facebook')} onChange={e => set('social_facebook', e.target.value)} className={inputClass} placeholder="https://facebook.com/..." /></FieldGroup>
                                <FieldGroup label="Instagram"><input type="url" value={val('social_instagram')} onChange={e => set('social_instagram', e.target.value)} className={inputClass} placeholder="https://instagram.com/..." /></FieldGroup>
                                <FieldGroup label="Twitter / X"><input type="url" value={val('social_twitter')} onChange={e => set('social_twitter', e.target.value)} className={inputClass} placeholder="https://twitter.com/..." /></FieldGroup>
                                <FieldGroup label="TikTok"><input type="url" value={val('social_tiktok')} onChange={e => set('social_tiktok', e.target.value)} className={inputClass} placeholder="https://tiktok.com/@..." /></FieldGroup>
                                <FieldGroup label="Snapchat"><input type="url" value={val('social_snapchat')} onChange={e => set('social_snapchat', e.target.value)} className={inputClass} placeholder="https://snapchat.com/add/..." /></FieldGroup>
                                <FieldGroup label="YouTube"><input type="url" value={val('social_youtube')} onChange={e => set('social_youtube', e.target.value)} className={inputClass} placeholder="https://youtube.com/..." /></FieldGroup>
                                <FieldGroup label="WhatsApp Number"><input type="text" value={val('social_whatsapp')} onChange={e => set('social_whatsapp', e.target.value)} className={inputClass} placeholder="+1234567890" /></FieldGroup>
                            </div>
                        </SectionCard>
                    </div>
                );

            // ═══════════════════════════════════════════════════════
            case 'appearance':
                return (
                    <div className="space-y-6">
                        <SectionCard title="Brand Colors" icon="ri-palette-line" description="Define your store's color scheme">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                <ColorInput label="Primary Color" settingKey="primary_color" description="Main brand color used for buttons and accents" />
                                <ColorInput label="Secondary Color" settingKey="secondary_color" description="Complementary brand color" />
                                <ColorInput label="Accent Color" settingKey="accent_color" description="Used for highlights and hover states" />
                            </div>
                        </SectionCard>
                        <SectionCard title="Header Colors" icon="ri-layout-top-line" description="Customize header appearance">
                            <div className="grid md:grid-cols-2 gap-5">
                                <ColorInput label="Header Background" settingKey="header_bg" />
                                <ColorInput label="Header Text Color" settingKey="header_text" />
                            </div>
                        </SectionCard>
                        <SectionCard title="Footer Colors" icon="ri-layout-bottom-line" description="Customize footer appearance">
                            <div className="grid md:grid-cols-2 gap-5">
                                <ColorInput label="Footer Background" settingKey="footer_bg" />
                                <ColorInput label="Footer Text Color" settingKey="footer_text" />
                            </div>
                        </SectionCard>
                    </div>
                );

            // ═══════════════════════════════════════════════════════
            case 'homepage':
                return (
                    <div className="space-y-6">
                        <SectionCard title="Hero Section" icon="ri-image-2-line" description="The main banner visitors see first">
                            <FieldGroup label="Tag Line" description="Small text above the headline"><input type="text" value={val('hero_tag_text')} onChange={e => set('hero_tag_text', e.target.value)} className={inputClass} /></FieldGroup>
                            <FieldGroup label="Headline"><input type="text" value={val('hero_headline')} onChange={e => set('hero_headline', e.target.value)} className={inputClass} /></FieldGroup>
                            <FieldGroup label="Sub-headline"><textarea rows={2} value={val('hero_subheadline')} onChange={e => set('hero_subheadline', e.target.value)} className={textareaClass} /></FieldGroup>
                            <ImageUpload label="Background Image" description="Fallback when no video (recommended: 1920×1080)" value={val('hero_image')} onChange={(url) => set('hero_image', url)} folder="homepage" previewHeight={140} />
                            <FieldGroup label="Hero Video URL" description="MP4 or WebM URL for full-screen video hero. Leave empty to use image only."><input type="url" value={val('hero_video')} onChange={e => set('hero_video', e.target.value)} className={inputClass} placeholder="https://..." /></FieldGroup>

                            <div className="grid md:grid-cols-2 gap-5">
                                <FieldGroup label="Primary Button Text"><input type="text" value={val('hero_primary_btn_text')} onChange={e => set('hero_primary_btn_text', e.target.value)} className={inputClass} /></FieldGroup>
                                <FieldGroup label="Primary Button Link"><input type="text" value={val('hero_primary_btn_link')} onChange={e => set('hero_primary_btn_link', e.target.value)} className={inputClass} /></FieldGroup>
                                <FieldGroup label="Secondary Button Text"><input type="text" value={val('hero_secondary_btn_text')} onChange={e => set('hero_secondary_btn_text', e.target.value)} className={inputClass} /></FieldGroup>
                                <FieldGroup label="Secondary Button Link"><input type="text" value={val('hero_secondary_btn_link')} onChange={e => set('hero_secondary_btn_link', e.target.value)} className={inputClass} /></FieldGroup>
                            </div>
                        </SectionCard>

                        <SectionCard title="Floating Badge" icon="ri-price-tag-3-line" description="The promotional badge on the hero image">
                            <div className="grid md:grid-cols-3 gap-5">
                                <FieldGroup label="Label"><input type="text" value={val('hero_badge_label')} onChange={e => set('hero_badge_label', e.target.value)} className={inputClass} placeholder="Exclusive Offer" /></FieldGroup>
                                <FieldGroup label="Main Text"><input type="text" value={val('hero_badge_text')} onChange={e => set('hero_badge_text', e.target.value)} className={inputClass} placeholder="25% Off" /></FieldGroup>
                                <FieldGroup label="Sub text"><input type="text" value={val('hero_badge_subtext')} onChange={e => set('hero_badge_subtext', e.target.value)} className={inputClass} placeholder="On your first order" /></FieldGroup>
                            </div>
                        </SectionCard>

                        <SectionCard title="Hero Stats" icon="ri-bar-chart-box-line" description="Statistics shown below the hero CTA (desktop only)">
                            {[1, 2, 3].map(n => (
                                <div key={n} className="grid md:grid-cols-2 gap-4">
                                    <FieldGroup label={`Stat ${n} Title`}><input type="text" value={val(`hero_stat${n}_title`)} onChange={e => set(`hero_stat${n}_title`, e.target.value)} className={inputClass} /></FieldGroup>
                                    <FieldGroup label={`Stat ${n} Description`}><input type="text" value={val(`hero_stat${n}_desc`)} onChange={e => set(`hero_stat${n}_desc`, e.target.value)} className={inputClass} /></FieldGroup>
                                </div>
                            ))}
                        </SectionCard>

                        <SectionCard title="Trust Features" icon="ri-shield-star-line" description="The 4 trust badges at the bottom of the homepage">
                            {[1, 2, 3, 4].map(n => (
                                <div key={n} className="grid md:grid-cols-3 gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                    <FieldGroup label={`Feature ${n} Icon`} description="Remix icon class name"><input type="text" value={val(`feature${n}_icon`)} onChange={e => set(`feature${n}_icon`, e.target.value)} className={inputClass} placeholder="ri-icon-name" /></FieldGroup>
                                    <FieldGroup label={`Feature ${n} Title`}><input type="text" value={val(`feature${n}_title`)} onChange={e => set(`feature${n}_title`, e.target.value)} className={inputClass} /></FieldGroup>
                                    <FieldGroup label={`Feature ${n} Description`}><input type="text" value={val(`feature${n}_desc`)} onChange={e => set(`feature${n}_desc`, e.target.value)} className={inputClass} /></FieldGroup>
                                </div>
                            ))}
                        </SectionCard>
                    </div>
                );

            // ═══════════════════════════════════════════════════════
            case 'pages':
                return (
                    <div className="space-y-6">
                        <SectionCard title="About Page" icon="ri-team-line" description="Customize the About Us page content">
                            <div className="grid md:grid-cols-2 gap-5">
                                <FieldGroup label="Hero Title"><input type="text" value={val('about_hero_title')} onChange={e => set('about_hero_title', e.target.value)} className={inputClass} /></FieldGroup>
                                <FieldGroup label="Hero Subtitle"><input type="text" value={val('about_hero_subtitle')} onChange={e => set('about_hero_subtitle', e.target.value)} className={inputClass} /></FieldGroup>
                            </div>
                            <FieldGroup label="Story Title"><input type="text" value={val('about_story_title')} onChange={e => set('about_story_title', e.target.value)} className={inputClass} /></FieldGroup>
                            <FieldGroup label="Story Content" description="The main story paragraphs. Use line breaks to separate."><textarea rows={6} value={val('about_story_content')} onChange={e => set('about_story_content', e.target.value)} className={textareaClass} /></FieldGroup>
                            <ImageUpload label="Story Image" description="Image displayed alongside your story" value={val('about_story_image')} onChange={(url) => set('about_story_image', url)} folder="pages" previewHeight={120} />
                            <div className="grid md:grid-cols-2 gap-5">
                                <FieldGroup label="Founder Name"><input type="text" value={val('about_founder_name')} onChange={e => set('about_founder_name', e.target.value)} className={inputClass} /></FieldGroup>
                                <FieldGroup label="Founder Title"><input type="text" value={val('about_founder_title')} onChange={e => set('about_founder_title', e.target.value)} className={inputClass} /></FieldGroup>
                            </div>
                            <div className="grid md:grid-cols-2 gap-5">
                                <FieldGroup label="Mission 1 Title"><input type="text" value={val('about_mission1_title')} onChange={e => set('about_mission1_title', e.target.value)} className={inputClass} /></FieldGroup>
                                <FieldGroup label="Mission 1 Content"><textarea rows={3} value={val('about_mission1_content')} onChange={e => set('about_mission1_content', e.target.value)} className={textareaClass} /></FieldGroup>
                                <FieldGroup label="Mission 2 Title"><input type="text" value={val('about_mission2_title')} onChange={e => set('about_mission2_title', e.target.value)} className={inputClass} /></FieldGroup>
                                <FieldGroup label="Mission 2 Content"><textarea rows={3} value={val('about_mission2_content')} onChange={e => set('about_mission2_content', e.target.value)} className={textareaClass} /></FieldGroup>
                            </div>
                            <div className="grid md:grid-cols-2 gap-5">
                                <FieldGroup label="Values Section Title"><input type="text" value={val('about_values_title')} onChange={e => set('about_values_title', e.target.value)} className={inputClass} /></FieldGroup>
                                <FieldGroup label="Values Section Subtitle"><input type="text" value={val('about_values_subtitle')} onChange={e => set('about_values_subtitle', e.target.value)} className={inputClass} /></FieldGroup>
                            </div>
                            <div className="grid md:grid-cols-2 gap-5">
                                <FieldGroup label="CTA Title"><input type="text" value={val('about_cta_title')} onChange={e => set('about_cta_title', e.target.value)} className={inputClass} /></FieldGroup>
                                <FieldGroup label="CTA Subtitle"><input type="text" value={val('about_cta_subtitle')} onChange={e => set('about_cta_subtitle', e.target.value)} className={inputClass} /></FieldGroup>
                            </div>
                        </SectionCard>

                        <SectionCard title="Contact Page" icon="ri-mail-send-line" description="Customize the Contact Us page">
                            <div className="grid md:grid-cols-2 gap-5">
                                <FieldGroup label="Hero Title"><input type="text" value={val('contact_hero_title')} onChange={e => set('contact_hero_title', e.target.value)} className={inputClass} /></FieldGroup>
                                <FieldGroup label="Hero Subtitle"><input type="text" value={val('contact_hero_subtitle')} onChange={e => set('contact_hero_subtitle', e.target.value)} className={inputClass} /></FieldGroup>
                            </div>
                            <div className="grid md:grid-cols-2 gap-5">
                                <FieldGroup label="Business Hours"><input type="text" value={val('contact_hours')} onChange={e => set('contact_hours', e.target.value)} className={inputClass} placeholder="Mon-Fri, 8am-6pm GMT" /></FieldGroup>
                                <FieldGroup label="Google Maps Link"><input type="url" value={val('contact_map_link')} onChange={e => set('contact_map_link', e.target.value)} className={inputClass} /></FieldGroup>
                            </div>
                            <TeamContactsEditor />
                        </SectionCard>
                    </div>
                );

            // ═══════════════════════════════════════════════════════
            case 'header-footer':
                return (
                    <div className="space-y-6">
                        <SectionCard title="Header" icon="ri-layout-top-line" description="Configure the site header navigation and logo">
                            <div className="grid md:grid-cols-2 gap-5">
                                <FieldGroup label="Logo Height (px)"><input type="number" value={val('header_logo_height')} onChange={e => set('header_logo_height', e.target.value)} className={inputClass} placeholder="40" /></FieldGroup>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                                {[
                                    { key: 'header_show_search', label: 'Show Search' },
                                    { key: 'header_show_wishlist', label: 'Show Wishlist' },
                                    { key: 'header_show_cart', label: 'Show Cart' },
                                    { key: 'header_show_account', label: 'Show Account' },
                                ].map(toggle => (
                                    <label key={toggle.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={val(toggle.key) === 'true'}
                                            onChange={e => set(toggle.key, e.target.checked ? 'true' : 'false')}
                                            className="w-5 h-5 text-gray-700 bg-white border-gray-300 rounded focus:ring-gray-600"
                                        />
                                        <span className="text-sm font-medium text-gray-700">{toggle.label}</span>
                                    </label>
                                ))}
                            </div>
                            <LinkListEditor settingKey="header_nav_links_json" label="Navigation Links" />
                        </SectionCard>

                        <SectionCard title="Footer" icon="ri-layout-bottom-line" description="Configure footer content, newsletter, and link columns">
                            <div className="grid md:grid-cols-2 gap-5">
                                <ImageUpload label="Footer Logo" description="Logo displayed in the footer" value={val('footer_logo')} onChange={(url) => set('footer_logo', url)} folder="branding" previewHeight={80} />
                                <FieldGroup label="Footer Logo Height (px)"><input type="number" value={val('footer_logo_height')} onChange={e => set('footer_logo_height', e.target.value)} className={inputClass} /></FieldGroup>
                            </div>

                            <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-100">
                                <label className="flex items-center gap-3 cursor-pointer mb-3">
                                    <input
                                        type="checkbox"
                                        checked={val('footer_show_newsletter') === 'true'}
                                        onChange={e => set('footer_show_newsletter', e.target.checked ? 'true' : 'false')}
                                        className="w-5 h-5 text-gray-700 bg-white border-gray-300 rounded focus:ring-gray-600"
                                    />
                                    <span className="text-sm font-semibold text-gray-700">Show Newsletter Section</span>
                                </label>
                                <div className="grid md:grid-cols-2 gap-4 mt-3">
                                    <FieldGroup label="Newsletter Title"><input type="text" value={val('footer_newsletter_title')} onChange={e => set('footer_newsletter_title', e.target.value)} className={inputClass} /></FieldGroup>
                                    <FieldGroup label="Newsletter Subtitle"><input type="text" value={val('footer_newsletter_subtitle')} onChange={e => set('footer_newsletter_subtitle', e.target.value)} className={inputClass} /></FieldGroup>
                                </div>
                            </div>

                            <div className="space-y-5 pt-2">
                                {[1, 2, 3].map(n => (
                                    <div key={n} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <FieldGroup label={`Column ${n} Title`}>
                                            <input type="text" value={val(`footer_col${n}_title`)} onChange={e => set(`footer_col${n}_title`, e.target.value)} className={inputClass} />
                                        </FieldGroup>
                                        <div className="mt-3">
                                            <LinkListEditor settingKey={`footer_col${n}_links_json`} label={`Column ${n} Links`} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid md:grid-cols-2 gap-5 pt-2">
                                <FieldGroup label="Copyright Text" description="Leave blank to auto-generate"><input type="text" value={val('footer_copyright_text')} onChange={e => set('footer_copyright_text', e.target.value)} className={inputClass} placeholder="© 2025 Store Name" /></FieldGroup>
                                <div className="grid grid-cols-2 gap-3">
                                    <FieldGroup label="Powered By Text"><input type="text" value={val('footer_powered_by')} onChange={e => set('footer_powered_by', e.target.value)} className={inputClass} /></FieldGroup>
                                    <FieldGroup label="Powered By Link"><input type="url" value={val('footer_powered_by_link')} onChange={e => set('footer_powered_by_link', e.target.value)} className={inputClass} /></FieldGroup>
                                </div>
                            </div>
                        </SectionCard>
                    </div>
                );

            // ═══════════════════════════════════════════════════════
            case 'seo':
                return (
                    <div className="space-y-6">
                        <SectionCard title="Search Engine Optimization" icon="ri-search-eye-line" description="Improve how your site appears in search results">
                            <FieldGroup label="Site Title" description="The default <title> tag when no page-specific title exists"><input type="text" value={val('seo_title')} onChange={e => set('seo_title', e.target.value)} className={inputClass} placeholder="Luxury Strand Haven - Tagline" /></FieldGroup>
                            <FieldGroup label="Meta Description" description="Default meta description shown in search results (max 160 characters)"><textarea rows={3} value={val('seo_description')} onChange={e => set('seo_description', e.target.value)} className={textareaClass} maxLength={160} /></FieldGroup>
                            <FieldGroup label="Keywords" description="Comma-separated keywords for search engines"><input type="text" value={val('seo_keywords')} onChange={e => set('seo_keywords', e.target.value)} className={inputClass} placeholder="keyword1, keyword2, keyword3" /></FieldGroup>
                            <ImageUpload label="Default OG Image" description="Image shown when your site is shared on social media (recommended: 1200×630)" value={val('seo_og_image')} onChange={(url) => set('seo_og_image', url)} folder="seo" previewHeight={100} />
                        </SectionCard>
                        <SectionCard title="Analytics" icon="ri-line-chart-line" description="Track your site visitors">
                            <FieldGroup label="Google Analytics Measurement ID" description="e.g. G-XXXXXXXXXX"><input type="text" value={val('seo_google_analytics')} onChange={e => set('seo_google_analytics', e.target.value)} className={inputClass} placeholder="G-XXXXXXXXXX" /></FieldGroup>
                        </SectionCard>
                    </div>
                );

            // ═══════════════════════════════════════════════════════
            case 'integrations':
                return (
                    <div className="space-y-6">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                            <i className="ri-lock-line text-amber-600 text-xl mt-0.5"></i>
                            <div>
                                <p className="text-sm font-semibold text-amber-800">Security Notice</p>
                                <p className="text-xs text-amber-700 mt-0.5">API keys stored here are accessible only by admin users via RLS policies. They are used server-side in API routes and are never exposed to the browser.</p>
                            </div>
                        </div>

                        <SectionCard title="Email (Resend)" icon="ri-mail-line" description="Configure email delivery via Resend">
                            <FieldGroup label="Resend API Key" description="Get your key from resend.com/api-keys"><input type="password" value={val('integration_resend_api_key')} onChange={e => set('integration_resend_api_key', e.target.value)} className={inputClass} placeholder="re_..." /></FieldGroup>
                            <div className="grid md:grid-cols-2 gap-5">
                                <FieldGroup label="Admin Email" description="Email for receiving order notifications"><input type="email" value={val('integration_admin_email')} onChange={e => set('integration_admin_email', e.target.value)} className={inputClass} /></FieldGroup>
                                <FieldGroup label="From Address" description="Sender name and email"><input type="text" value={val('integration_email_from')} onChange={e => set('integration_email_from', e.target.value)} className={inputClass} placeholder="Store Name <noreply@domain.com>" /></FieldGroup>
                            </div>
                        </SectionCard>

                        <SectionCard title="Payment (Moolre)" icon="ri-bank-card-line" description="Configure Moolre payment gateway">
                            <div className="grid md:grid-cols-2 gap-5">
                                <FieldGroup label="API User"><input type="text" value={val('integration_moolre_api_user')} onChange={e => set('integration_moolre_api_user', e.target.value)} className={inputClass} /></FieldGroup>
                                <FieldGroup label="API Public Key"><input type="password" value={val('integration_moolre_api_pubkey')} onChange={e => set('integration_moolre_api_pubkey', e.target.value)} className={inputClass} /></FieldGroup>
                                <FieldGroup label="Account Number"><input type="text" value={val('integration_moolre_account_number')} onChange={e => set('integration_moolre_account_number', e.target.value)} className={inputClass} /></FieldGroup>
                                <FieldGroup label="Merchant Email"><input type="email" value={val('integration_moolre_merchant_email')} onChange={e => set('integration_moolre_merchant_email', e.target.value)} className={inputClass} /></FieldGroup>
                            </div>
                        </SectionCard>

                        <SectionCard title="SMS (Moolre VAS)" icon="ri-message-2-line" description="Configure SMS notifications via Moolre SMS API">
                            <FieldGroup label="SMS API Key (VASKEY)"><input type="password" value={val('integration_moolre_sms_api_key')} onChange={e => set('integration_moolre_sms_api_key', e.target.value)} className={inputClass} /></FieldGroup>
                        </SectionCard>

                        <SectionCard title="reCAPTCHA" icon="ri-robot-line" description="Google reCAPTCHA spam protection">
                            <div className="grid md:grid-cols-2 gap-5">
                                <FieldGroup label="Site Key"><input type="text" value={val('integration_recaptcha_site_key')} onChange={e => set('integration_recaptcha_site_key', e.target.value)} className={inputClass} /></FieldGroup>
                                <FieldGroup label="Secret Key"><input type="password" value={val('integration_recaptcha_secret_key')} onChange={e => set('integration_recaptcha_secret_key', e.target.value)} className={inputClass} /></FieldGroup>
                            </div>
                        </SectionCard>

                        <SectionCard title="Application" icon="ri-global-line" description="General application settings">
                            <FieldGroup label="Application URL" description="The public-facing URL of your store"><input type="url" value={val('integration_app_url')} onChange={e => set('integration_app_url', e.target.value)} className={inputClass} placeholder="https://yourstore.com" /></FieldGroup>
                        </SectionCard>
                    </div>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
                        <p className="text-gray-500 mt-1 text-sm">Manage your store configuration, appearance, and integrations</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm ${saved
                            ? 'bg-gray-100 text-gray-900 border border-gray-200'
                            : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95'
                            } disabled:opacity-50`}
                    >
                        {saving ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving...</>
                        ) : saved ? (
                            <><i className="ri-check-line text-lg"></i> Saved!</>
                        ) : (
                            <><i className="ri-save-line text-lg"></i> Save Changes</>
                        )}
                    </button>
                </div>

                <div className="flex gap-6">
                    {/* Sidebar Tabs - Desktop */}
                    <aside className="hidden lg:block w-56 flex-shrink-0">
                        <nav className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors text-left ${activeTab === tab.id
                                        ? 'bg-gray-50 text-gray-900 border-l-4 border-gray-900'
                                        : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                                        }`}
                                >
                                    <i className={`${tab.icon} text-lg`}></i>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Mobile Tab Bar */}
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
                        <div className="flex overflow-x-auto px-2 py-2 gap-1 no-scrollbar">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                                        ? 'bg-gray-50 text-gray-900'
                                        : 'text-gray-500'
                                        }`}
                                >
                                    <i className={`${tab.icon} text-lg`}></i>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0 pb-24 lg:pb-0">
                        {renderTabContent()}
                    </main>
                </div>
            </div>
        </div>
    );
}
