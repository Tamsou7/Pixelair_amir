
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Instagram } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais.",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-center mb-12">Contact</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nom</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-white h-32"
              required
            ></textarea>
          </div>

          <Button type="submit" className="w-full">
            Envoyer
          </Button>
        </form>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Informations de Contact</h2>
          <p className="text-gray-400">
            Email: contact@photosport.com
            <br />
            Téléphone: +33 1 23 45 67 89
            <br />
            Adresse: Paris, France
          </p>
          
          <div className="mt-6">
            <a
              href="https://www.instagram.com/amir.ssr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Instagram size={24} />
              <span>Suivez-moi sur Instagram</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
