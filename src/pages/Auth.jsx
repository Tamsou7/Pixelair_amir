
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Le mot de passe doit contenir au moins 6 caractères";
    }
    return null;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Veuillez entrer une adresse email valide";
    }
    return null;
  };

  const createProfile = async (userId) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert([{ id: userId, full_name: fullName }]);
      
      if (error) throw error;
    } catch (error) {
      console.error("Erreur lors de la création du profil:", error.message);
      throw error;
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      const emailError = validateEmail(email);
      if (emailError) {
        toast({
          title: "Erreur",
          description: emailError,
          variant: "destructive",
        });
        return;
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        toast({
          title: "Erreur",
          description: passwordError,
          variant: "destructive",
        });
        return;
      }

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + '/profile'
          }
        });

        if (error) throw error;

        if (data?.user) {
          await createProfile(data.user.id);
          toast({
            title: "Inscription réussie",
            description: "Vérifiez votre email pour confirmer votre compte. Vous allez recevoir un email de confirmation.",
          });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre compte",
        });
        navigate('/profile');
      }
    } catch (error) {
      let errorMessage = "Une erreur est survenue";
      
      if (error.message.includes("Email not confirmed")) {
        errorMessage = "Veuillez confirmer votre email avant de vous connecter";
      } else if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email ou mot de passe incorrect";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "Un compte existe déjà avec cet email";
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-gray-800 rounded-lg p-8"
      >
        <h1 className="text-3xl font-bold mb-8 text-center">
          {isSignUp ? 'Créer un compte' : 'Connexion'}
        </h1>

        <form onSubmit={handleAuth} className="space-y-6">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium mb-2">Nom complet</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                required={isSignUp}
                placeholder="Votre nom complet"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
              placeholder="Minimum 6 caractères"
              minLength={6}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            disabled={loading}
          >
            {loading ? 'Chargement...' : (isSignUp ? 'S\'inscrire' : 'Se connecter')}
          </Button>
        </form>

        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setEmail('');
            setPassword('');
            setFullName('');
          }}
          className="mt-4 text-sm text-gray-400 hover:text-white block mx-auto"
        >
          {isSignUp ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire'}
        </button>
      </motion.div>
    </div>
  );
};

export default Auth;
