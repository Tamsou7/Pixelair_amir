
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const Profile = () => {
  const [purchases, setPurchases] = useState([]);
  const [downloadCodes, setDownloadCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    fetchPurchaseHistory();
    fetchDownloadCodes();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
    }
  };

  const fetchDownloadCodes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('download_codes')
        .select(`
          *,
          photos (title, image_url),
          albums (title, cover_image)
        `)
        .eq('user_id', user.id)
        .eq('is_used', false)
        .gte('expires_at', new Date().toISOString());

      if (error) throw error;
      setDownloadCodes(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les codes de téléchargement",
        variant: "destructive",
      });
    }
  };

  const generateDownloadCode = async (purchaseId, type) => {
    try {
      const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Code valable 7 jours

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('download_codes')
        .insert([{
          code,
          [type === 'album' ? 'album_id' : 'photo_id']: purchaseId,
          user_id: user.id,
          expires_at: expiresAt.toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Code généré",
        description: `Votre code de téléchargement : ${code}`,
      });

      fetchDownloadCodes();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le code",
        variant: "destructive",
      });
    }
  };

  const downloadContent = async (code) => {
    try {
      const { data, error } = await supabase
        .from('download_codes')
        .update({ is_used: true })
        .eq('code', code)
        .select(`
          *,
          photos (image_url),
          albums (cover_image)
        `)
        .single();

      if (error) throw error;

      if (data.photos) {
        window.open(data.photos.image_url, '_blank');
      } else if (data.albums) {
        window.open(data.albums.cover_image, '_blank');
      }

      toast({
        title: "Succès",
        description: "Téléchargement démarré",
      });

      fetchDownloadCodes();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le contenu",
        variant: "destructive",
      });
    }
  };

  const fetchPurchaseHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('purchase_history')
        .select(`
          *,
          photos (title, image_url),
          albums (title, cover_image)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPurchases(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des achats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Se déconnecter
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Codes de téléchargement actifs</h2>
          <div className="space-y-4">
            {downloadCodes.map((code) => (
              <motion.div
                key={code.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-mono text-lg">{code.code}</p>
                  <p className="text-sm text-gray-400">
                    Expire le {new Date(code.expires_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  onClick={() => downloadContent(code.code)}
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Télécharger
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Historique des achats</h2>
          {loading ? (
            <p>Chargement...</p>
          ) : purchases.length === 0 ? (
            <p>Aucun achat pour le moment</p>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <motion.div
                  key={purchase.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">
                        {purchase.photos?.title || purchase.albums?.title}
                      </h3>
                      <p className="text-gray-400">
                        {new Date(purchase.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-xl font-bold">{purchase.amount}€</p>
                      <Button
                        onClick={() => generateDownloadCode(
                          purchase.product_id || purchase.album_id,
                          purchase.product_id ? 'photo' : 'album'
                        )}
                        variant="outline"
                      >
                        Générer un code
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
