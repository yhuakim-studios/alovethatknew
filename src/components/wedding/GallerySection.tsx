import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Camera, Image, Upload, X, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface WeddingPhoto {
  id: string;
  uploader_name: string;
  file_url: string;
  created_at: string;
}

export default function GallerySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<WeddingPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploaderName, setUploaderName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from("wedding_photos")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPhotos(data);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => {
      if (!f.type.startsWith("image/")) {
        toast.error(`${f.name} is not an image`);
        return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!uploaderName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one photo");
      return;
    }

    setUploading(true);
    let successCount = 0;

    for (const file of selectedFiles) {
      const fileExt = file.name.split(".").pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("wedding-photos")
        .upload(filePath, file);

      if (uploadError) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("wedding-photos")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("wedding_photos").insert({
        uploader_name: uploaderName.trim(),
        file_path: filePath,
        file_url: urlData.publicUrl,
      });

      if (!dbError) successCount++;
    }

    if (successCount > 0) {
      toast.success(`${successCount} photo${successCount > 1 ? "s" : ""} uploaded successfully!`);
      setSelectedFiles([]);
      setShowUploadForm(false);
      setUploaderName("");
      fetchPhotos();
    }
    setUploading(false);
  };

  return (
    <section id="gallery" className="section-padding bg-background" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-script text-3xl gold-text mb-2">Capture every moment</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground font-bold">Share Your Moments</h2>
          <div className="gold-divider mt-6 mb-8" />
          <p className="font-body text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Help us capture every beautiful moment. If you take photos during the celebration, kindly upload them here so we can keep them as part of our wedding memories.
          </p>
        </motion.div>

        {/* Upload Form Modal */}
        {showUploadForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-card p-6 md:p-8 rounded-2xl shadow-lg border border-border text-left max-w-lg mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl text-foreground font-semibold">Upload Photos</h3>
              <button onClick={() => { setShowUploadForm(false); setSelectedFiles([]); }} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-body text-sm text-muted-foreground mb-2 uppercase tracking-wider">Your Name</label>
                <input
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block font-body text-sm text-muted-foreground mb-2 uppercase tracking-wider">Select Photos</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-border rounded-lg hover:border-gold/50 transition-colors flex flex-col items-center gap-2 text-muted-foreground"
                >
                  <Upload size={24} />
                  <span className="font-body text-sm">Click to select photos (max 5MB each)</span>
                </button>
              </div>

              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {selectedFiles.map((file, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden aspect-square">
                      <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 bg-foreground/70 text-background rounded-full p-0.5"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full py-3 bg-gold text-accent-foreground font-body text-sm uppercase tracking-widest rounded-lg hover:bg-gold-light transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                {uploading ? "Uploading..." : "Upload Photos"}
              </button>
            </div>
          </motion.div>
        )}

        {/* Gallery Grid */}
        {showGallery && photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl overflow-hidden aspect-square relative group"
              >
                <img src={photo.file_url} alt={`by ${photo.uploader_name}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-end">
                  <p className="text-background font-body text-xs p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    📸 {photo.uploader_name}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {showGallery && photos.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`rounded-xl bg-muted border border-border overflow-hidden ${i === 0 ? "row-span-2" : ""}`}>
                  <div className={`flex items-center justify-center ${i === 0 ? "h-full min-h-[200px]" : "h-40 md:h-48"}`}>
                    <Image className="text-muted-foreground/30" size={32} />
                  </div>
                </div>
              ))}
            </div>
            <p className="font-body text-muted-foreground mt-4 text-sm">No photos yet. Be the first to share!</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-10 flex justify-center gap-4 flex-wrap"
        >
          <button
            onClick={() => { setShowUploadForm(true); setShowGallery(false); }}
            className="px-8 py-3 bg-gold text-accent-foreground font-body text-sm uppercase tracking-widest rounded-full hover:bg-gold-light transition-colors flex items-center gap-2"
          >
            <Camera size={16} />
            Upload Photos
          </button>
          <button
            onClick={() => { setShowGallery(!showGallery); setShowUploadForm(false); }}
            className="px-8 py-3 border border-gold/50 text-foreground font-body text-sm uppercase tracking-widest rounded-full hover:bg-gold/10 transition-colors flex items-center gap-2"
          >
            <Image size={16} />
            {showGallery ? "Hide Gallery" : "View Gallery"}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
