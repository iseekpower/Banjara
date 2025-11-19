import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Mountain, ChefHat, MapPin, Calendar, Clock, Users, ExternalLink,
  Menu as MenuIcon, X, Heart, ArrowRight, Star, Sparkles, TrendingUp, MessageCircle, Send
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const AIRBNB_URL = 'https://www.airbnb.co.in/rooms/51261620?source_impression_id=p3_1762452247_P3PmxG8ksmAwf3Rz';

const HomeNew = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [treks, setTreks] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const explorePlaces = [
    { name: 'Kheerganga Trek', distance: '12 km', time: '4-5 hours', description: 'Famous hot springs and scenic trek through pine forests', slug: 'kheerganga-trek' },
    { name: 'Pulga Village', distance: '3 km', time: '1 hour', description: 'Quaint village with apple orchards and waterfalls', slug: 'pulga-village' },
    { name: 'Tosh Village', distance: '8 km', time: '2 hours', description: 'Popular village with cafes and mountain views', slug: 'tosh-village' },
    { name: 'Fairy Forest', distance: '2 km', time: '45 mins', description: 'Hidden caves and perfect for camping under stars', slug: 'fairy-forest' },
    { name: 'Manikaran', distance: '18 km', time: 'Day trip', description: 'Sacred hot springs and Gurudwara', slug: 'manikaran' },
    { name: 'Kasol', distance: '16 km', time: 'Day trip', description: 'Vibrant town along Parvati River', slug: 'kasol' },
    { name: 'Bunbuni Pass', distance: '10 km', time: '5-6 hours', description: 'Moderate trek with panoramic valley views', slug: 'bunbuni-pass' },
    { name: 'Sar Pass', distance: '15 km', time: 'Multi-day', description: 'Challenging high-altitude trek through snow', slug: 'sar-pass' }
  ];

  const [rules, setRules] = useState([]);

  const heroSlides = [
    {
      image: 'https://a0.muscache.com/im/pictures/miso/Hosting-51261620/original/f60a8ab7-fea0-44cd-b119-18460ca3de38.jpeg?im_w=1920',
      title: 'Guided Himalayan Treks',
      subtitle: 'Explore pristine trails with expert guides',
      cta: 'Explore Treks',
      link: '#treks',
      icon: Mountain
    },
    {
      image: 'https://images.unsplash.com/photo-1611875371292-a2bbee7c496b?w=1920&q=80',
      title: 'Hemu\'s Kitchen',
      subtitle: 'Delicious home-cooked meals from local to continental',
      cta: 'Order Food',
      link: '/food',
      icon: ChefHat
    },
    {
      image: 'https://a0.muscache.com/im/pictures/miso/Hosting-51261620/original/10a98b24-1a16-42c9-b063-d60992c041ec.jpeg?im_w=1920',
      title: 'Cozy Mountain Stay',
      subtitle: 'Beautiful rooms with breathtaking valley views',
      cta: 'Book Your Stay',
      link: AIRBNB_URL,
      icon: Heart,
      external: true
    }
  ];

  useEffect(() => {
    fetchTreks();
    fetchGallery();
    fetchFAQs();
    fetchRules();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchTreks = async () => {
    try {
      const response = await axios.get(`${API}/treks`);
      setTreks(response.data);
    } catch (error) {
      console.error('Error fetching treks:', error);
    }
  };

  const fetchGallery = async () => {
    try {
      const response = await axios.get(`${API}/gallery`);
      setGallery(response.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const fetchFAQs = async () => {
    try {
      const response = await axios.get(`${API}/faqs`);
      setFaqs(response.data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);


  const fetchRules = async () => {
    try {
      const response = await axios.get(`${API}/rules`);
      setRules(response.data);
    } catch (error) {
      console.error('Error fetching rules:', error);
    }
  };

    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await axios.post(`${API}/chat/ai-assistant`, {
        session_id: sessionId,
        message: chatInput
      });
      const assistantMessage = { role: 'assistant', content: response.data.response };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to get response. Please try again.');
    } finally {
      setChatLoading(false);
    }
  };


  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleCTAClick = (slide) => {
    if (slide.external) {
      window.open(slide.link, '_blank');
    } else if (slide.link.startsWith('#')) {
      scrollToSection(slide.link.substring(1));
    } else {
      navigate(slide.link);
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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm" data-testid="main-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-stone-900">
              Banjara Barracks
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('treks')} className="text-stone-700 hover:text-emerald-600 transition-colors font-medium">
                Treks
              </button>
              <Link to="/food" className="text-stone-700 hover:text-emerald-600 transition-colors font-medium">
                Food
              </Link>
              <button onClick={() => scrollToSection('life-at-barracks')} className="text-stone-700 hover:text-emerald-600 transition-colors font-medium">
                Life at Barracks
              </button>
              <button onClick={() => scrollToSection('ai-planner')} className="text-stone-700 hover:text-emerald-600 transition-colors font-medium">
                AI Planner
              </button>
              <Button
                onClick={() => window.open(AIRBNB_URL, '_blank')}
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                Book Stay
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-stone-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-3 space-y-3">
              <button onClick={() => scrollToSection('treks')} className="block w-full text-left text-stone-700 hover:text-emerald-600 font-medium">
                Treks
              </button>
              <Link to="/food" className="block w-full text-left text-stone-700 hover:text-emerald-600 font-medium">
                Food
              </Link>
              <button onClick={() => scrollToSection('life-at-barracks')} className="block w-full text-left text-stone-700 hover:text-emerald-600 font-medium">
                Life at Barracks
              </button>
              <button onClick={() => scrollToSection('ai-planner')} className="block w-full text-left text-stone-700 hover:text-emerald-600 font-medium">
                AI Planner
              </button>
              <Button
                onClick={() => window.open(AIRBNB_URL, '_blank')}
                className="w-full"
                variant="outline"
              >
                Book Stay
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Slider */}
      <section className="relative h-screen mt-16 overflow-hidden" data-testid="hero-section">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
            </div>
            <div className="relative z-10 h-full flex items-center justify-center px-4">
              <div className="text-center text-white max-w-4xl">
                <slide.icon className="w-16 h-16 mx-auto mb-6 animate-bounce" />
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl sm:text-2xl mb-8 opacity-90">
                  {slide.subtitle}
                </p>
                <Button
                  size="lg"
                  onClick={() => handleCTAClick(slide)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-12 py-7 rounded-full shadow-2xl"
                >
                  {slide.cta}
                  {slide.external ? <ExternalLink className="ml-2 w-5 h-5" /> : <ArrowRight className="ml-2 w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === index ? 'w-12 bg-white' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Quick Services */}
      <section className="py-16 px-4 bg-white relative -mt-20 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardContent className="pt-6">
                <Mountain className="w-12 h-12 text-emerald-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Guided Treks</h3>
                <p className="text-stone-600 mb-4">₹5,000 per person - All treks fully supported</p>
                <Button
                  onClick={() => scrollToSection('treks')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  View All Treks
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-amber-50">
              <CardContent className="pt-6">
                <ChefHat className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Hemu's Kitchen</h3>
                <p className="text-stone-600 mb-4">Order delicious food to your room or anywhere in Kalga</p>
                <Link to="/food">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Order Food
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="pt-6">
                <Heart className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Cozy Rooms</h3>
                <p className="text-stone-600 mb-4">Beautiful valley views, apple orchards, mountain peaks</p>
                <Button
                  onClick={() => window.open(AIRBNB_URL, '_blank')}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Book on Airbnb
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Treks Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-stone-100 via-emerald-50 to-teal-50" id="treks" data-testid="treks-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-emerald-600 text-white mb-4 text-sm px-4 py-2">
              <Mountain className="w-4 h-4 mr-2 inline" />
              ADVENTURE AWAITS
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-stone-900">
              Explore the Himalayas
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Fully guided treks through pristine trails, dense forests, and stunning mountain landscapes.
              All treks start from Kalga - your gateway to Parvati Valley adventures.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {treks.filter(t => t.featured).map((trek) => (
              <Card 
                key={trek.id} 
                className="overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group cursor-pointer"
                onClick={() => navigate(`/trek/${trek.id}`)}
                data-testid={`trek-${trek.id}`}
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
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-semibold">FEATURED TREK</span>
                    </div>
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
                    <Button className="bg-emerald-600 hover:bg-emerald-700 group-hover:bg-emerald-700">
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* All Treks Grid */}
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
      </section>

      {/* Life at Barracks Gallery */}
      {gallery.length > 0 && (
        <section className="py-20 px-4 bg-white" id="life-at-barracks" data-testid="life-section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="bg-purple-600 text-white mb-4 text-sm px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2 inline" />
                MEMORIES
              </Badge>
              <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-stone-900">
                Life at Barracks
              </h2>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto">
                Moments captured, memories created. Experience the magic of mountain life,
                music nights, bonfire gatherings, and authentic Himalayan hospitality.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {gallery.slice(0, 6).map((image, index) => (
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
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6TTI0IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek00OCAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <TrendingUp className="w-16 h-16 mx-auto mb-6 animate-bounce" />


      {/* Explore Parvati Valley */}
      <section className="py-20 px-4 bg-stone-100" id="explore" data-testid="explore-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <MapPin className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-stone-900">
              Explore Parvati Valley
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Kalga is your gateway to discovering the hidden gems of Parvati Valley in Kullu District
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {explorePlaces.map((place, index) => (
              <Link key={index} to={`/blog/${place.slug}`}>
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white cursor-pointer h-full" data-testid={`explore-place-${index}`}>
                  <CardHeader>
                    <CardTitle className="text-xl">{place.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {place.distance} · {place.time}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-stone-600">{place.description}</p>
                    <p className="text-xs text-emerald-600 mt-3 font-semibold">Read Complete Guide →</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Trip Planner Section */}
      <section className="py-20 px-4 bg-white" id="ai-planner" data-testid="ai-planner-section">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-xl" data-testid="ai-assistant-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <MessageCircle className="w-7 h-7 text-emerald-600" />
                AI Trip Planning Assistant
              </CardTitle>
              <CardDescription className="text-base">
                Get personalized recommendations for your Parvati Valley adventure. Our AI assistant helps you plan the perfect trip based on your preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setChatOpen(true)}
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full text-lg py-6"
                data-testid="open-ai-chat-btn"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Planning Your Trip with AI
              </Button>
              <p className="text-sm text-stone-600 text-center mt-4">
                Ask about trip duration, activities, weather, trekking routes, and get instant recommendations
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* AI Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col" data-testid="ai-chat-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <MessageCircle className="w-6 h-6 text-emerald-600" />
              AI Trip Planning Assistant
            </DialogTitle>
            <DialogDescription className="text-base">
              Ask about your trip duration, activities, weather preferences, trekking routes, and get personalized recommendations with tentative costing
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-stone-50 rounded-lg" data-testid="chat-messages">
            {chatMessages.length === 0 && (
              <div className="text-center text-stone-500 mt-8">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
                <p className="text-base font-semibold mb-2">Welcome to Banjara Barracks Trip Planner!</p>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  I can help you plan your perfect Parvati Valley getaway. Ask me about:
                </p>
                <div className="grid grid-cols-2 gap-3 mt-4 max-w-lg mx-auto">
                  <div className="bg-white p-3 rounded-lg shadow-sm text-left">
                    <p className="text-xs font-semibold text-emerald-700">Trip Duration</p>
                    <p className="text-xs text-stone-600">How many days to stay</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm text-left">
                    <p className="text-xs font-semibold text-emerald-700">Weather & Season</p>
                    <p className="text-xs text-stone-600">Best time to visit</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm text-left">
                    <p className="text-xs font-semibold text-emerald-700">Trekking Routes</p>
                    <p className="text-xs text-stone-600">Recommended treks</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm text-left">
                    <p className="text-xs font-semibold text-emerald-700">Budget Planning</p>
                    <p className="text-xs text-stone-600">Tentative costs</p>
                  </div>
                </div>
              </div>
            )}
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                data-testid={`chat-message-${index}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-xl ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white text-stone-900 rounded-bl-none shadow-md border border-stone-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-xl shadow-md border border-stone-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="e.g., I'm planning a 4-day trip in May, what should I do?"
              disabled={chatLoading}
              className="flex-1"
              data-testid="chat-input"
            />
            <Button type="submit" disabled={chatLoading || !chatInput.trim()} className="bg-emerald-600 hover:bg-emerald-700" data-testid="send-chat-btn">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready for Your Himalayan Adventure?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Experience the magic of Parvati Valley with guided treks, delicious food,
            and warm hospitality at Banjara Barracks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => scrollToSection('treks')}
              className="bg-white text-emerald-700 hover:bg-stone-100 text-lg px-10 py-7 shadow-xl"
            >
              Book a Trek
            </Button>
            <Button
              size="lg"
              onClick={() => window.open(AIRBNB_URL, '_blank')}
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/20 text-lg px-10 py-7"
            >
              Book Your Stay
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 px-4 bg-white" id="faq" data-testid="faq-section">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <HelpCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-stone-900">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-stone-600">
              Everything you need to know about staying at Banjara Barracks
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-2 hover:border-emerald-200 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl text-emerald-700">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-700 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* House Rules Section */}
      <section className="py-20 px-4 bg-stone-50" id="rules" data-testid="rules-section">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-stone-900">
              House Rules
            </h2>
            <p className="text-lg text-stone-600">
              Simple guidelines to ensure a pleasant stay for everyone
            </p>
          </div>
          <Card className="border-2 border-emerald-200">
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <p className="text-stone-700 text-lg pt-1">{rule.rule}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Banjara Barracks</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                Your gateway to Parvati Valley adventures. Guided treks, delicious food,
                and cozy mountain stays in the heart of Kalga.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <button onClick={() => scrollToSection('treks')} className="block text-stone-400 hover:text-white transition-colors">
                  Treks
                </button>
                <Link to="/food" className="block text-stone-400 hover:text-white transition-colors">
                  Order Food
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-stone-400">
                <p>Kalga Village, Parvati Valley</p>
                <p>Kullu District, Himachal Pradesh</p>
              </div>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 text-center">
            <p className="text-stone-500 text-sm">
              © 2025 Banjara Barracks. All rights reserved.
            </p>
            <p className="text-stone-600 text-xs mt-2">
              Run by Sadhya & Sankalp Sharma
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeNew;
