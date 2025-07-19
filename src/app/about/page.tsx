
'use client';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 text-gray-800">
      <Header />

      <section className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Aura Colours
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Where Spanish passion meets Scottish precision - A colorful journey across cultures
          </motion.p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            className="relative bg-white/20 backdrop-blur-xl rounded-3xl shadow-lg overflow-hidden mb-16 border border-white/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-64 md:h-80">
              <Image 
                src="https://placehold.co/1200x320.png"
                alt="Barcelona landscape"
                layout="fill"
                objectFit="cover"
                data-ai-hint="fashion studio"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-lg">The Art and Science of Personal Style</h2>
                <p className="text-lg text-white/90 drop-shadow-md">Discover your perfect color palette with expert analysis</p>
              </div>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Meet Tania</h2>
              <div className="text-sm text-purple-600 mb-2 font-semibold">Barcelona → Glasgow</div>
              <div className="text-sm text-gray-500 mb-6">Fashion Design & Business</div>
              <p className="text-gray-600 leading-relaxed mb-6">Aura was created by Tania Hernando Crespo, a Barcelona-born fashion expert with a degree in Fashion Design, Business, and Marketing.</p>
              <p className="text-gray-600 leading-relaxed">Tania's career bridges the creative vibrancy of Barcelona and the contemporary style of Glasgow. Her unique background allows her to blend Mediterranean artistry with British sophistication, resulting in a service that is both globally relevant and deeply personal.</p>
            </motion.div>
            <motion.div 
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="w-80 h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl overflow-hidden shadow-lg">
                <Image 
                  src="/tania-hernando-crespo.jpeg" 
                  alt="Tania Hernando Crespo"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 text-center shadow-lg border border-white/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Explore Our Services</h2>
            <p className="text-gray-600 mb-8">Discover how we can transform your personal style</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/services" className="py-4 px-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all duration-200">
                View My Services
              </a>
              <a href="/questionnaire" className="py-4 px-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold transition-all duration-200">
                Start Analysis
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
