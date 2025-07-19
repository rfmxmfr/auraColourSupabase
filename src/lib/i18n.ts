
'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          services: "Our Services",
          bookNow: "Book Now",
          colorAnalysis: "12-Season Color Analysis",
          virtualWardrobe: "Virtual Wardrobe Curation",
          personalShopping: "Personal Shopping Service",
          styleCoaching: "Style Evolution Coaching",
          giftVouchers: "Gift Vouchers",
          bookYourAnalysis: "Book Your Analysis",
          generateAnalysis: "Generate Analysis",
          dashboard: "Dashboard",
          bookings: "Bookings",
          customers: "Customers",
          analytics: "Analytics",
          settings: "Settings",
          home: "Home",
          about: "About",
          contact: "Contact",
          getStarted: "Get Started",
        },
      },
      es: {
        translation: {
          services: "Nuestros Servicios",
          bookNow: "Reservar Ahora",
          colorAnalysis: "Análisis de Color de 12 Estaciones",
          virtualWardrobe: "Curación de Guardarropa Virtual",
          personalShopping: "Servicio de Compras Personales",
          styleCoaching: "Coaching de Evolución de Estilo",
          giftVouchers: "Vales de Regalo",
          bookYourAnalysis: "Reserva tu Análisis",
          generateAnalysis: "Generar Análisis",
          dashboard: "Panel de Control",
          bookings: "Reservas",
          customers: "Clientes",
          analytics: "Analíticas",
          settings: "Configuración",
          home: "Inicio",
          about: "Sobre Nosotros",
          contact: "Contacto",
          getStarted: "Empezar",
        },
      },
    },
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
