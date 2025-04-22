
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import AdminAuth from '@/components/AdminAuth';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [albums, setAlbums] = useState([]);
  const [newAlbum, setNewAlbum] = useState({ title: '', description: '', price: '' });
  const [uploading, setUploading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const isAdminAuth = localStorage.getItem('isAdminAuthenticated') === 'true';
    setIsAuthenticated(isAdminAuth);
    if (isAdminAuth) {
      fetchAlbums();
    }
  };

  const fetchAlbums = async () => {
    try {
      const { data, error } = await supabase
        .from('albums')
        .select('*, photos(*)');
      
      if (error) throw error;
      setAlbums(data || []);
    } catch (error) {
      console.error('Erreur de chargement des albums:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les albums",
        variant: "destructive",
      });
    }
  };

  const createAlbum = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('albums')
        .insert([{
          title: newAlbum.title,
          description: newAlbum.description,
          price: parseFloat(newAlbum.price) || 0
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Album créé avec succès",
      });

      setNewAlbum({ title: '', description: '', price: '' });
      fetchAlbums();
    } catch (error) {
      console.error('Erreur de création d\'album:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'album",
        variant: "destructive",
      });
    }
  };

  const uploadPhoto = async (e, albumId) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) {
        toast({
          title: "Erreur",
          description: "Aucun fichier sélectionné",
          variant: "destructive",
        });
        return;
      }

      // Créer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      // Upload du fichier dans le bucket
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      // Insérer dans la table photos
      const { error: dbError } = await supabase
        .from('photos')
        .insert([{
          title: file.name,
          image_url: publicUrl,
          album_id: albumId
        }]);

      if (dbError) throw dbError;

      toast({
        title: "Succès",
        description: "Photo ajoutée avec succès",
      });
      
      await fetchAlbums();
    } catch (error) {
      console.error('Erreur d\'upload:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'uploader la photo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté de l'espace administrateur",
    });
    navigate('/');
  };

  if (!isAuthenticated) {
    return <AdminAuth onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Administration</h1>
          <Button 
            onClick={handleLogout}
            variant="destructive"
          >
            Déconnexion
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Créer un nouvel album</h2>
          <form onSubmit={createAlbum} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titre de l'album</label>
              <input
                type="text"
                value={newAlbum.title}
                onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={newAlbum.description}
                onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Prix (€)</label>
              <input
                type="number"
                value={newAlbum.price}
                onChange={(e) => setNewAlbum({ ...newAlbum, price: e.target.value })}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                step="0.01"
              />
            </div>
            <Button type="submit">Créer l'album</Button>
          </form>
        </motion.div>

        <div className="space-y-6">
          {albums.map((album) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{album.title}</h3>
                  <p className="text-gray-400">{album.description}</p>
                  <p className="text-sm mt-1">Prix: {album.price}€</p>
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => uploadPhoto(e, album.id)}
                    className="hidden"
                    id={`photo-upload-${album.id}`}
                    disabled={uploading}
                  />
                  <label
                    htmlFor={`photo-upload-${album.id}`}
                    className={`cursor-pointer inline-flex items-center px-4 py-2 rounded-md ${
                      uploading 
                        ? 'bg-gray-600' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } transition-colors duration-200`}
                  >
                    {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {uploading ? 'Upload en cours...' : 'Ajouter une photo'}
                  </label>
                </div>
              </div>

              {album.photos && album.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {album.photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.image_url}
                        alt={photo.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
                        <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-2">
                          {photo.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
