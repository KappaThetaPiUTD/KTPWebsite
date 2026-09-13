"use client";

import { useEffect, useId, useRef, useState } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

function getFileError(file) {
  if (!file) return "Choose a photo to upload.";
  if (!ACCEPTED_TYPES.has(file.type)) {
    return "Choose a JPEG, PNG, WebP, HEIC, or HEIF image.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Photo files must be 10 MB or smaller.";
  }
  return null;
}

export default function PhotoUpload({
  eventId,
  onUploadComplete,
  label = "Upload photo",
  disabled = false,
}) {
  const inputId = useId();
  const previewUrlRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function handleFileChange(event) {
    const nextFile = event.target.files?.[0] ?? null;
    const fileError = getFileError(nextFile);

    setError(fileError || "");
    setProgress(0);
    setFile(fileError ? null : nextFile);

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = fileError ? null : URL.createObjectURL(nextFile);
    setPreviewUrl(previewUrlRef.current);
  }

  async function uploadPhoto() {
    const fileError = getFileError(file);
    if (fileError) {
      setError(fileError);
      return;
    }

    setError("");
    setProgress(0);
    setIsUploading(true);

    try {
      const signatureResponse = await fetch(
        "/api/activity-hours/upload-signature",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId }),
        }
      );
      const signedParams = await signatureResponse.json();

      if (!signatureResponse.ok) {
        throw new Error(signedParams.error || "Unable to prepare the photo upload.");
      }

      const uploadUrl = `https://api.cloudinary.com/v1_1/${signedParams.cloud_name}/image/upload`;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signedParams.api_key);
      formData.append("timestamp", String(signedParams.timestamp));
      formData.append("signature", signedParams.signature);
      formData.append("folder", signedParams.folder);

      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadUrl);
        xhr.responseType = "json";

        xhr.upload.addEventListener("progress", (uploadEvent) => {
          if (uploadEvent.lengthComputable) {
            setProgress(Math.round((uploadEvent.loaded / uploadEvent.total) * 100));
          }
        });

        xhr.addEventListener("load", () => {
          const response = xhr.response;
          if (xhr.status >= 200 && xhr.status < 300 && response?.secure_url) {
            resolve(response);
            return;
          }
          reject(
            new Error(response?.error?.message || "Cloudinary could not upload the photo.")
          );
        });
        xhr.addEventListener("error", () => {
          reject(new Error("Network error while uploading the photo."));
        });
        xhr.send(formData);
      });

      setProgress(100);
      onUploadComplete(result.secure_url);
    } catch (uploadError) {
      setError(uploadError.message || "Unable to upload the photo.");
    } finally {
      setIsUploading(false);
    }
  }

  const isDisabled = disabled || isUploading;

  return (
    <div className="space-y-3">
      <label htmlFor={inputId} className="block text-sm font-semibold text-gray-800">
        {label}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        onChange={handleFileChange}
        disabled={isDisabled}
        className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:cursor-pointer file:border-0 file:bg-primary/10 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
      />
      <p className="text-xs text-gray-500">JPEG, PNG, WebP, HEIC, or HEIF; up to 10 MB.</p>

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Selected upload preview"
          className="max-h-80 w-full rounded-lg border border-gray-200 object-contain"
        />
      )}

      {isUploading && (
        <div aria-live="polite">
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs font-medium text-gray-600">Uploading: {progress}%</p>
        </div>
      )}

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={uploadPhoto}
        disabled={isDisabled || !file}
        className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isUploading ? "Uploading…" : "Upload photo"}
      </button>
    </div>
  );
}
