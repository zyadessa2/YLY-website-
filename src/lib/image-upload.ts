import { supabase } from "./supabase";

export interface ImageUploadResult {
  url: string;
  path: string;
}

export class ImageUploadService {
  /**
   * Upload an image to Supabase Storage
   */
  static async uploadImage(
    file: File,
    bucket: "news" | "events",
    folder?: string
  ): Promise<ImageUploadResult> {
    try {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Invalid file type. Only JPEG, PNG, and WebP images are allowed."
        );
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("File size too large. Maximum size is 5MB.");
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${timestamp}_${randomString}.${fileExtension}`;

      // Create the file path
      const folderPath = folder ? `${folder}/` : "";
      const filePath = `${folderPath}${fileName}`;

      // Upload file to Supabase Storage
      console.log(`Uploading ${filePath} to ${bucket} bucket...`);

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Storage upload error details:", error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return {
        url: urlData.publicUrl,
        path: filePath,
      };
    } catch (error) {
      console.error("Image upload error:", error);
      // Add more detailed error information
      if (error instanceof Error) {
        console.error("Error stack:", error.stack);

        // If it's a Supabase error with details
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyError = error as any;
        if (anyError.statusCode) {
          console.error("Status code:", anyError.statusCode);
        }
        if (anyError.details) {
          console.error("Error details:", anyError.details);
        }
      }
      throw error;
    }
  }

  /**
   * Delete an image from Supabase Storage
   */
  static async deleteImage(
    bucket: "news" | "events",
    filePath: string
  ): Promise<void> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath]);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }
    } catch (error) {
      console.error("Image delete error:", error);
      throw error;
    }
  }

  /**
   * Extract file path from Supabase Storage URL
   */
  static extractFilePathFromUrl(
    url: string,
    bucket: "news" | "events"
  ): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      const bucketIndex = pathParts.findIndex((part) => part === bucket);

      if (bucketIndex === -1) return null;

      return pathParts.slice(bucketIndex + 1).join("/");
    } catch {
      return null;
    }
  }

  /**
   * Update image - delete old and upload new
   */
  static async updateImage(
    file: File,
    bucket: "news" | "events",
    oldImageUrl?: string,
    folder?: string
  ): Promise<ImageUploadResult> {
    try {
      // Upload new image
      const uploadResult = await this.uploadImage(file, bucket, folder);

      // Delete old image if it exists and is from our storage
      if (oldImageUrl) {
        const oldPath = this.extractFilePathFromUrl(oldImageUrl, bucket);
        if (oldPath) {
          try {
            await this.deleteImage(bucket, oldPath);
          } catch (error) {
            console.warn("Failed to delete old image:", error);
            // Don't throw here, as the new image was uploaded successfully
          }
        }
      }

      return uploadResult;
    } catch (error) {
      console.error("Image update error:", error);
      throw error;
    }
  }
}

/**
 * Helper function to create a preview URL for a File object
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Helper function to revoke a preview URL
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "File size too large. Maximum size is 5MB.",
    };
  }

  return { isValid: true };
}
