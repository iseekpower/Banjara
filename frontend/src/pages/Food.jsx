import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FloatingNav from '@/components/FloatingNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Clock, ShoppingCart, Trash2, Plus, Minus, ChefHat, 
  Leaf, Drumstick, Timer, Calendar, Megaphone, X,
  Home as HomeIcon, ArrowLeft, Filter, Sun, Sunset, Moon, User, LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Food = () => {
  const { user, signup, login, logout, isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const [authForm, setAuthForm] = useState({
    name: '',
    phone: '',
    user_type: 'guest', // 'guest' or 'traveler'
    room_number: '',
    cafe_name: ''
  });
  
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [mealTimeFilter, setMealTimeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [checkoutForm, setCheckoutForm] = useState({
    customer_name: '',
    phone: '',
    room_number: '',
    delivery_address: '',
    special_instructions: ''
  });

  const [subscriptionForm, setSubscriptionForm] = useState({
    customer_name: '',
    phone: '',
    address: '',
    plan_type: 'daily',
    meal_preferences: [],
    start_date: '',
    price_per_day: 0,
    total_paid: 0
  });

  useEffect(() => {
    fetchMenu();
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    filterMenu();
  }, [menuItems, activeFilter, mealTimeFilter, searchQuery]);


  // Pre-fill checkout form with user details when logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setCheckoutForm({
        customer_name: user.name,
        phone: user.phone,
        room_number: user.user_type === 'guest' ? user.room_number : '',
        delivery_address: user.user_type === 'traveler' ? (user.cafe_name || '') : '',
        special_instructions: ''
      });
    }
  }, [isAuthenticated, user]);


  const fetchMenu = async () => {
    try {
      const response = await axios.get(`${API}/menu/food`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast.error('Failed to load menu');
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${API}/announcements`);
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const filterMenu = () => {
    let filtered = [...menuItems];

    // Filter by veg/non-veg
    if (activeFilter === 'veg') {
      filtered = filtered.filter(item => item.vegetarian);
    } else if (activeFilter === 'non-veg') {
      filtered = filtered.filter(item => !item.vegetarian);
    } else if (activeFilter === 'quick') {
      filtered = filtered.filter(item => item.cooking_time <= 20);
    }

    // Filter by meal time
    if (mealTimeFilter !== 'all') {
      filtered = filtered.filter(item => 
        item.meal_time && item.meal_time.includes(mealTimeFilter)
      );
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredItems(filtered);
  };

  const getCookingTimeColor = (minutes) => {
    if (minutes <= 20) return 'bg-green-100 text-green-700 border-green-300';
    if (minutes <= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-orange-100 text-orange-700 border-orange-300';
  };

  const getCookingTimeLabel = (minutes) => {
    if (minutes === 0) return 'Pre-order';
    if (minutes <= 20) return 'Quick';
    if (minutes <= 60) return 'Medium';
    return 'Takes Time';
  };

  const addToCart = (item) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    
    const existingItem = cart.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.name === item.name
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (itemName) => {
    setCart(cart.filter(item => item.name !== itemName));
  };

  const updateQuantity = (itemName, change) => {
    setCart(cart.map(item => {
      if (item.name === itemName) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getEstimatedTime = () => {
    if (cart.length === 0) return 0;
    return Math.max(...cart.map(item => item.cooking_time));
  };


  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    
    let result;
    if (isSignup) {
      // Signup
      result = await signup(authForm);
    } else {
      // Login
      result = await login(authForm.phone);
    }
    
    if (result.success) {
      toast.success(isSignup ? 'Account created successfully!' : 'Logged in successfully!');
      setAuthModalOpen(false);
      setAuthForm({
        name: '',
        phone: '',
        user_type: 'guest',
        room_number: '',
        cafe_name: ''
      });
    } else {
      toast.error(result.error);
    }
  };


  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const orderData = {
      user_id: user?.id || null,
      order_type: user?.user_type || 'traveler',
      customer_name: user?.name || checkoutForm.customer_name,
      phone: user?.phone || checkoutForm.phone,
      room_number: user?.user_type === 'guest' ? user?.room_number : null,
      cafe_name: user?.user_type === 'traveler' ? user?.cafe_name : null,
      delivery_address: user?.user_type === 'traveler' ? (user?.cafe_name || checkoutForm.delivery_address) : null,
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        cooking_time: item.cooking_time
      })),
      total_amount: getTotalAmount(),
      estimated_time: getEstimatedTime(),
      special_instructions: checkoutForm.special_instructions
    };

    try {
      await axios.post(`${API}/orders/food`, orderData);
      toast.success('Order placed successfully! Hemu will start preparing your food.');
      setCart([]);
      setCheckoutOpen(false);
      setCheckoutForm({
        customer_name: '',
        phone: '',
        room_number: '',
        delivery_address: '',
        special_instructions: ''
      });
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    }
  };

  const handleSubscription = async (e) => {
    e.preventDefault();
    
    if (subscriptionForm.meal_preferences.length === 0) {
      toast.error('Please select at least one meal preference');
      return;
    }

    try {
      await axios.post(`${API}/subscriptions`, subscriptionForm);
      toast.success('Subscription created successfully!');
      setSubscriptionOpen(false);
      setSubscriptionForm({
        customer_name: '',
        phone: '',
        address: '',
        plan_type: 'daily',
        meal_preferences: [],
        start_date: '',
        price_per_day: 0,
        total_paid: 0
      });
    } catch (error) {
      toast.error('Failed to create subscription. Please try again.');
    }
  };

  const toggleMealPreference = (meal) => {
    setSubscriptionForm(prev => ({
      ...prev,
      meal_preferences: prev.meal_preferences.includes(meal)
        ? prev.meal_preferences.filter(m => m !== meal)
        : [...prev.meal_preferences, meal]
    }));
  };

  const getMealTimeIcon = (time) => {
    switch(time) {
      case 'breakfast': return <Sun className="w-4 h-4" />;
      case 'lunch': return <Sunset className="w-4 h-4" />;
      case 'dinner': return <Moon className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Floating Navigation */}
      <FloatingNav />
      
      {/* Page Header */}
      <div className="pt-28 pb-8 px-4 bg-gradient-to-br from-orange-50 via-amber-50 to-stone-100">
        <div className="max-w-7xl mx-auto text-center">
          <ChefHat className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-stone-900 mb-4" data-testid="food-page-title">
            Hemu's Kitchen
          </h1>
          <p className="text-lg text-stone-600">Unhurried in creation. Unmatched in taste.</p>
          {!isAuthenticated && (
            <div className="mt-6">
              <Button
                onClick={() => setAuthModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-full"
              >
                <User className="w-5 h-5 mr-2" />
                Login to Order
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {isAuthenticated && (
          <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border-l-4 border-emerald-600">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-stone-600">Logged in as</p>
                <p className="text-lg font-semibold text-stone-900">{user?.name}</p>
                <p className="text-sm text-stone-600">
                  {user?.user_type === 'guest' ? `Room: ${user?.room_number}` : `${user?.cafe_name || 'Traveler in Kalga'}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/my-orders">
                  <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Button>
                </Link>
                <Button
                  onClick={() => setCheckoutOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 relative"
                  data-testid="cart-btn"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Cart ({cart.length})
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Announcements Banner */}
      {announcements.length > 0 && (
        <section className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3">
              <Megaphone className="w-6 h-6 flex-shrink-0" />
              <div className="flex-1 overflow-hidden">
                <h3 className="font-bold text-lg mb-1">Upcoming Events at Banjara Barracks</h3>
                <div className="flex gap-4 overflow-x-auto">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="flex items-center gap-2 whitespace-nowrap">
                      <Calendar className="w-4 h-4" />
                      <span className="font-semibold">{announcement.title}</span>
                      {announcement.event_date && (
                        <span className="text-sm opacity-90">- {announcement.event_date}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Subscription Option */}
        <Card className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-emerald-600" />
              Meal Subscription Plans
            </CardTitle>
            <CardDescription>
              Save time and money with our daily meal subscriptions - Perfect for extended stays in Kalga
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-sm text-stone-700 mb-2">
                  <strong>Daily Plans:</strong> Breakfast, Lunch & Dinner delivered to you
                </p>
                <p className="text-sm text-stone-700">
                  <strong>Flexible:</strong> Choose your meals, pause anytime
                </p>
              </div>
              <Button
                onClick={() => setSubscriptionOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
                data-testid="subscription-btn"
              >
                View Plans
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('all')}
              className={activeFilter === 'all' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              data-testid="filter-all"
            >
              All Items
            </Button>
            <Button
              variant={activeFilter === 'veg' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('veg')}
              className={activeFilter === 'veg' ? 'bg-green-600 hover:bg-green-700' : ''}
              data-testid="filter-veg"
            >
              <Leaf className="w-4 h-4 mr-2" />
              Vegetarian
            </Button>
            <Button
              variant={activeFilter === 'non-veg' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('non-veg')}
              className={activeFilter === 'non-veg' ? 'bg-red-600 hover:bg-red-700' : ''}
              data-testid="filter-nonveg"
            >
              <Drumstick className="w-4 h-4 mr-2" />
              Non-Veg
            </Button>
            <Button
              variant={activeFilter === 'quick' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('quick')}
              className={activeFilter === 'quick' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              data-testid="filter-quick"
            >
              <Timer className="w-4 h-4 mr-2" />
              Quick Meals (≤20 min)
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-semibold text-stone-700">Meal Time:</span>
            {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map(time => (
              <Button
                key={time}
                variant={mealTimeFilter === time ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMealTimeFilter(time)}
                className={mealTimeFilter === time ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                {time === 'all' ? <Filter className="w-3 h-3 mr-1" /> : getMealTimeIcon(time)}
                {time.charAt(0).toUpperCase() + time.slice(1)}
              </Button>
            ))}
          </div>

          <Input
            placeholder="Search dishes... (e.g., Paneer, Maggi, Chicken)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
            data-testid="search-input"
          />
        </div>

        {/* Menu Display */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card 
              key={item.name} 
              className="hover:shadow-xl transition-all duration-300 overflow-hidden"
              data-testid={`menu-item-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  {item.vegetarian ? (
                    <Leaf className="w-5 h-5 text-green-600" />
                  ) : (
                    <Drumstick className="w-5 h-5 text-red-600" />
                  )}
                </div>
                {item.description && (
                  <CardDescription className="text-xs">{item.description}</CardDescription>
                )}
                {item.hemu_special && (
                  <Badge className="bg-amber-500 mt-2 w-fit">⭐ Hemu's Special</Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-stone-500" />
                      <Badge className={`${getCookingTimeColor(item.cooking_time)} border text-xs`}>
                        {item.pre_order ? 'Pre-order' : `${item.cooking_time} mins`}
                      </Badge>
                      <span className="text-xs text-stone-500">
                        {getCookingTimeLabel(item.cooking_time)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-2xl font-bold text-emerald-600">₹{item.price}</span>
                    <Button
                      onClick={() => addToCart(item)}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      data-testid={`add-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <ChefHat className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500 text-lg">No items found matching your filters</p>
            <Button
              onClick={() => {
                setActiveFilter('all');
                setMealTimeFilter('all');
                setSearchQuery('');
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="checkout-dialog">
          <DialogHeader>
            <DialogTitle className="text-2xl">Your Order</DialogTitle>
            <DialogDescription>
              {isAuthenticated 
                ? (user?.user_type === 'guest' ? 'Delivery to your room' : 'Village delivery in Kalga')
                : 'Please login to continue'}
            </DialogDescription>
          </DialogHeader>

          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">Your cart is empty</p>
            </div>
          ) : (
            <form onSubmit={handleCheckout} className="space-y-6">
              {/* Cart Items */}
              <div className="space-y-3">
                <h3 className="font-semibold">Items:</h3>
                {cart.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-stone-600">₹{item.price} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.name, -1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.name, 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromCart(item.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-emerald-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-emerald-600">₹{getTotalAmount()}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-700">
                  <span>Estimated Cooking Time:</span>
                  <span className="font-semibold">{getEstimatedTime()} minutes</span>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-4">
                {isAuthenticated && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                    <p className="text-sm text-blue-800 font-semibold mb-2">✓ Ordering as {user?.name}</p>
                    <p className="text-xs text-blue-700">
                      Delivery to: {user?.user_type === 'guest' ? user?.room_number : (user?.cafe_name || 'Kalga')}
                    </p>
                  </div>
                )}
                
                {!isAuthenticated && (
                  <>
                    <div>
                      <Label htmlFor="customer_name">Your Name</Label>
                      <Input
                        id="customer_name"
                        value={checkoutForm.customer_name}
                        onChange={(e) => setCheckoutForm({...checkoutForm, customer_name: e.target.value})}
                        required
                        data-testid="checkout-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={checkoutForm.phone}
                        onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                        required
                        data-testid="checkout-phone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="delivery_address">Delivery Address (Room or Location in Kalga)</Label>
                      <Textarea
                        id="delivery_address"
                        value={checkoutForm.delivery_address}
                        onChange={(e) => setCheckoutForm({...checkoutForm, delivery_address: e.target.value})}
                        required
                        placeholder="e.g., Room 5 or Near Snowline Cafe"
                        data-testid="checkout-address"
                      />
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="special_instructions">Special Instructions (Optional)</Label>
                  <Textarea
                    id="special_instructions"
                    value={checkoutForm.special_instructions}
                    onChange={(e) => setCheckoutForm({...checkoutForm, special_instructions: e.target.value})}
                    placeholder="E.g., Extra spicy, no onions, etc."
                    data-testid="checkout-instructions"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6" data-testid="place-order-btn">
                Place Order - ₹{getTotalAmount()}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Subscription Dialog */}
      <Dialog open={subscriptionOpen} onOpenChange={setSubscriptionOpen}>
        <DialogContent className="max-w-2xl" data-testid="subscription-dialog">
          <DialogHeader>
            <DialogTitle className="text-2xl">Meal Subscription Plans</DialogTitle>
            <DialogDescription>
              Subscribe for daily meals and never worry about cooking again!
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubscription} className="space-y-6">
            <div className="bg-emerald-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Pricing</h3>
              <ul className="text-sm space-y-1 text-stone-700">
                <li>• Breakfast Only: ₹200/day</li>
                <li>• Lunch or Dinner: ₹350/day each</li>
                <li>• Full Day (All 3 meals): ₹800/day</li>
                <li>• Weekly Plans: 10% discount</li>
                <li>• Monthly Plans: 20% discount</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="sub_name">Your Name</Label>
                <Input
                  id="sub_name"
                  value={subscriptionForm.customer_name}
                  onChange={(e) => setSubscriptionForm({...subscriptionForm, customer_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sub_phone">Phone Number</Label>
                <Input
                  id="sub_phone"
                  type="tel"
                  value={subscriptionForm.phone}
                  onChange={(e) => setSubscriptionForm({...subscriptionForm, phone: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sub_address">Address in Kalga</Label>
                <Textarea
                  id="sub_address"
                  value={subscriptionForm.address}
                  onChange={(e) => setSubscriptionForm({...subscriptionForm, address: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label>Meal Preferences (Select all that apply)</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {['breakfast', 'lunch', 'dinner'].map(meal => (
                    <button
                      key={meal}
                      type="button"
                      onClick={() => toggleMealPreference(meal)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        subscriptionForm.meal_preferences.includes(meal)
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-stone-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        {getMealTimeIcon(meal)}
                        <span className="text-sm font-semibold mt-1 capitalize">{meal}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plan_type">Plan Type</Label>
                  <select
                    id="plan_type"
                    className="w-full p-2 border rounded-lg"
                    value={subscriptionForm.plan_type}
                    onChange={(e) => setSubscriptionForm({...subscriptionForm, plan_type: e.target.value})}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly (10% off)</option>
                    <option value="monthly">Monthly (20% off)</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={subscriptionForm.start_date}
                    onChange={(e) => setSubscriptionForm({...subscriptionForm, start_date: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price_per_day">Price Per Day (₹)</Label>
                  <Input
                    id="price_per_day"
                    type="number"
                    value={subscriptionForm.price_per_day}
                    onChange={(e) => setSubscriptionForm({...subscriptionForm, price_per_day: parseInt(e.target.value)})}
                    required
                    placeholder="e.g., 800 for all meals"
                  />
                </div>
                <div>
                  <Label htmlFor="total_paid">Amount Paid (₹)</Label>
                  <Input
                    id="total_paid"
                    type="number"
                    value={subscriptionForm.total_paid}
                    onChange={(e) => setSubscriptionForm({...subscriptionForm, total_paid: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6">
              Subscribe Now
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Auth Modal */}
      <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
        <DialogContent className="max-w-md" data-testid="auth-modal">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isSignup ? 'Create Account' : 'Login'}
            </DialogTitle>
            <DialogDescription>
              {isSignup 
                ? 'Create an account to track your orders and enjoy faster checkout'
                : 'Login to continue ordering delicious food from Hemu\'s kitchen'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <Label htmlFor="auth-name">Name *</Label>
                <Input
                  id="auth-name"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                  required
                  placeholder="Enter your name"
                  data-testid="auth-name-input"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="auth-phone">Phone Number *</Label>
              <Input
                id="auth-phone"
                type="tel"
                value={authForm.phone}
                onChange={(e) => setAuthForm({...authForm, phone: e.target.value})}
                required
                placeholder="Enter your phone number"
                data-testid="auth-phone-input"
              />
            </div>

            {isSignup && (
              <>
                <div>
                  <Label>I am a *</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="user_type"
                        value="guest"
                        checked={authForm.user_type === 'guest'}
                        onChange={(e) => setAuthForm({...authForm, user_type: e.target.value, cafe_name: ''})}
                        className="w-4 h-4 text-emerald-600"
                      />
                      <span>Guest at Banjara</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="user_type"
                        value="traveler"
                        checked={authForm.user_type === 'traveler'}
                        onChange={(e) => setAuthForm({...authForm, user_type: e.target.value, room_number: ''})}
                        className="w-4 h-4 text-emerald-600"
                      />
                      <span>Traveler in Kalga</span>
                    </label>
                  </div>
                </div>

                {authForm.user_type === 'guest' && (
                  <div>
                    <Label htmlFor="room-number">Room Number *</Label>
                    <select
                      id="room-number"
                      className="w-full p-2 border rounded-lg"
                      value={authForm.room_number}
                      onChange={(e) => setAuthForm({...authForm, room_number: e.target.value})}
                      required
                      data-testid="room-select"
                    >
                      <option value="">Select your room</option>
                      <option value="Attic Room 1">Attic Room 1</option>
                      <option value="Attic Room 2">Attic Room 2</option>
                    </select>
                  </div>
                )}

                {authForm.user_type === 'traveler' && (
                  <div>
                    <Label htmlFor="cafe-name">Cafe/Place Name (Optional)</Label>
                    <Input
                      id="cafe-name"
                      value={authForm.cafe_name}
                      onChange={(e) => setAuthForm({...authForm, cafe_name: e.target.value})}
                      placeholder="e.g., Snowline Cafe"
                      data-testid="cafe-name-input"
                    />
                    <p className="text-xs text-stone-500 mt-1">Where are you staying in Kalga?</p>
                  </div>
                )}
              </>
            )}

            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-lg"
              data-testid="auth-submit-btn"
            >
              {isSignup ? 'Create Account' : 'Login'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="text-sm text-emerald-600 hover:text-emerald-700 underline"
              >
                {isSignup 
                  ? 'Already have an account? Login' 
                  : 'Don\'t have an account? Sign up'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Food;
