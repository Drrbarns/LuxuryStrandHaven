'use client';

import { motion } from 'framer-motion';

interface PageHeroProps {
    title: string;
    subtitle?: string;
    /** Optional hero background image (e.g. /hero8.jpeg) */
    backgroundImage?: string;
}

export default function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
    return (
        <div className="relative bg-gray-900 overflow-hidden">
            <motion.div 
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: backgroundImage ? 0.25 : 0.2, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0"
            >
                {backgroundImage ? (
                    <>
                        <img src={backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gray-900/70" aria-hidden />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                )}
            </motion.div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl md:text-6xl font-bold text-white mb-6"
                >
                    {title}
                </motion.h1>
                
                {subtitle && (
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>
        </div>
    );
}
