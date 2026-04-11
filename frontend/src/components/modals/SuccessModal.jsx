import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, message, description, icon: Icon = CheckCircle2, iconColor = "text-green-500", iconBg = "bg-green-50" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-[32px] p-12 shadow-2xl max-w-md w-full text-center space-y-4"
          >
            <div className="flex justify-center">
              <div className={`w-24 h-24 ${iconBg} rounded-full flex items-center justify-center ${iconColor}`}>
                <Icon size={48} strokeWidth={1.5} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">{message}</h3>
              {description && (
                <p className="text-sm text-gray-500 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
