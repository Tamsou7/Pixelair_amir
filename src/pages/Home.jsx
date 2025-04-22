
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover"
            alt="Photographe sportif en action"
           src="https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee" />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Capturez l'Émotion du Sport
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Photographe professionnel spécialisé dans la capture de moments
            sportifs intenses et mémorables
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/gallery")}
              className="bg-white text-black hover:bg-gray-200"
            >
              Voir la Galerie
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/shop")}
            >
              Acheter des Photos
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Featured Work */}
      <section className="py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Travaux en Vedette
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative overflow-hidden rounded-lg"
          >
            <img 
              className="w-full h-64 object-cover"
              alt="Photo de football"
             src="https://images.unsplash.com/photo-1543371734-c219c9829d32" />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative overflow-hidden rounded-lg"
          >
            <img 
              className="w-full h-64 object-cover"
              alt="Photo de basketball"
             src="https://images.unsplash.com/photo-1677031058176-000425075d04" />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative overflow-hidden rounded-lg"
          >
            <img 
              className="w-full h-64 object-cover"
              alt="Photo d'athlétisme"
             src="https://images.unsplash.com/photo-1678656449947-4dc1636d758d" />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
