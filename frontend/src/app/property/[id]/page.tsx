'use client';

import Image from 'next/image';
import { useEffect, useState, use } from 'react';
import { FaImage, FaArrowLeft, FaMapMarkerAlt, FaUser, FaBed, FaBath, FaRuler, FaHome, FaTag } from 'react-icons/fa';

type Property = {
  id: string;
  idOwner: string;
  name: string;
  addressProperty: string;
  priceProperty: number;
  imageUrl: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  propertyType?: string;
  status?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5242';

export default function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  const [item, setItem] = useState<Property | null>(null);
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función para construir la URL de la imagen de forma segura
  const getImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return '';
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith('/')) {
      return imageUrl;
    }
    
    return `/images/${imageUrl}`;
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`${API_URL}/api/properties/${resolvedParams.id}`);
        if (!response.ok) throw new Error('Property not found');
        const data = await response.json();
        setItem(data);
      } catch (err) {
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-slate-400 text-lg">Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-slate-700/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FaHome className="text-slate-500 text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">Propiedad no encontrada</h3>
          <p className="text-slate-500 mb-6">La propiedad que buscas no existe o ha sido eliminada</p>
          <a 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
          >
            <FaArrowLeft className="text-sm" />
            Volver a propiedades
          </a>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(item.imageUrl);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-3 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white rounded-xl transition-all duration-300 backdrop-blur-sm"
          >
            <FaArrowLeft className="text-sm" />
            <span className="font-medium">Volver a propiedades</span>
          </a>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative w-full h-96 lg:h-[500px] bg-slate-700 rounded-2xl overflow-hidden shadow-2xl">
              {!imgError && imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  priority
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FaImage className="text-slate-500 text-8xl" />
                </div>
              )}
              
              {item.status && (
                <div className="absolute top-4 left-4">
                  <div className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded-full shadow-lg">
                    {item.status}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">{item.name}</h1>
                  <div className="flex items-start gap-2 text-slate-400">
                    <FaMapMarkerAlt className="text-indigo-400 mt-1 flex-shrink-0" />
                    <span>{item.addressProperty}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    $ {item.priceProperty.toLocaleString('es-CO')}
                  </p>
                  {item.propertyType && (
                    <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                      <FaTag className="text-indigo-400" />
                      {item.propertyType}
                    </p>
                  )}
                </div>

                {(item.bedrooms || item.bathrooms || item.area) && (
                  <div className="pt-4 border-t border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-3">Características</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {item.bedrooms && (
                        <div className="text-center p-3 bg-slate-700/30 rounded-xl">
                          <FaBed className="text-indigo-400 text-xl mx-auto mb-2" />
                          <p className="text-white font-semibold">{item.bedrooms}</p>
                          <p className="text-xs text-slate-400">Habitaciones</p>
                        </div>
                      )}
                      {item.bathrooms && (
                        <div className="text-center p-3 bg-slate-700/30 rounded-xl">
                          <FaBath className="text-indigo-400 text-xl mx-auto mb-2" />
                          <p className="text-white font-semibold">{item.bathrooms}</p>
                          <p className="text-xs text-slate-400">Baños</p>
                        </div>
                      )}
                      {item.area && (
                        <div className="text-center p-3 bg-slate-700/30 rounded-xl">
                          <FaRuler className="text-indigo-400 text-xl mx-auto mb-2" />
                          <p className="text-white font-semibold">{item.area}</p>
                          <p className="text-xs text-slate-400">m²</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      <FaUser className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Propietario</p>
                      <p className="text-white font-medium">{item.idOwner}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-indigo-500/25">
                    Contactar Propietario
                  </button>
                </div>
              </div>
            </div>

            {item.description && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Descripción</h3>
                <p className="text-slate-300 leading-relaxed">{item.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}