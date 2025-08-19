'use client';

import Image from 'next/image';
import { useEffect, useState, use } from 'react';
import { FaImage, FaArrowLeft } from 'react-icons/fa';

type Property = {
  id: string;
  idOwner: string;
  name: string;
  addressProperty: string;
  priceProperty: number;
  imageUrl: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5242';

export default function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  const [item, setItem] = useState<Property | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/properties/${resolvedParams.id}`)
      .then(r => r.json())
      .then(setItem)
      .catch(err => console.error(err));
  }, [resolvedParams.id]);

  if (!item) return <p>Cargando...</p>;

  return (
    <div className="space-y-4">
      {/* Botón de regreso */}
      <a 
        href="/"
        className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        <FaArrowLeft className="text-sm" />
        <span>Volver a propiedades</span>
      </a>

      <div className="card">
        <div className="relative w-full h-64 mb-4 flex items-center justify-center bg-gray-800 rounded-xl overflow-hidden">
          {!imgError ? (
            <Image
              src={item.imageUrl.startsWith('/') ? item.imageUrl : `/images/${item.imageUrl}`}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              onError={() => setImgError(true)}
            />
          ) : (
            <FaImage className="text-gray-400 text-6xl" />
          )}
        </div>

        <h1 className="text-xl font-semibold mb-2">{item.name}</h1>
        <p className="text-slate-300 mb-2">{item.addressProperty}</p>
        <p className="text-indigo-300 font-semibold">$ {item.priceProperty.toLocaleString('es-CO')}</p>
        <p className="text-sm text-slate-400 mt-4">Propietario: {item.idOwner}</p>
      </div>
    </div>
  );
}