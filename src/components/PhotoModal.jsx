
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const PhotoModal = ({ isOpen, onClose, photo }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-7xl mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
          >
            <X size={24} />
          </button>
          <img
            src={photo?.image_url}
            alt={photo?.title}
            className="max-h-[90vh] w-auto mx-auto object-contain rounded-lg"
          />
          {photo?.title && (
            <p className="text-white text-center mt-4 text-lg">{photo.title}</p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PhotoModal;
