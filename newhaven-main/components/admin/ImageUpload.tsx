'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
    label: string;
    description?: string;
    value: string;
    onChange: (url: string) => void;
    bucket?: string;
    folder?: string;
    accept?: string;
    maxSizeMB?: number;
    previewHeight?: number;
}

export default function ImageUpload({
    label,
    description,
    value,
    onChange,
    bucket = 'site-assets',
    folder = 'branding',
    accept = 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/x-icon',
    maxSizeMB = 5,
    previewHeight = 120,
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getPublicUrl = (path: string) => {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
    };

    const uploadFile = async (file: File) => {
        setError('');

        // Validate size
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File too large. Max ${maxSizeMB}MB allowed.`);
            return;
        }

        // Validate type
        const allowedTypes = accept.split(',').map(t => t.trim());
        if (!allowedTypes.includes(file.type)) {
            setError('Invalid file type. Please upload an image.');
            return;
        }

        setUploading(true);
        try {
            // Generate unique filename
            const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
            const timestamp = Date.now();
            const safeName = file.name
                .replace(/\.[^/.]+$/, '')
                .replace(/[^a-zA-Z0-9-_]/g, '-')
                .substring(0, 30);
            const filePath = `${folder}/${safeName}-${timestamp}.${ext}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true,
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const publicUrl = getPublicUrl(filePath);
            onChange(publicUrl);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
        // Reset input so same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) uploadFile(file);
    };

    const handleRemove = () => {
        onChange('');
    };

    const hasImage = value && value.trim() !== '';
    const isExternalUrl = hasImage && (value.startsWith('http://') || value.startsWith('https://'));
    const isLocalPath = hasImage && value.startsWith('/');

    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">{label}</label>
            {description && <p className="text-xs text-gray-500">{description}</p>}

            {/* Preview + Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-xl transition-all ${dragOver
                        ? 'border-gray-600 bg-gray-50'
                        : hasImage
                            ? 'border-gray-200 bg-gray-50'
                            : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50/30'
                    }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                {hasImage ? (
                    /* Image Preview */
                    <div className="p-4">
                        <div className="flex items-start gap-4">
                            <div
                                className="flex-shrink-0 bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center"
                                style={{ height: previewHeight, width: previewHeight * 1.5 }}
                            >
                                <img
                                    src={value}
                                    alt={label}
                                    className="max-h-full max-w-full object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '';
                                        (e.target as HTMLImageElement).alt = 'Failed to load';
                                    }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 font-mono truncate mb-3" title={value}>
                                    {value.length > 60 ? '...' + value.slice(-57) : value}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <i className="ri-upload-2-line"></i>
                                        Replace
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRemove}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                        <i className="ri-delete-bin-line"></i>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Upload Placeholder */
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full p-8 text-center cursor-pointer"
                    >
                        {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 border-3 border-gray-200 border-t-gray-700 rounded-full animate-spin"></div>
                                <p className="text-sm text-gray-900 font-medium">Uploading...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                                    <i className="ri-image-add-line text-2xl text-gray-400"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Click to upload or drag & drop
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        JPG, PNG, GIF, WebP, SVG, ICO • Max {maxSizeMB}MB
                                    </p>
                                </div>
                            </div>
                        )}
                    </button>
                )}

                {/* Uploading overlay */}
                {uploading && hasImage && (
                    <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 border-3 border-gray-200 border-t-gray-700 rounded-full animate-spin"></div>
                            <span className="text-sm font-medium text-gray-900">Uploading...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Manual URL input fallback */}
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Or paste an image URL..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 focus:ring-1 focus:ring-gray-600 focus:border-gray-600 bg-gray-50"
                />
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    <i className="ri-error-warning-line"></i>
                    {error}
                </div>
            )}

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
