
'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Facebook, Instagram } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-block">
              <Logo className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent" />
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              Discover the colors that make you look effortlessly radiant with our professional color analysis.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('services')}</h3>
            <ul className="space-y-3">
              <li><Link href="/services/color-analysis" className="text-gray-400 hover:text-white transition-colors duration-200">{t('colorAnalysis')}</Link></li>
              <li><Link href="/services/wardrobe-curation" className="text-gray-400 hover:text-white transition-colors duration-200">{t('virtualWardrobe')}</Link></li>
              <li><Link href="/services/personal-shopping" className="text-gray-400 hover:text-white transition-colors duration-200">{t('personalShopping')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-200">{t('about')}</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">{t('contact')}</Link></li>
               <li><Link href="/admin/dashboard" className="text-gray-400 hover:text-white transition-colors duration-200">Admin</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2024 Aura Colours. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <a href="#" className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </a>
            <a href="#" className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg">
              <Facebook className="w-6 h-6 text-white" />
            </a>
            <a href="#" className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg">
              <Instagram className="w-6 h-6 text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
