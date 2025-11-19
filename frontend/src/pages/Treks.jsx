import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FloatingNav from '@/components/FloatingNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mountain, Clock, MapPin, ArrowRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Treks = () => {
  const navigate = useNavigate();
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTreks();
  }, []);

  const fetchTreks = async () => {
    try {
      const response = await axios.get(`${API}/treks`);
      setTreks(response.data);
    } catch (error) {
      console.error('Error fetching treks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'challenging': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <FloatingNav />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-stone-100">
        <div className="max-w-7xl mx-auto text-center">
          <Mountain className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-stone-900">
            Explore the Himalayas
          </h1>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto mb-8">
            Fully guided treks through pristine trails, dense forests, and stunning mountain landscapes.
            All treks start from Kalga - your gateway to Parvati Valley adventures.
          </p>
          <Badge className="bg-emerald-600 text-white text-base px-6 py-2">
            ₹5,000 per person - All treks fully supported
          </Badge>
        </div>
      </section>

      {/* Treks Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
              <p className="mt-4 text-stone-600">Loading treks...</p>
            </div>
          ) : (
            <>
              {/* Featured Treks */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-stone-900">Featured Treks</h2>
                <div className="grid lg:grid-cols-2 gap-8">
                  {treks.filter(t => t.featured).map((trek) => (
                    <Card 
                      key={trek.id} 
                      className="overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group cursor-pointer"
                      onClick={() => navigate(`/trek/${trek.id}`)}
                    >
                      <div className="relative h-80 overflow-hidden">
                        <img
                          src={trek.images[0]}
                          alt={trek.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          <Badge className={`${getDifficultyColor(trek.difficulty)} border-2`}>
                            {trek.difficulty}
                          </Badge>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-3xl font-bold mb-3">{trek.name}</h3>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" /> {trek.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mountain className="w-4 h-4" /> {trek.altitude}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" /> {trek.distance}
                            </span>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6 bg-white">
                        <p className="text-stone-600 mb-4 line-clamp-2">{trek.description}</p>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-3xl font-bold text-emerald-600">₹5,000</span>
                            <span className="text-stone-500 text-sm">/person</span>
                          </div>
                          <Button className="bg-emerald-600 hover:bg-emerald-700">
                            View Details
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* All Treks */}
              <div>
                <h2 className="text-3xl font-bold mb-8 text-stone-900">All Treks</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {treks.filter(t => !t.featured).map((trek) => (
                    <Card
                      key={trek.id}
                      className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                      onClick={() => navigate(`/trek/${trek.id}`)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={trek.images[0]}
                          alt={trek.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <Badge className={`absolute top-3 right-3 ${getDifficultyColor(trek.difficulty)} border`}>
                          {trek.difficulty}
                        </Badge>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-xl font-bold mb-2">{trek.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-stone-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {trek.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mountain className="w-3 h-3" /> {trek.altitude}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-emerald-600">₹5,000</span>
                          <Button size="sm" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                            Explore
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Treks;