'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { FaImage, FaHome } from 'react-icons/fa';

type Property = {
  id: string;
  idOwner: string;
  name: string;
  addressProperty: string;
  priceProperty: number;
  imageUrl: string;
};

type ApiResponse = {
  total: number;
  page: number;
  pageSize: number;
  data: Property[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5242';

export default function HomePage() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Property[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (propertyId: string) => {
    setImageErrors(prev => new Set([...prev, propertyId]));
  };

  // Función para construir la URL de la imagen de forma segura
  const getImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return '';
    
    // Si ya es una URL completa, la devolvemos tal como está
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Si comienza con slash, es una ruta absoluta
    if (imageUrl.startsWith('/')) {
      return imageUrl;
    }
    
    // Si no, la tratamos como un archivo en la carpeta images
    return `/images/${imageUrl}`;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (name) params.set('name', name);
    if (address) params.set('address', address);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    params.set('page', '1');
    params.set('pageSize', '24');

    try {
      const res = await fetch(`${API_URL}/api/properties?${params.toString()}`);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const json: ApiResponse = await res.json();
      setItems(json.data);
      // Reset image errors when new data loads
      setImageErrors(new Set());
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [name, address, minPrice, maxPrice]);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header con icono */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-indigo-600 rounded-full shadow-lg">
              <FaHome className="text-2xl text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Propiedades
            </h1>
          </div>
          <p className="text-slate-400 text-lg">Encuentra la propiedad perfecta para ti</p>
        </div>

        {/* Filtros mejorados */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Nombre</label>
              <input 
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                placeholder="Buscar por nombre..." 
                value={name} 
                onChange={e => setName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Dirección</label>
              <input 
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                placeholder="Buscar por dirección..." 
                value={address} 
                onChange={e => setAddress(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Precio mínimo</label>
              <input 
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                placeholder="$ 0" 
                value={minPrice} 
                onChange={e => setMinPrice(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Precio máximo</label>
              <input 
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                placeholder="$ Sin límite" 
                value={maxPrice} 
                onChange={e => setMaxPrice(e.target.value)} 
              />
            </div>
          </div>
          <button 
            onClick={fetchData} 
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Buscando...
              </div>
            ) : (
              'Buscar Propiedades'
            )}
          </button>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 text-lg">Cargando propiedades...</p>
          </div>
        ) : (
          <>
            {/* Contador de resultados */}
            <div className="text-slate-400 text-sm">
              {items.length} {items.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
            </div>
            
            {/* Grid de propiedades */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map(p => {
                const imageUrl = getImageUrl(p.imageUrl);
                return (
                  <a 
                    key={p.id} 
                    href={`/property/${p.id}`} 
                    className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-indigo-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/10"
                  >
                    <div className="relative h-48 w-full bg-slate-700 overflow-hidden">
                      {!imageErrors.has(p.id) && imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={p.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          onError={() => handleImageError(p.id)}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <FaImage className="text-slate-500 text-4xl" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-5 space-y-3">
                      <h3 className="font-semibold text-lg text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                        {p.name}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-2 flex items-start gap-2">
                        <span className="text-slate-500 mt-0.5">📍</span>
                        {p.addressProperty}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                          $ {p.priceProperty.toLocaleString('es-CO')}
                        </p>
                        <div className="px-3 py-1 bg-indigo-600/20 text-indigo-300 text-xs font-medium rounded-full">
                          Ver detalles
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Mensaje cuando no hay resultados */}
            {items.length === 0 && (
              <div className="text-center py-16">
                <div className="p-4 bg-slate-700/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FaHome className="text-slate-500 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No se encontraron propiedades</h3>
                <p className="text-slate-500">Intenta ajustar tus filtros de búsqueda</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}