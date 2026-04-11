import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const StatCard = ({ title, value, icon, iconBg }) => (
  <motion.div 
    whileHover="hover"
    initial="initial"
    variants={{
      initial: { y: 0, scale: 1 },
      hover: { 
        y: -5, 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)"
      }
    }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start cursor-pointer transition-colors hover:border-blue-100"
  >
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <motion.h3 
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.1, originX: 0 }
        }}
        className="text-2xl font-bold text-gray-900"
      >
        {value}
      </motion.h3>
    </div>
    <motion.div 
      variants={{
        initial: { rotate: 0, scale: 1 },
        hover: { rotate: 10, scale: 1.1 }
      }}
      className={cn("p-3 rounded-xl transition-colors", iconBg)}
    >
      {icon}
    </motion.div>
  </motion.div>
);

export default StatCard;
