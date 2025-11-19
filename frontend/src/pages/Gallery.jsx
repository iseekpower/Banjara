import { useState, useEffect } from 'react';
import axios from 'axios';
import FloatingNav from '@/components/FloatingNav';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await axios.get(`${API}/gallery`);
      setGallery(response.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <FloatingNav />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-stone-100">
        <div className="max-w-7xl mx-auto text-center">
          <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-6" />
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-stone-900">
            Life at Barracks
          </h1>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Moments captured, memories created. Experience the magic of mountain life,
            music nights, bonfire gatherings, and authentic Himalayan hospitality.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
              <p className="mt-4 text-stone-600">Loading gallery...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {gallery.map((image, index) => (
                <div
                  key={image.id}
                  className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group ${
                    index === 0 ? 'md:col-span-2 md:row-span-2 h-96' : 'h-64'
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-1">{image.title}</h3>
                      {image.description && (
                        <p className="text-sm opacity-90">{image.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Gallery;