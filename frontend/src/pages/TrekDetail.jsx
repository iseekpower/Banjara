import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  ArrowLeft, Mountain, Clock, MapPin, Calendar, Users,
  CheckCircle, AlertCircle, Copy, Check, Star, Sparkles
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const UPI_ID = 'sadhya0794@okhdfcbank';

const TrekDetail = () => {
  const { trekId } = useParams();
  const [trek, setTrek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [bookingForm, setBookingForm] = useState({
    person_count: 1,
    date: '',
    full_name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchTrek();
  }, [trekId]);

  const fetchTrek = async () => {
    try {
      const response = await axios.get(`${API}/treks/${trekId}`);
      setTrek(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trek:', error);
      toast.error('Failed to load trek details');
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    const bookingData = {
      trek_id: trek.id,
      trek_name: trek.name,
      ...bookingForm,
      payment_method: 'upi',
      payment_status: 'pending'
    };

    try {
      await axios.post(`${API}/bookings/trek`, bookingData);
      toast.success('Trek booking submitted! We will contact you to confirm.');
      setBookingOpen(false);
      setBookingForm({
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

  const copyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUPI(true);
    toast.success('UPI ID copied to clipboard!');
    setTimeout(() => setCopiedUPI(false), 2000);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'challenging': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className=\"min-h-screen flex items-center justify-center\">
        <div className=\"text-center\">
          <Mountain className=\"w-16 h-16 text-emerald-600 mx-auto mb-4 animate-bounce\" />
          <p className=\"text-stone-600\">Loading trek details...</p>
        </div>
      </div>
    );
  }

  if (!trek) {
    return (
      <div className=\"min-h-screen flex items-center justify-center\">
        <div className=\"text-center\">
          <AlertCircle className=\"w-16 h-16 text-red-500 mx-auto mb-4\" />
          <h2 className=\"text-2xl font-bold mb-2\">Trek Not Found</h2>
          <Link to=\"/\">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className=\"min-h-screen bg-stone-50\">
      {/* Header */}
      <header className=\"bg-white shadow-sm sticky top-0 z-40\">
        <div className=\"max-w-7xl mx-auto px-4 py-4 flex items-center justify-between\">
          <Link to=\"/\" className=\"flex items-center text-emerald-600 hover:text-emerald-700\">
            <ArrowLeft className=\"w-5 h-5 mr-2\" />
            Back to Home
          </Link>
          <Button
            onClick={() => setBookingOpen(true)}
            size=\"lg\"
            className=\"bg-emerald-600 hover:bg-emerald-700\"
            data-testid=\"book-trek-btn\"
          >
            Book This Trek
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className=\"relative h-96 overflow-hidden\">
        <img
          src={trek.images[currentImageIndex]}
          alt={trek.name}
          className=\"w-full h-full object-cover\"
        />
        <div className=\"absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent\"></div>
        <div className=\"absolute bottom-0 left-0 right-0 p-8 text-white\">
          <div className=\"max-w-7xl mx-auto\">
            {trek.featured && (
              <Badge className=\"bg-yellow-500 text-white mb-3\">
                <Star className=\"w-4 h-4 mr-1 fill-white\" />
                FEATURED TREK
              </Badge>
            )}
            <h1 className=\"text-5xl font-bold mb-3\">{trek.name}</h1>
            <div className=\"flex flex-wrap gap-4 text-lg\">
              <span className=\"flex items-center gap-2\">
                <Clock className=\"w-5 h-5\" /> {trek.duration}
              </span>
              <span className=\"flex items-center gap-2\">
                <Mountain className=\"w-5 h-5\" /> {trek.altitude}
              </span>
              <span className=\"flex items-center gap-2\">
                <MapPin className=\"w-5 h-5\" /> {trek.distance}
              </span>
            </div>
          </div>
        </div>
        
        {/* Image Navigation */}
        {trek.images.length > 1 && (
          <div className=\"absolute bottom-20 right-8 flex gap-2\">
            {trek.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${\n                  currentImageIndex === index ? 'w-8 bg-white' : 'bg-white/50'\n                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Content */}
      <div className=\"max-w-7xl mx-auto px-4 py-12\">
        <div className=\"grid lg:grid-cols-3 gap-8\">
          {/* Main Content */}
          <div className=\"lg:col-span-2 space-y-8\">
            {/* Quick Info */}
            <Card className=\"border-2 border-emerald-100\">
              <CardContent className=\"pt-6\">
                <div className=\"grid md:grid-cols-3 gap-6 text-center\">
                  <div>
                    <Badge className={`${getDifficultyColor(trek.difficulty)} text-lg px-4 py-2`}>
                      {trek.difficulty}
                    </Badge>
                    <p className=\"text-sm text-stone-600 mt-2\">Difficulty Level</p>
                  </div>
                  <div>
                    <p className=\"text-3xl font-bold text-emerald-600\">\u20b95,000</p>
                    <p className=\"text-sm text-stone-600 mt-1\">per person</p>
                  </div>
                  <div>
                    <p className=\"text-2xl font-bold text-stone-900\">{trek.duration}</p>
                    <p className=\"text-sm text-stone-600 mt-1\">Duration</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className=\"text-2xl\">About This Trek</CardTitle>
              </CardHeader>
              <CardContent>
                <p className=\"text-stone-700 leading-relaxed text-lg\">{trek.description}</p>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card className=\"bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200\">
              <CardHeader>
                <CardTitle className=\"flex items-center gap-2\">
                  <Sparkles className=\"w-6 h-6 text-emerald-600\" />
                  Trek Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className=\"space-y-3\">
                  {trek.highlights.map((highlight, index) => (
                    <li key={index} className=\"flex items-start gap-3\">
                      <CheckCircle className=\"w-5 h-5 text-emerald-600 flex-shrink-0 mt-1\" />
                      <span className=\"text-stone-700\">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* What to Carry */}
            <Card>
              <CardHeader>
                <CardTitle>What to Carry</CardTitle>
              </CardHeader>
              <CardContent>
                <div className=\"grid md:grid-cols-2 gap-3\">
                  {trek.what_to_carry.map((item, index) => (
                    <div key={index} className=\"flex items-center gap-2 text-stone-700\">
                      <div className=\"w-2 h-2 bg-emerald-600 rounded-full\"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className=\"space-y-6\">
            {/* Booking Card */}
            <Card className=\"sticky top-24 border-2 border-emerald-200 shadow-xl\">
              <CardHeader className=\"bg-gradient-to-r from-emerald-600 to-teal-600 text-white\">
                <CardTitle className=\"text-2xl\">Book This Trek</CardTitle>
              </CardHeader>
              <CardContent className=\"pt-6 space-y-4\">
                <div className=\"text-center py-4 bg-emerald-50 rounded-lg\">
                  <p className=\"text-4xl font-bold text-emerald-600\">\u20b95,000</p>
                  <p className=\"text-stone-600\">per person</p>
                </div>
                
                <Button
                  onClick={() => setBookingOpen(true)}
                  className=\"w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6\"
                  data-testid=\"sidebar-book-btn\"
                >
                  Book Now
                </Button>

                <div className=\"pt-4 border-t space-y-2 text-sm text-stone-600\">
                  <p className=\"flex items-center gap-2\">
                    <CheckCircle className=\"w-4 h-4 text-emerald-600\" />
                    Expert guide included
                  </p>
                  <p className=\"flex items-center gap-2\">
                    <CheckCircle className=\"w-4 h-4 text-emerald-600\" />
                    All safety equipment
                  </p>
                  <p className=\"flex items-center gap-2\">
                    <CheckCircle className=\"w-4 h-4 text-emerald-600\" />
                    First-aid support
                  </p>
                  <p className=\"flex items-center gap-2\">
                    <CheckCircle className=\"w-4 h-4 text-emerald-600\" />
                    Starts from Kalga
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Best Season */}
            <Card>
              <CardHeader>
                <CardTitle className=\"text-lg\">Best Season</CardTitle>
              </CardHeader>
              <CardContent>
                <p className=\"text-stone-700\">{trek.best_season}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className=\"max-w-2xl\" data-testid=\"booking-dialog\">
          <DialogHeader>
            <DialogTitle className=\"text-2xl\">Book {trek.name}</DialogTitle>
            <DialogDescription>
              Fill in your details and we'll confirm your trek booking
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBooking} className=\"space-y-6\">
            <div className=\"grid md:grid-cols-2 gap-4\">
              <div>
                <Label htmlFor=\"full_name\">Full Name</Label>
                <Input
                  id=\"full_name\"
                  value={bookingForm.full_name}
                  onChange={(e) => setBookingForm({...bookingForm, full_name: e.target.value})}
                  required
                  data-testid=\"booking-name\"
                />
              </div>
              <div>
                <Label htmlFor=\"email\">Email</Label>
                <Input
                  id=\"email\"
                  type=\"email\"
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                  required
                  data-testid=\"booking-email\"
                />
              </div>
            </div>

            <div className=\"grid md:grid-cols-2 gap-4\">
              <div>
                <Label htmlFor=\"phone\">Phone Number</Label>
                <Input
                  id=\"phone\"
                  type=\"tel\"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                  required
                  data-testid=\"booking-phone\"
                />
              </div>
              <div>
                <Label htmlFor=\"date\">Trek Date</Label>
                <Input
                  id=\"date\"
                  type=\"date\"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                  required
                  data-testid=\"booking-date\"
                />
              </div>
            </div>

            <div>
              <Label htmlFor=\"person_count\">Number of People</Label>
              <Input
                id=\"person_count\"
                type=\"number\"
                min=\"1\"
                value={bookingForm.person_count}
                onChange={(e) => setBookingForm({...bookingForm, person_count: parseInt(e.target.value)})}
                required
                data-testid=\"booking-people\"
              />
            </div>

            <div className=\"bg-emerald-50 p-6 rounded-lg space-y-3\">
              <div className=\"flex justify-between items-center\">
                <span className=\"font-semibold\">Total Amount:</span>
                <span className=\"text-3xl font-bold text-emerald-600\">
                  \u20b9{5000 * bookingForm.person_count}
                </span>
              </div>
            </div>

            {/* UPI Payment Section */}
            <div className=\"bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 p-6 rounded-xl\">
              <h3 className=\"font-bold text-lg mb-3 flex items-center gap-2\">
                <span className=\"text-2xl\">💳</span> Pay via UPI
              </h3>
              <p className=\"text-sm text-stone-600 mb-4\">
                Transfer the amount to our UPI ID and we'll confirm your booking
              </p>
              <div className=\"bg-white p-4 rounded-lg border-2 border-purple-300\">
                <Label className=\"text-xs text-stone-600 mb-1 block\">UPI ID</Label>
                <div className=\"flex items-center justify-between\">
                  <span className=\"font-mono text-lg font-bold text-purple-700\">{UPI_ID}</span>
                  <Button
                    type=\"button\"
                    size=\"sm\"
                    onClick={copyUPI}
                    variant=\"outline\"
                    className=\"border-purple-300 hover:bg-purple-50\"
                    data-testid=\"copy-upi-btn\"
                  >
                    {copiedUPI ? (
                      <>
                        <Check className=\"w-4 h-4 mr-2 text-green-600\" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className=\"w-4 h-4 mr-2\" />
                        Copy ID
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <p className=\"text-xs text-stone-500 mt-3\">
                * After payment, submit this form and we'll contact you to confirm
              </p>
            </div>

            <Button 
              type=\"submit\" 
              className=\"w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6\"
              data-testid=\"submit-booking-btn\"
            >
              Submit Booking Request
            </Button>

            <p className=\"text-xs text-center text-stone-500\">
              By booking, you agree to our terms and conditions
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrekDetail;
