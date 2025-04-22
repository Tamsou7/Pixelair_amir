
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import PhotoModal from "@/components/PhotoModal";

const Gallery = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const { data: albumsData, error: albumsError } = await supabase
        .from('albums')
        .select(`
          *,
          photos (*)
        `);

      if (albumsError) throw albumsError;

      setAlbums(albumsData || []);
    } catch (error) {
      console.error('Erreur lors du chargement des albums:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les albums",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center mb-12">Galerie Photo</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-16">
            {albums.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <p>Aucun album n'a été créé pour le moment.</p>
              </div>
            ) : (
              albums.map((album) => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold text-white/90 border-b border-white/10 pb-4">
                    {album.title}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {album.photos && album.photos.map((photo) => (
                      <motion.div
                        key={photo.id}
                        whileHover={{ scale: 1.05 }}
                        className="relative group cursor-pointer"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <img 
                          src={photo.image_url}
                          alt={photo.title}
                          className="w-full h-80 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
                          <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-4">
                            {photo.description || photo.title}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </motion.div>

      <PhotoModal
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        photo={selectedPhoto}
      />
    </div>
  );
};

export default Gallery;
