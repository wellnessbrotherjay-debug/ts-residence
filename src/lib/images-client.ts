import type { DBImage } from "@/types";

const JSON_CONTENT_TYPE = "application/json";
const IMAGE_API_ENABLED = process.env.NEXT_PUBLIC_IMAGE_API_ENABLED === "true";

const parseJsonArray = async (res: Response): Promise<DBImage[]> => {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes(JSON_CONTENT_TYPE)) return [];
  const data = await res.json();
  return Array.isArray(data) ? (data as DBImage[]) : [];
};

export const listImages = async (category?: string): Promise<DBImage[]> => {
  if (!IMAGE_API_ENABLED) return [];
  try {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    const res = await fetch(`/api/images${query}`);
    if (!res.ok) return [];
    return await parseJsonArray(res);
  } catch {
    return [];
  }
};

export const uploadImage = async ({
  file,
  category,
  alt,
}: {
  file: File;
  category: string;
  alt: string;
}): Promise<string | null> => {
  if (!IMAGE_API_ENABLED) return null;
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", category);
    formData.append("alt", alt);

    const res = await fetch("/api/images", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes(JSON_CONTENT_TYPE)) return null;
    const data = (await res.json()) as Partial<DBImage>;
    return typeof data.url === "string" ? data.url : null;
  } catch {
    return null;
  }
};

export const saveImage = async ({
  id,
  file,
  category,
  alt,
}: {
  id?: number;
  file?: File | null;
  category: string;
  alt: string;
}): Promise<boolean> => {
  if (!IMAGE_API_ENABLED) return false;
  try {
    const formData = new FormData();
    if (file) formData.append("image", file);
    formData.append("category", category);
    formData.append("alt", alt);

    const url = id ? `/api/images/${id}` : "/api/images";
    const res = await fetch(url, {
      method: id ? "PUT" : "POST",
      body: formData,
    });
    return res.ok;
  } catch {
    return false;
  }
};

export const removeImage = async (id: number): Promise<boolean> => {
  if (!IMAGE_API_ENABLED) return false;
  try {
    const res = await fetch(`/api/images/${id}`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
};
