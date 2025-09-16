"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  ImageUploadService,
  validateImageFile,
  createImagePreview,
  revokeImagePreview,
} from "@/lib/image-upload";

interface ImageUploadProps {
  label: string;
  bucket: "news" | "events";
  folder?: string;
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved?: () => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function ImageUpload({
  label,
  bucket,
  folder,
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  disabled = false,
  required = false,
  className = "",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (file: File) => {
      try {
        setError(null);
        setIsUploading(true);

        // Validate file
        const validation = validateImageFile(file);
        if (!validation.isValid) {
          setError(validation.error || "Invalid file");
          return;
        }

        // Create preview
        const preview = createImagePreview(file);
        setPreviewUrl(preview);

        // Upload to Supabase
        const result = await ImageUploadService.uploadImage(
          file,
          bucket,
          folder
        );

        // Clean up preview
        revokeImagePreview(preview);
        setPreviewUrl(null);

        // Notify parent component
        onImageUploaded(result.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        if (previewUrl) {
          revokeImagePreview(previewUrl);
          setPreviewUrl(null);
        }
      } finally {
        setIsUploading(false);
      }
    },
    [bucket, folder, onImageUploaded, previewUrl]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (disabled || isUploading) return;

      const files = Array.from(event.dataTransfer.files);
      const file = files[0];

      if (file && file.type.startsWith("image/")) {
        handleFileSelect(file);
      } else {
        setError("Please drop an image file");
      }
    },
    [disabled, isUploading, handleFileSelect]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleRemoveImage = useCallback(async () => {
    if (currentImageUrl && onImageRemoved) {
      try {
        const filePath = ImageUploadService.extractFilePathFromUrl(
          currentImageUrl,
          bucket
        );
        if (filePath) {
          await ImageUploadService.deleteImage(bucket, filePath);
        }
        onImageRemoved();
      } catch (err) {
        console.error("Failed to delete image:", err);
        // Still call onImageRemoved to remove from form
        onImageRemoved();
      }
    }
  }, [currentImageUrl, onImageRemoved, bucket]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const displayUrl = previewUrl || currentImageUrl;

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {/* Hidden file input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${
            disabled || isUploading
              ? "border-gray-200 bg-gray-50"
              : "border-gray-300 hover:border-gray-400"
          }
          ${!displayUrl ? "min-h-[200px] flex items-center justify-center" : ""}
        `}
      >
        {displayUrl ? (
          /* Image preview */
          <div className="relative">
            <Image
              src={displayUrl}
              alt="Preview"
              width={400}
              height={200}
              className="mx-auto max-h-[200px] w-auto object-contain rounded"
            />

            {/* Remove button */}
            {!disabled && !isUploading && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {/* Loading overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </div>
        ) : (
          /* Upload prompt */
          <div className="flex flex-col items-center justify-center space-y-4">
            {isUploading ? (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
                <p className="text-sm text-gray-500">Uploading image...</p>
              </>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 text-gray-400" />
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Drag and drop an image here, or click to select
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports: JPEG, PNG, WebP (max 5MB)
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={openFileDialog}
                  disabled={disabled}
                  className="mt-2"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Image
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Change image button when image exists */}
      {displayUrl && !isUploading && !disabled && (
        <Button
          type="button"
          variant="outline"
          onClick={openFileDialog}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          Change Image
        </Button>
      )}

      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
