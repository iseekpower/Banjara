import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';
import { Mountain, Utensils, Home as HomeIcon, Trees, Calendar, Phone, Mail, MessageCircle, Sparkles, Send, X } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [trekDialog, setTrekDialog] = useState(false);
  const [bbqDialog, setBbqDialog] = useState(false);
  const [roomDialog, setRoomDialog] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [rules, setRules] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [chatLoading, setChatLoading] = useState(false);

  const [trekForm, setTrekForm] = useState({
    trek_name: '',
    person_count: 1,
    date: '',
    full_name: '',
    email: '',
    phone: ''
  });

  const [bbqForm, setBbqForm] = useState({
    date: '',
    person_count: 1,
    full_name: '',
    email: '',
    phone: '',
    special_requests: ''
  });

  const [roomForm, setRoomForm] = useState({
    check_in: '',
    check_out: '',
    guest_count: 1,
    room_type: '',
    full_name: '',
    email: '',
    phone: '',
    message: ''
  });

  const treks = [
    { name: 'Bhunbhuni Trek', duration: '4-5 hours', difficulty: 'Moderate' },
    { name: 'Bhandak Trek', duration: '5-6 hours', difficulty: 'Moderate' },
    { name: 'Bishkeri Trek', duration: '6-7 hours', difficulty: 'Challenging' },
    { name: 'Tevla Trek', duration: '3-4 hours', difficulty: 'Easy' }
  ];

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

  const handleTrekBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/bookings/trek`, trekForm);
      toast.success('Trek booking submitted successfully! We will contact you soon.');
      setTrekDialog(false);
      setTrekForm({
        trek_name: '',
        person_count: 1,
        date: '',
        full_name: '',
        email: '',
        phone: ''
      });
    } catch (error) {
      toast.error('Failed to submit booking. Please try again.');
    }
  };

  const handleBBQBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/bookings/bbq`, bbqForm);
      toast.success('BBQ booking submitted successfully! We will contact you soon.');
      setBbqDialog(false);
      setBbqForm({
        date: '',
        person_count: 1,
        full_name: '',
        email: '',
        phone: '',
        special_requests: ''
      });
    } catch (error) {
      toast.error('Failed to submit booking. Please try again.');
    }
  };

  const handleRoomInquiry = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/inquiries/room`, roomForm);
      toast.success('Room inquiry submitted successfully! We will contact you soon.');
      setRoomDialog(false);
      setRoomForm({
        check_in: '',
        check_out: '',
        guest_count: 1,
        room_type: '',
        full_name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to submit inquiry. Please try again.');
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

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white px-4 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6" data-testid="hero-title">
            Banjara Barracks
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-8" data-testid="hero-subtitle">
            Escape to the Himalayas. Experience nature at its finest in the heart of Kalgha.
          </p>
          <Button
            onClick={() => setRoomDialog(true)}
            size="lg"
            className="bg-white text-purple-900 hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-semibold"
            data-testid="inquire-now-btn"
          >
            Inquire About Rooms
          </Button>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-white" id="about" data-testid="about-section">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                Welcome to Your Mountain Retreat
              </h2>
              <p className="text-base text-gray-600 mb-4 leading-relaxed">
                Banjara Barracks is a cozy homestay located right at the start of Kalgha, making it easy to find and perfectly positioned to offer breathtaking views of the Himalayas.
              </p>
              <p className="text-base text-gray-600 mb-4 leading-relaxed">
                Surrounded by apple orchards and snow-capped mountains, we offer a peaceful escape from city life. Our clean, comfortable rooms and delicious food ranging from continental to local cuisine ensure you feel right at home.
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                Each season and day is unique at Kalgha, filled with amazing sunset views, cloud shows, and the natural beauty of the Himalayas.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl animate-slide-up">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                alt="Himalayan mountains"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50" id="services" data-testid="services-section">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12 text-gray-900">
            Our Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur" data-testid="service-treks">
              <CardHeader>
                <Mountain className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Guided Treks</CardTitle>
                <CardDescription>₹5,000 per person</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Fully supported treks to stunning locations around Kalgha.
                </p>
                <Button
                  onClick={() => setTrekDialog(true)}
                  className="w-full rounded-full bg-purple-600 hover:bg-purple-700"
                  data-testid="book-trek-btn"
                >
                  Book a Trek
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur" data-testid="service-bbq">
              <CardHeader>
                <Sparkles className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>BBQ Nights</CardTitle>
                <CardDescription>Under the stars</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Enjoy delicious barbecue evenings with stunning mountain views.
                </p>
                <Button
                  onClick={() => setBbqDialog(true)}
                  className="w-full rounded-full bg-orange-600 hover:bg-orange-700"
                  data-testid="book-bbq-btn"
                >
                  Book BBQ Night
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur" data-testid="service-day-walks">
              <CardHeader>
                <Trees className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Day Walks</CardTitle>
                <CardDescription>Explore nearby spots</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Guided day walks and small picnics to scenic locations.
                </p>
                <Button
                  className="w-full rounded-full bg-green-600 hover:bg-green-700"
                  data-testid="contact-day-walks-btn"
                >
                  Contact Us
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur" data-testid="service-rooms">
              <CardHeader>
                <HomeIcon className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Cozy Rooms</CardTitle>
                <CardDescription>Valley views</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Clean, comfortable rooms with breathtaking valley views.
                </p>
                <Button
                  onClick={() => setRoomDialog(true)}
                  className="w-full rounded-full bg-blue-600 hover:bg-blue-700"
                  data-testid="inquire-rooms-btn"
                >
                  Inquire Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Treks Section */}
      <section className="py-20 px-4 bg-white" id="treks" data-testid="treks-section">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12 text-gray-900">
            Available Treks
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {treks.map((trek, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`trek-${index}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {trek.name}
                    <span className="text-sm font-normal text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                      ₹5,000/person
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Duration: {trek.duration}</span>
                    <span className={`font-semibold ${
                      trek.difficulty === 'Easy' ? 'text-green-600' :
                      trek.difficulty === 'Moderate' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {trek.difficulty}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      {Object.keys(groupedMenu).length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-br from-orange-50 to-yellow-50" id="menu" data-testid="menu-section">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Utensils className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Our Menu
              </h2>
              <p className="text-base text-gray-600 mt-4">
                From continental to local cuisine, prepared with love
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(groupedMenu).map(([category, items]) => (
                <Card key={category} className="border-0 shadow-lg" data-testid={`menu-category-${category}`}>
                  <CardHeader className="bg-orange-100">
                    <CardTitle className="text-2xl">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {items.filter(item => item.available).map((item) => (
                      <div key={item.id} className="flex justify-between items-start mb-4" data-testid={`menu-item-${item.id}`}>
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          {item.description && (
                            <p className="text-xs text-gray-600">{item.description}</p>
                          )}
                        </div>
                        {item.price && (
                          <span className="text-orange-600 font-semibold">₹{item.price}</span>
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

      {/* FAQ Section with AI Assistant */}
      <section className="py-20 px-4 bg-white" id="faq" data-testid="faq-section">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12 text-gray-900">
            Frequently Asked Questions
          </h2>
          
          {/* AI Trip Planner */}
          <Card className="mb-8 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50" data-testid="ai-assistant-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-purple-600" />
                AI Trip Planning Assistant
              </CardTitle>
              <CardDescription>
                Get personalized trip recommendations and costing estimates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setChatOpen(true)}
                className="w-full rounded-full bg-purple-600 hover:bg-purple-700"
                data-testid="open-ai-chat-btn"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Planning Your Trip
              </Button>
            </CardContent>
          </Card>

          {/* Regular FAQs */}
          {faqs.length > 0 && (
            <Accordion type="single" collapsible className="space-y-4" data-testid="faq-accordion">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4 bg-gray-50" data-testid={`faq-item-${faq.id}`}>
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>

      {/* House Rules Section */}
      {rules.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50" id="rules" data-testid="rules-section">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12 text-gray-900">
              House Rules
            </h2>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {rules.map((rule, index) => (
                    <li key={rule.id} className="flex items-start" data-testid={`rule-${index}`}>
                      <span className="text-purple-600 mr-3 text-xl">•</span>
                      <span className="text-base text-gray-700">{rule.rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-20 px-4 bg-white" id="contact" data-testid="contact-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-gray-900">
            Get in Touch
          </h2>
          <p className="text-base text-gray-600 mb-8">
            Have questions? We're here to help make your Himalayan experience unforgettable.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-purple-600" />
              <span className="text-base">+91 XXXXX XXXXX</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600" />
              <span className="text-base">info@banjarabarracks.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">
            © 2025 Banjara Barracks. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Kalgha, Himachal Pradesh
          </p>
        </div>
      </footer>

      {/* Trek Booking Dialog */}
      <Dialog open={trekDialog} onOpenChange={setTrekDialog}>
        <DialogContent className="max-w-md" data-testid="trek-booking-dialog">
          <DialogHeader>
            <DialogTitle>Book a Trek</DialogTitle>
            <DialogDescription>
              Fill in your details to book a trek. Cost: ₹5,000 per person
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTrekBooking} className="space-y-4">
            <div>
              <Label htmlFor="trek-name">Select Trek</Label>
              <Select
                value={trekForm.trek_name}
                onValueChange={(value) => setTrekForm({ ...trekForm, trek_name: value })}
                required
              >
                <SelectTrigger data-testid="trek-select">
                  <SelectValue placeholder="Choose a trek" />
                </SelectTrigger>
                <SelectContent>
                  {treks.map((trek) => (
                    <SelectItem key={trek.name} value={trek.name}>
                      {trek.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="trek-person-count">Number of People</Label>
              <Input
                id="trek-person-count"
                type="number"
                min="1"
                value={trekForm.person_count}
                onChange={(e) => setTrekForm({ ...trekForm, person_count: parseInt(e.target.value) })}
                required
                data-testid="trek-person-count"
              />
            </div>
            <div>
              <Label htmlFor="trek-date">Preferred Date</Label>
              <Input
                id="trek-date"
                type="date"
                value={trekForm.date}
                onChange={(e) => setTrekForm({ ...trekForm, date: e.target.value })}
                required
                data-testid="trek-date"
              />
            </div>
            <div>
              <Label htmlFor="trek-name-input">Full Name</Label>
              <Input
                id="trek-name-input"
                value={trekForm.full_name}
                onChange={(e) => setTrekForm({ ...trekForm, full_name: e.target.value })}
                required
                data-testid="trek-full-name"
              />
            </div>
            <div>
              <Label htmlFor="trek-email">Email</Label>
              <Input
                id="trek-email"
                type="email"
                value={trekForm.email}
                onChange={(e) => setTrekForm({ ...trekForm, email: e.target.value })}
                required
                data-testid="trek-email"
              />
            </div>
            <div>
              <Label htmlFor="trek-phone">Phone</Label>
              <Input
                id="trek-phone"
                type="tel"
                value={trekForm.phone}
                onChange={(e) => setTrekForm({ ...trekForm, phone: e.target.value })}
                required
                data-testid="trek-phone"
              />
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <p className="text-sm font-semibold">Total Cost: ₹{5000 * trekForm.person_count}</p>
            </div>
            <Button type="submit" className="w-full rounded-full" data-testid="submit-trek-booking">
              Submit Booking
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* BBQ Booking Dialog */}
      <Dialog open={bbqDialog} onOpenChange={setBbqDialog}>
        <DialogContent className="max-w-md" data-testid="bbq-booking-dialog">
          <DialogHeader>
            <DialogTitle>Book BBQ Night</DialogTitle>
            <DialogDescription>
              Reserve a memorable barbecue evening under the stars
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBBQBooking} className="space-y-4">
            <div>
              <Label htmlFor="bbq-date">Preferred Date</Label>
              <Input
                id="bbq-date"
                type="date"
                value={bbqForm.date}
                onChange={(e) => setBbqForm({ ...bbqForm, date: e.target.value })}
                required
                data-testid="bbq-date"
              />
            </div>
            <div>
              <Label htmlFor="bbq-person-count">Number of People</Label>
              <Input
                id="bbq-person-count"
                type="number"
                min="1"
                value={bbqForm.person_count}
                onChange={(e) => setBbqForm({ ...bbqForm, person_count: parseInt(e.target.value) })}
                required
                data-testid="bbq-person-count"
              />
            </div>
            <div>
              <Label htmlFor="bbq-name">Full Name</Label>
              <Input
                id="bbq-name"
                value={bbqForm.full_name}
                onChange={(e) => setBbqForm({ ...bbqForm, full_name: e.target.value })}
                required
                data-testid="bbq-full-name"
              />
            </div>
            <div>
              <Label htmlFor="bbq-email">Email</Label>
              <Input
                id="bbq-email"
                type="email"
                value={bbqForm.email}
                onChange={(e) => setBbqForm({ ...bbqForm, email: e.target.value })}
                required
                data-testid="bbq-email"
              />
            </div>
            <div>
              <Label htmlFor="bbq-phone">Phone</Label>
              <Input
                id="bbq-phone"
                type="tel"
                value={bbqForm.phone}
                onChange={(e) => setBbqForm({ ...bbqForm, phone: e.target.value })}
                required
                data-testid="bbq-phone"
              />
            </div>
            <div>
              <Label htmlFor="bbq-requests">Special Requests (Optional)</Label>
              <Textarea
                id="bbq-requests"
                value={bbqForm.special_requests}
                onChange={(e) => setBbqForm({ ...bbqForm, special_requests: e.target.value })}
                data-testid="bbq-special-requests"
              />
            </div>
            <Button type="submit" className="w-full rounded-full" data-testid="submit-bbq-booking">
              Submit Booking
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Room Inquiry Dialog */}
      <Dialog open={roomDialog} onOpenChange={setRoomDialog}>
        <DialogContent className="max-w-md" data-testid="room-inquiry-dialog">
          <DialogHeader>
            <DialogTitle>Room Inquiry</DialogTitle>
            <DialogDescription>
              Let us know your requirements and we'll get back to you
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRoomInquiry} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="check-in">Check-in</Label>
                <Input
                  id="check-in"
                  type="date"
                  value={roomForm.check_in}
                  onChange={(e) => setRoomForm({ ...roomForm, check_in: e.target.value })}
                  required
                  data-testid="room-check-in"
                />
              </div>
              <div>
                <Label htmlFor="check-out">Check-out</Label>
                <Input
                  id="check-out"
                  type="date"
                  value={roomForm.check_out}
                  onChange={(e) => setRoomForm({ ...roomForm, check_out: e.target.value })}
                  required
                  data-testid="room-check-out"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="guest-count">Number of Guests</Label>
              <Input
                id="guest-count"
                type="number"
                min="1"
                value={roomForm.guest_count}
                onChange={(e) => setRoomForm({ ...roomForm, guest_count: parseInt(e.target.value) })}
                required
                data-testid="room-guest-count"
              />
            </div>
            <div>
              <Label htmlFor="room-type">Room Preference (Optional)</Label>
              <Input
                id="room-type"
                placeholder="e.g., Valley view, Mountain view"
                value={roomForm.room_type}
                onChange={(e) => setRoomForm({ ...roomForm, room_type: e.target.value })}
                data-testid="room-type"
              />
            </div>
            <div>
              <Label htmlFor="room-name">Full Name</Label>
              <Input
                id="room-name"
                value={roomForm.full_name}
                onChange={(e) => setRoomForm({ ...roomForm, full_name: e.target.value })}
                required
                data-testid="room-full-name"
              />
            </div>
            <div>
              <Label htmlFor="room-email">Email</Label>
              <Input
                id="room-email"
                type="email"
                value={roomForm.email}
                onChange={(e) => setRoomForm({ ...roomForm, email: e.target.value })}
                required
                data-testid="room-email"
              />
            </div>
            <div>
              <Label htmlFor="room-phone">Phone</Label>
              <Input
                id="room-phone"
                type="tel"
                value={roomForm.phone}
                onChange={(e) => setRoomForm({ ...roomForm, phone: e.target.value })}
                required
                data-testid="room-phone"
              />
            </div>
            <div>
              <Label htmlFor="room-message">Message (Optional)</Label>
              <Textarea
                id="room-message"
                value={roomForm.message}
                onChange={(e) => setRoomForm({ ...roomForm, message: e.target.value })}
                data-testid="room-message"
              />
            </div>
            <Button type="submit" className="w-full rounded-full" data-testid="submit-room-inquiry">
              Submit Inquiry
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* AI Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col" data-testid="ai-chat-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-600" />
              AI Trip Planning Assistant
            </DialogTitle>
            <DialogDescription>
              Ask about trip duration, activities, weather, and get personalized recommendations
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg" data-testid="chat-messages">
            {chatMessages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm">Start a conversation to plan your perfect Himalayan getaway!</p>
              </div>
            )}
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                data-testid={`chat-message-${index}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-white text-gray-900 rounded-bl-none shadow'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-lg shadow">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about trip planning, weather, activities..."
              disabled={chatLoading}
              data-testid="chat-input"
            />
            <Button type="submit" disabled={chatLoading || !chatInput.trim()} data-testid="send-chat-btn">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
