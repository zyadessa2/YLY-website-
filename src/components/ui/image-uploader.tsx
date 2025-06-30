"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ImageUploadService,
  createImagePreview,
  revokeImagePreview,
  validateImageFile,
} from "@/lib/image-upload";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  id: string;
  label: string;
  description?: string;
  existingUrl?: string;
  bucket: "news" | "events";
  folder?: string;
  onUploadComplete: (result: { url: string; path: string }) => void;
  onError?: (error: Error) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ImageUploader({
  id,
  label,
  description,
  existingUrl,
  bucket,
  folder,
  onUploadComplete,
  onError,
  required = false,
  disabled = false,
  className = "",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    existingUrl || null
  );
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error || "Invalid file");
      return;
    }

    // Create preview
    const preview = createImagePreview(file);
    setPreviewUrl(preview);
    setError(null);

    try {
      setIsUploading(true);
      console.log(`Starting upload to ${bucket} bucket...`);
      console.log(
        `File details: ${file.name}, ${file.type}, ${file.size} bytes`
      );

      let result;

      if (existingUrl) {
        // Update existing image
        console.log(`Updating existing image: ${existingUrl}`);
        result = await ImageUploadService.updateImage(
          file,
          bucket,
          existingUrl,
          folder
        );
      } else {
        // Upload new image
        console.log(`Uploading new image to folder: ${folder || "root"}`);
        result = await ImageUploadService.uploadImage(file, bucket, folder);
      }

      // Clean up local preview
      revokeImagePreview(preview);

      // Set the actual URL from storage
      setPreviewUrl(result.url);
      console.log(
        `Upload successful. URL: ${result.url}, Path: ${result.path}`
      );

      // Notify parent component
      onUploadComplete(result);
    } catch (err) {
      console.error("Upload error details:", err);

      // Add more detailed error reporting
      if (err instanceof Error) {
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);

        // Try to extract more information from Supabase errors
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyErr = err as any;
        if (anyErr.statusCode) {
          console.error("Status code:", anyErr.statusCode);
        }
        if (anyErr.details) {
          console.error("Error details:", anyErr.details);
        }
      }

      setError(err instanceof Error ? err.message : "Upload failed");
      if (onError && err instanceof Error) {
        onError(err);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPreviewUrl(null);
    onUploadComplete({ url: "", path: "" });
  };

  const triggerFileInput = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="flex items-center">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {description && <p className="text-sm text-gray-500">{description}</p>}

      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
        aria-hidden="true"
      />

      {!previewUrl ? (
        <div
          onClick={triggerFileInput}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-gray-400 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <ImageIcon className="h-10 w-10 text-gray-400" />
            <div className="text-sm font-medium">
              {isUploading ? "Uploading..." : "Click to upload image"}
            </div>
            <p className="text-xs text-gray-500">
              JPEG, PNG or WebP (max. 5MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
            <Image src={previewUrl} alt={label} fill className="object-cover" />
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemoveImage}
              className="absolute -top-3 -right-3 h-8 w-8 rounded-full shadow-md"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </Button>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

      {!previewUrl && (
        <Button
          type="button"
          variant="outline"
          onClick={triggerFileInput}
          disabled={disabled || isUploading}
          className="mt-2"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload image"}
        </Button>
      )}
    </div>
  );
}

export function MultiImageUploader({
  id,
  label,
  description,
  existingUrls = [],
  bucket,
  folder,
  onUploadComplete,
  onError,
  disabled = false,
  className = "",
}: Omit<ImageUploaderProps, "existingUrl" | "onUploadComplete" | "required"> & {
  existingUrls?: string[];
  onUploadComplete: (urls: string[]) => void;
}) {
  const [images, setImages] = useState<string[]>(existingUrls);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const uploads = [];
      console.log(
        `Starting multi-upload to ${bucket} bucket, folder: ${folder || "root"}`
      );
      console.log(`Number of files: ${files.length}`);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(
          `Processing file ${i + 1}/${files.length}: ${file.name}, ${
            file.type
          }, ${file.size} bytes`
        );

        // Validate each file
        const validation = validateImageFile(file);
        if (!validation.isValid) {
          console.warn(
            `File "${file.name}" validation failed: ${validation.error}`
          );
          setError(`File "${file.name}": ${validation.error}`);
          continue;
        }

        try {
          // Upload image
          console.log(
            `Uploading file ${i + 1}: ${file.name} to ${bucket}/${
              folder || "root"
            }`
          );
          const result = await ImageUploadService.uploadImage(
            file,
            bucket,
            folder
          );
          console.log(
            `Upload successful for file ${i + 1}. URL: ${result.url}`
          );
          uploads.push(result.url);
        } catch (fileError) {
          console.error(
            `Error uploading file ${i + 1} (${file.name}):`,
            fileError
          );
          if (fileError instanceof Error) {
            setError(`Error uploading "${file.name}": ${fileError.message}`);
          }
        }
      }

      // Update images state
      const newImages = [...images, ...uploads];
      setImages(newImages);
      console.log(
        `Multi-upload complete. Total successful uploads: ${uploads.length}`
      );

      // Notify parent component
      onUploadComplete(newImages);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Multi-upload error:", err);

      // Add more detailed error reporting
      if (err instanceof Error) {
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);

        // Try to extract more information from Supabase errors
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyErr = err as any;
        if (anyErr.statusCode) {
          console.error("Status code:", anyErr.statusCode);
        }
        if (anyErr.details) {
          console.error("Error details:", anyErr.details);
        }
      }

      setError(err instanceof Error ? err.message : "Upload failed");
      if (onError && err instanceof Error) {
        onError(err);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onUploadComplete(newImages);
  };

  const triggerFileInput = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label htmlFor={id}>{label}</Label>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>

      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
        multiple
        aria-hidden="true"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((url, index) => (
          <div key={`${url}-${index}`} className="relative group">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-200">
              <Image
                src={url}
                alt={`Content image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove image</span>
              </Button>
            )}
          </div>
        ))}

        {/* Upload button for new images */}
        <div
          onClick={triggerFileInput}
          className={`border-2 border-dashed rounded-lg flex items-center justify-center aspect-square cursor-pointer transition-colors hover:border-gray-400 ${
            disabled || isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">
              {isUploading ? "Uploading..." : "Add Images"}
            </span>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
