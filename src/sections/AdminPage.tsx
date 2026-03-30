import { X } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";
import { BTN_SOLID } from "../constants";
import type { DBImage } from "../types";
import { listImages, removeImage, saveImage } from "@/lib/images-client";

export const AdminPage = () => {
  const [images, setImages] = useState<DBImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState("general");
  const [alt, setAlt] = useState("");
  const [editingImage, setEditingImage] = useState<DBImage | null>(null);

  const fetchImages = async () => {
    setImages(await listImages());
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const resetForm = () => {
    setSelectedFile(null);
    setCategory("general");
    setAlt("");
    setEditingImage(null);
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    setUploading(true);
    const ok = await saveImage({
      id: editingImage?.id,
      file: selectedFile,
      category,
      alt,
    });
    if (ok) {
      resetForm();
      fetchImages();
    }
    setUploading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this image?")) return;
    const ok = await removeImage(id);
    if (ok) fetchImages();
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 pt-32 pb-20 md:px-10">
      <h1 className="heading-display text-ink mb-10 text-4xl">
        Image Management
      </h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="border-gold/20 h-fit border bg-white p-8 lg:col-span-1">
          <h2 className="mb-6 text-lg font-semibold">
            {editingImage ? "Edit Image" : "Upload New Image"}
          </h2>
          {editingImage && (
            <div className="border-gold/20 mb-4 aspect-video overflow-hidden border">
              <img
                src={editingImage.url}
                alt={editingImage.alt}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <label className="label-caps">
                File {editingImage && "(optional)"}
              </label>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full text-sm"
                accept="image/*"
              />
            </div>
            <div className="space-y-2">
              <label className="label-caps">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border-gold/20 focus:border-gold w-full border-b bg-transparent py-2 outline-none"
              >
                <option value="hero">Hero Section</option>
                <option value="residence">Gallery: TS Residence</option>
                <option value="suites">Gallery: TS Suites</option>
                <option value="social">Gallery: TS Social Club</option>
                <option value="wellness">Gallery: No.1 Wellness Club</option>
                <option value="offers">Offers</option>
                <option value="solo">Apartment: SOLO</option>
                <option value="studio">Apartment: STUDIO</option>
                <option value="soho">Apartment: SOHO</option>
                <option value="apartments">Apartments (Other)</option>
                <option value="general">General</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="label-caps">Alt Text / Title</label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Describe the image"
                className="border-gold/20 focus:border-gold w-full border-b bg-transparent py-2 text-sm outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={uploading || (!selectedFile && !editingImage)}
                className={`${BTN_SOLID} flex-1 disabled:opacity-50`}
              >
                {uploading ? "Saving..." : editingImage ? "Update" : "Upload"}
              </button>
              {editingImage && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="border-gold/20 hover:bg-cream border px-4 py-3 text-sm transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">
            Stored Images ({images.length})
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => {
                  setEditingImage(img);
                  setCategory(img.category);
                  setAlt(img.alt);
                  setSelectedFile(null);
                }}
                className="group border-gold/20 bg-cream hover:ring-gold relative aspect-square cursor-pointer overflow-hidden border transition-all hover:ring-2"
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="label-caps mb-1 text-white">{img.category}</p>
                  <p className="mb-3 text-[9px] text-white/60">Click to edit</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(img.id);
                    }}
                    className="rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
