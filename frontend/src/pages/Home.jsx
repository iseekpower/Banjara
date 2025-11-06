import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';
import { Mountain, Utensils, TreePine, MapPin, Heart, Music, Calendar, ExternalLink, Menu as MenuIcon, X, MessageCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const AIRBNB_URL = 'https://www.airbnb.co.in/rooms/51261620?source_impression_id=p3_1762452247_P3PmxG8ksmAwf3Rz';

const Home = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [rules, setRules] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    fetchMenuItems();
    fetchFAQs();
    fetchRules();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${API}/menu`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const fetchFAQs = async () => {
    try {
      const response = await axios.get(`${API}/faqs`);
      setFaqs(response.data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const fetchRules = async () => {
    try {
      const response = await axios.get(`${API}/rules`);
      setRules(response.data);
    } catch (error) {
      console.error('Error fetching rules:', error);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

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

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm" data-testid="main-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-2xl font-bold text-stone-900" data-testid="logo">
                Banjara Barracks
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('about')} className="text-stone-700 hover:text-stone-900 transition-colors" data-testid="nav-about">
                About
              </button>
              <button onClick={() => scrollToSection('explore')} className="text-stone-700 hover:text-stone-900 transition-colors" data-testid="nav-explore">
                Explore
              </button>
              <button onClick={() => scrollToSection('treks')} className="text-stone-700 hover:text-stone-900 transition-colors" data-testid="nav-treks">
                Treks
              </button>
              <button onClick={() => scrollToSection('menu')} className="text-stone-700 hover:text-stone-900 transition-colors" data-testid="nav-menu">
                Menu
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-stone-700 hover:text-stone-900 transition-colors" data-testid="nav-faq">
                FAQ
              </button>
              <Link to="/admin-banjara-core" className="text-stone-700 hover:text-stone-900 transition-colors" data-testid="nav-admin">
                Admin
              </Link>
              <Button
                onClick={() => window.open(AIRBNB_URL, '_blank')}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                data-testid="nav-book-now"
              >
                Book Now
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-stone-700"
              data-testid="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t" data-testid="mobile-menu">
            <div className="px-4 py-3 space-y-3">
              <button onClick={() => scrollToSection('about')} className="block w-full text-left text-stone-700 hover:text-stone-900">
                About
              </button>
              <button onClick={() => scrollToSection('explore')} className="block w-full text-left text-stone-700 hover:text-stone-900">
                Explore
              </button>
              <button onClick={() => scrollToSection('treks')} className="block w-full text-left text-stone-700 hover:text-stone-900">
                Treks
              </button>
              <button onClick={() => scrollToSection('menu')} className="block w-full text-left text-stone-700 hover:text-stone-900">
                Menu
              </button>
              <button onClick={() => scrollToSection('faq')} className="block w-full text-left text-stone-700 hover:text-stone-900">
                FAQ
              </button>
              <Link to="/admin-banjara-core" className="block w-full text-left text-stone-700 hover:text-stone-900">
                Admin
              </Link>
              <Button
                onClick={() => window.open(AIRBNB_URL, '_blank')}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              >
                Book Now
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen mt-16" data-testid="hero-section">
        <div className="absolute inset-0">
          <img
            src="https://a0.muscache.com/im/pictures/miso/Hosting-51261620/original/f60a8ab7-fea0-44cd-b119-18460ca3de38.jpeg?im_w=1920"
            alt="Banjara Barracks - Mountain view"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center text-white max-w-4xl animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6" data-testid="hero-title">
              Banjara Barracks
            </h1>
            <p className="text-xl sm:text-2xl mb-4 font-light">
              Where Mountains Meet Music
            </p>
            <p className="text-base sm:text-lg mb-8 max-w-2xl mx-auto opacity-90">
              A cozy retreat in Kalga, Parvati Valley · Surrounded by apple orchards and snow-capped peaks
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => window.open(AIRBNB_URL, '_blank')}
                className="bg-white text-stone-900 hover:bg-stone-100 text-lg px-8 py-6"
                data-testid="hero-book-btn"
              >
                Book on Airbnb
                <ExternalLink className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('about')}
                className="bg-transparent border-2 border-white text-white hover:bg-white/20 text-lg px-8 py-6"
                data-testid="hero-learn-more"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Banjara Barracks */}
      <section className="py-20 px-4 bg-white" id="about" data-testid="about-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-stone-900">
                Escape to the Himalayas
              </h2>
              <p className="text-lg text-stone-600 mb-4 leading-relaxed">
                Nestled at the start of Kalga village in the pristine Parvati Valley, Banjara Barracks is more than just a homestay—it's a sanctuary for souls seeking the raw beauty of nature.
              </p>
              <p className="text-lg text-stone-600 mb-4 leading-relaxed">
                Surrounded by lush apple orchards and towering snow-capped mountains, we offer clean, comfortable rooms with breathtaking valley views. Our cuisine ranges from continental favorites to authentic local Himachali dishes, prepared with love and local ingredients.
              </p>
              <p className="text-lg text-stone-600 leading-relaxed">
                Every season brings its own magic—stunning sunset views, mesmerizing cloud shows, blooming apple orchards in spring, and snow-covered peaks in winter. Each day is unique at Kalga.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src="https://a0.muscache.com/im/pictures/miso/Hosting-51261620/original/10a98b24-1a16-42c9-b063-d60992c041ec.jpeg?im_w=1200"
                alt="Banjara Barracks exterior view"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* Founders Story */}
          <div className="grid lg:grid-cols-2 gap-12 items-center bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 lg:p-12" data-testid="founders-section">
            <div>
              <img
                src="https://a0.muscache.com/im/pictures/miso/Hosting-51261620/original/e5e0dac2-198d-46a4-bc63-f11ff0d19da3.jpeg?im_w=1200"
                alt="Valley views from Banjara Barracks"
                className="w-full h-96 object-cover rounded-xl shadow-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Music className="w-8 h-8 text-emerald-600" />
                <h3 className="text-3xl font-bold text-stone-900">The Brothers Behind Banjara</h3>
              </div>
              <p className="text-lg text-stone-700 mb-4 leading-relaxed">
                <span className="font-semibold">Sadhya Sharma</span> and <span className="font-semibold">Sankalp Sharma</span>—two brothers who fell deeply in love with the lifestyle this valley had to offer.
              </p>
              <p className="text-lg text-stone-700 mb-4 leading-relaxed">
                They found in Kalga what many spend their whole lives searching for: nature in its truest, rawest form. A place where the mountains speak, the rivers sing, and life moves at its own gentle pace.
              </p>
              <p className="text-lg text-stone-700 mb-4 leading-relaxed">
                Passionate about music and creating unique sounds, Sankalp is a music producer who crafts interesting melodies when inspiration strikes. The brothers believe in enjoying life as it is—simple, authentic, and deeply connected to nature.
              </p>
              <div className="flex items-center gap-2 text-emerald-700">
                <Heart className="w-5 h-5" />
                <p className="text-base italic">"Creating spaces where travelers can connect with nature and themselves"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Parvati Valley */}
      <section className="py-20 px-4 bg-gradient-to-b from-stone-100 to-stone-50" id="explore" data-testid="explore-section">
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

      {/* Treks Section */}
      <section className="py-20 px-4 bg-white" id="treks" data-testid="treks-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Mountain className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-stone-900">
              Guided Treks
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Fully supported treks organized by our experienced team at ₹5,000 per person
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://a0.muscache.com/im/pictures/miso/Hosting-51261620/original/99841d52-1d9a-4b1e-a234-57b27b360555.jpeg?im_w=1200"
                alt="Himalayan mountain views from property"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Experience the Trails</h3>
                  <p className="text-sm opacity-90">Through pine forests, past waterfalls, to stunning viewpoints</p>
                </div>
              </div>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://a0.muscache.com/im/pictures/miso/Hosting-51261620/original/b771f6f8-ad23-4d07-a57f-7678a5997157.jpeg?im_w=1200"
                alt="Cozy bedroom at Banjara Barracks"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Comfortable Stays</h3>
                  <p className="text-sm opacity-90">Cozy rooms with stunning mountain views</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Bhunbhuni Trek', duration: '4-5 hours', difficulty: 'Moderate' },
              { name: 'Bhandak Trek', duration: '5-6 hours', difficulty: 'Moderate' },
              { name: 'Bishkeri Trek', duration: '6-7 hours', difficulty: 'Challenging' },
              { name: 'Tevla Trek', duration: '3-4 hours', difficulty: 'Easy' }
            ].map((trek, index) => (
              <Card key={index} className="border-2 border-emerald-100 hover:border-emerald-300 transition-colors" data-testid={`trek-${index}`}>
                <CardHeader>
                  <CardTitle className="text-lg">{trek.name}</CardTitle>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">{trek.duration}</span>
                    <span className={`font-semibold px-2 py-1 rounded text-xs ${
                      trek.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      trek.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {trek.difficulty}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600 mb-2">₹5,000</p>
                    <p className="text-xs text-stone-500">per person</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              size="lg"
              onClick={() => window.open(AIRBNB_URL, '_blank')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-lg px-12 py-6"
              data-testid="book-trek-btn"
            >
              Book Your Trek on Airbnb
              <ExternalLink className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      {Object.keys(groupedMenu).length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-br from-amber-50 to-orange-50" id="menu" data-testid="menu-section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Utensils className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-stone-900">
                Our Menu
              </h2>
              <p className="text-lg text-stone-600">
                From continental favorites to authentic Himachali cuisine, prepared with love
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(groupedMenu).map(([category, items]) => (
                <Card key={category} className="border-0 shadow-xl overflow-hidden" data-testid={`menu-category-${category}`}>
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                    <CardTitle className="text-2xl">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 bg-white">
                    {items.filter(item => item.available).map((item) => (
                      <div key={item.id} className="flex justify-between items-start mb-4 pb-4 border-b last:border-0" data-testid={`menu-item-${item.id}`}>
                        <div className="flex-1">
                          <p className="font-semibold text-stone-900 text-base">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-stone-500 mt-1">{item.description}</p>
                          )}
                        </div>
                        {item.price && (
                          <span className="text-orange-600 font-bold text-lg ml-4">₹{item.price}</span>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Image Gallery */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-center text-stone-900">
            Experience Banjara Barracks
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 h-80">
              <img
                src="https://a0.muscache.com/im/pictures/miso/Hosting-51261620/original/305b2f0e-8311-4a4f-95f6-d2dfc4ad1333.jpeg?im_w=1440"
                alt="Bedroom 1 at Banjara Barracks"
                className="w-full h-full object-cover rounded-xl shadow-lg"
              />
            </div>
            <div className="h-80">
              <img
                src="https://a0.muscache.com/im/pictures/miso/Hosting-51261620/original/ca059473-8387-480a-b669-ab1b77b4c943.jpeg?im_w=720"
                alt="Bedroom 2 with floor mattresses"
                className="w-full h-full object-cover rounded-xl shadow-lg"
              />
            </div>
            <div className="h-80">
              <img
                src="https://a0.muscache.com/im/pictures/miso/Hosting-51261620/original/ce3b16e6-7ede-445c-9b47-c464154ef308.jpeg?im_w=720"
                alt="Bedroom 4 with wall art"
                className="w-full h-full object-cover rounded-xl shadow-lg"
              />
            </div>
            <div className="md:col-span-2 h-80">
              <img
                src="https://a0.muscache.com/im/pictures/miso/Hosting-51261620/original/f60a8ab7-fea0-44cd-b119-18460ca3de38.jpeg?im_w=1440"
                alt="Stunning mountain views from property"
                className="w-full h-full object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-stone-50" id="faq" data-testid="faq-section">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12 text-stone-900">
            Frequently Asked Questions
          </h2>
          
          {/* AI Trip Planner */}
          <Card className="mb-8 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-xl" data-testid="ai-assistant-card">
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

          {faqs.length > 0 && (
            <Accordion type="single" collapsible className="space-y-4" data-testid="faq-accordion">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-2 border-stone-200 rounded-xl px-6 bg-white" data-testid={`faq-item-${faq.id}`}>
                  <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline hover:text-emerald-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-stone-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
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

      {/* House Rules */}
      {rules.length > 0 && (
        <section className="py-20 px-4 bg-white" id="rules" data-testid="rules-section">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12 text-stone-900">
              House Rules
            </h2>
            <Card className="border-2 border-stone-200 shadow-xl">
              <CardContent className="pt-8">
                <ul className="space-y-5">
                  {rules.map((rule, index) => (
                    <li key={rule.id} className="flex items-start" data-testid={`rule-${index}`}>
                      <span className="text-emerald-600 mr-4 text-2xl font-bold">{index + 1}.</span>
                      <span className="text-lg text-stone-700 leading-relaxed">{rule.rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready for Your Himalayan Adventure?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Book your stay at Banjara Barracks and experience the magic of Parvati Valley
          </p>
          <Button
            size="lg"
            onClick={() => window.open(AIRBNB_URL, '_blank')}
            className="bg-white text-emerald-700 hover:bg-stone-100 text-xl px-12 py-7 shadow-xl"
            data-testid="cta-book-btn"
          >
            Book Now on Airbnb
            <ExternalLink className="ml-3 w-6 h-6" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Banjara Barracks</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                A cozy homestay in Kalga, Parvati Valley, where mountains meet music.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <button onClick={() => scrollToSection('about')} className="block text-stone-400 hover:text-white transition-colors">
                  About Us
                </button>
                <button onClick={() => scrollToSection('treks')} className="block text-stone-400 hover:text-white transition-colors">
                  Treks
                </button>
                <button onClick={() => scrollToSection('menu')} className="block text-stone-400 hover:text-white transition-colors">
                  Menu
                </button>
                <Link to="/admin-banjara-core" className="block text-stone-400 hover:text-white transition-colors">
                  Admin Login
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-stone-400">
                <p>Kalga Village</p>
                <p>Parvati Valley, Kullu District</p>
                <p>Himachal Pradesh, India</p>
              </div>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 text-center">
            <p className="text-stone-500 text-sm">
              © 2025 Banjara Barracks. Crafted with <Heart className="inline w-4 h-4 text-red-500" /> in the Himalayas.
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

export default Home;
