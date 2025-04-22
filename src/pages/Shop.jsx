
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Shop = () => {
  const { toast } = useToast();

  const products = [
    {
      id: 1,
      title: "Match de Football",
      price: "29.99",
      description: "Photo haute résolution d'un moment clé du match",
    },
    {
      id: 2,
      title: "Course d'Athlétisme",
      price: "24.99",
      description: "Sprint final capturé en haute qualité",
    },
    {
      id: 3,
      title: "Album Complet - Tournoi",
      price: "99.99",
      description: "Collection complète des meilleurs moments",
    },
  ];

  const handlePayPalApprove = (data, actions) => {
    return actions.order.capture().then(function(details) {
      toast({
        title: "Paiement réussi!",
        description: `Merci pour votre achat ${details.payer.name.given_name}!`,
        duration: 5000,
      });
    });
  };

  return (
    <PayPalScriptProvider options={{ 
      "client-id": "YOUR_PAYPAL_CLIENT_ID",
      currency: "EUR" 
    }}>
      <div className="min-h-screen pt-20 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-center mb-12">Boutique Photo</h1>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 rounded-lg overflow-hidden"
              >
                <img 
                  className="w-full h-48 object-cover"
                  alt={product.title}
                  src="https://images.unsplash.com/photo-1559223669-e0065fa7f142" 
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                  <p className="text-gray-400 mb-4">{product.description}</p>
                  <div className="flex flex-col gap-4">
                    <span className="text-2xl font-bold">{product.price}€</span>
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: product.price,
                                currency_code: "EUR"
                              },
                              description: product.title
                            }
                          ]
                        });
                      }}
                      onApprove={handlePayPalApprove}
                      style={{ layout: "horizontal" }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </PayPalScriptProvider>
  );
};

export default Shop;
