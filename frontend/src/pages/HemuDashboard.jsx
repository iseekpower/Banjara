import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { LogOut, ChefHat, Mountain, Home, RefreshCw } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HemuDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [foodOrders, setFoodOrders] = useState([]);
  const [trekBookings, setTrekBookings] = useState([]);
  const [roomInquiries, setRoomInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Check for persistent login on mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('hemuLoggedIn');
    if (isLoggedIn === 'true') {
      setIsAuthenticated(true);
      requestNotificationPermission();
    }
  }, []);

  // Set up polling and notifications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
      requestNotificationPermission();
      
      // Poll for new orders every 30 seconds
      const pollInterval = setInterval(() => {
        fetchAllData(true); // Pass true to indicate this is a background poll
      }, 30000);

      return () => clearInterval(pollInterval);
    }
  }, [isAuthenticated]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      if (permission === 'granted') {
        toast.success('Notifications enabled! You\'ll be alerted for new orders.');
      }
    }
  };

  const sendNotification = (title, body) => {
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [200, 100, 200],
        tag: 'order-notification'
      });
      
      // Play a sound (optional)
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTcIGmm98OScTgwOUKfl8LZjHAU5k9n0y3ojBSh+zPLaizsKFFuz6OyrWBELTKXh8bllHgU2jdXzzn0pBSh+zPDaizsKFFuz6OyrWBELTKXh8bllHgU2jdXzzn0pBSh+zPDaizsKFFuz6OyrWBELTKXh8bllHgU2jdXzzn0pBSh+zPDaizsKFFuz6OyrWBELTKXh8bllHgU2jdXzzn0pBSh+zPDaizsKFFuz6OyrWBELTKXh8bllHgU2jdXzzn0pBSh+zPDaizsKFFuz6OyrWBELTKXh8bllHgU2jdXzzn0pBSh+zPDaizsKFFuz6OyrWBELTKXh8bllHgU2jdXzzn0pBSh+zPDaizsKFFuz6OyrWBELTKXh8bllHgU2jdXzzn0pBSh+zPDaizsKFFuz6OyrWBELTKXh8bllHgU2jdXzzn0pBQ==');
      audio.play().catch(() => {}); // Ignore errors if sound fails
    }
  };

  const fetchAllData = async (isBackgroundPoll = false) => {
    if (!isBackgroundPoll) {
      setLoading(true);
    }
    
    try {
      const [orders, treks, rooms] = await Promise.all([
        axios.get(`${API}/orders/food`),
        axios.get(`${API}/bookings/trek`),
        axios.get(`${API}/inquiries/room`)
      ]);

      const newOrders = orders.data;
      
      // Check for new orders and send notification
      if (isBackgroundPoll && lastOrderCount > 0 && newOrders.length > lastOrderCount) {
        const newOrderCount = newOrders.length - lastOrderCount;
        const pendingOrders = newOrders.filter(o => o.status === 'pending').length;
        
        sendNotification(
          `🔔 ${newOrderCount} New Order${newOrderCount > 1 ? 's' : ''} Received!`,
          `You have ${pendingOrders} pending order${pendingOrders !== 1 ? 's' : ''} to prepare.`
        );
        
        // Play sound and vibrate
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
      }
      
      setLastOrderCount(newOrders.length);
      setFoodOrders(newOrders);
      setTrekBookings(treks.data);
      setRoomInquiries(rooms.data);
    } catch (error) {
      if (!isBackgroundPoll) {
        toast.error('Failed to fetch data');
      }
    } finally {
      if (!isBackgroundPoll) {
        setLoading(false);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Simple password check (you can add backend validation)
    const hemuPassword = 'hemu-chef-2024';
    
    if (password === hemuPassword) {
      setIsAuthenticated(true);
      toast.success('Welcome, Hemu!');
    } else {
      toast.error('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleUpdateFoodOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API}/orders/food/${orderId}/status?status=${newStatus}`);
      toast.success(`Order marked as ${newStatus}`);
      fetchAllData();
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const handleUpdateTrekStatus = async (bookingId, newStatus) => {
    try {
      // Update trek booking status - you may need to add this endpoint to backend
      await axios.put(`${API}/bookings/trek/${bookingId}`, { status: newStatus });
      toast.success(`Trek marked as ${newStatus}`);
      fetchAllData();
    } catch (error) {
      toast.error('Failed to update trek status');
    }
  };

  const getOrderStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrekStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-600 to-teal-600">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-10 h-10 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl">Hemu's Dashboard</CardTitle>
            <CardDescription>Enter your password to access</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="text-lg"
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Mobile-optimized Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Hemu's Dashboard</h1>
              <p className="text-xs text-emerald-100">Banjara Barracks</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={fetchAllData}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                disabled={loading}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile-optimized Tabs */}
      <main className="pb-20">
        <Tabs defaultValue="food-orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sticky top-16 z-40 bg-white shadow-md">
            <TabsTrigger value="food-orders" className="text-xs py-3">
              <div className="flex flex-col items-center gap-1">
                <ChefHat className="w-4 h-4" />
                <span>Food</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="trek-bookings" className="text-xs py-3">
              <div className="flex flex-col items-center gap-1">
                <Mountain className="w-4 h-4" />
                <span>Treks</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="room-bookings" className="text-xs py-3">
              <div className="flex flex-col items-center gap-1">
                <Home className="w-4 h-4" />
                <span>Rooms</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Food Orders Tab */}
          <TabsContent value="food-orders" className="p-4 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Food Orders</h2>
              <Badge variant="secondary">{foodOrders.length} orders</Badge>
            </div>
            
            {foodOrders.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-stone-500">
                  No food orders yet
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {foodOrders.map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-emerald-500">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-base">{order.customer_name}</p>
                          <p className="text-sm text-stone-600">{order.phone}</p>
                          {order.room_number && (
                            <p className="text-xs text-stone-500">Room: {order.room_number}</p>
                          )}
                          {order.delivery_address && (
                            <p className="text-xs text-stone-500">{order.delivery_address}</p>
                          )}
                        </div>
                        <Badge className={getOrderStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      
                      <div className="bg-stone-50 p-3 rounded-lg mb-3">
                        <p className="text-xs font-semibold text-stone-700 mb-2">Items:</p>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-sm flex justify-between">
                            <span>{item.name} x{item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                        <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
                          <span>Total</span>
                          <span>₹{order.total_amount}</span>
                        </div>
                      </div>

                      {order.special_instructions && (
                        <p className="text-xs text-stone-600 mb-3 italic">
                          Note: {order.special_instructions}
                        </p>
                      )}

                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <div className="grid grid-cols-2 gap-2">
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateFoodOrderStatus(order.id, 'preparing')}
                              className="bg-blue-600 hover:bg-blue-700 text-xs"
                            >
                              Start Preparing
                            </Button>
                          )}
                          {order.status === 'preparing' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateFoodOrderStatus(order.id, 'ready')}
                              className="bg-green-600 hover:bg-green-700 text-xs"
                            >
                              Mark Ready
                            </Button>
                          )}
                          {order.status === 'ready' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateFoodOrderStatus(order.id, 'delivered')}
                              className="bg-gray-600 hover:bg-gray-700 text-xs"
                            >
                              Mark Delivered
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleUpdateFoodOrderStatus(order.id, 'cancelled')}
                            className="text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Trek Bookings Tab */}
          <TabsContent value="trek-bookings" className="p-4 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Trek Bookings</h2>
              <Badge variant="secondary">{trekBookings.length} bookings</Badge>
            </div>

            {trekBookings.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-stone-500">
                  No trek bookings yet
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {trekBookings.map((booking) => (
                  <Card key={booking.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-base">{booking.trek_name}</p>
                          <p className="text-sm text-stone-600">{booking.full_name}</p>
                          <p className="text-xs text-stone-500">{booking.phone}</p>
                        </div>
                        <Badge className={getTrekStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>

                      <div className="bg-stone-50 p-3 rounded-lg mb-3 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-stone-600">Date:</span>
                          <span className="font-semibold">{booking.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-600">People:</span>
                          <span className="font-semibold">{booking.person_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-600">Cost:</span>
                          <span className="font-semibold text-emerald-600">₹{booking.cost}</span>
                        </div>
                      </div>

                      {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                        <div className="grid grid-cols-2 gap-2">
                          {booking.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateTrekStatus(booking.id, 'confirmed')}
                              className="bg-blue-600 hover:bg-blue-700 text-xs"
                            >
                              Confirm Trek
                            </Button>
                          )}
                          {booking.status === 'confirmed' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateTrekStatus(booking.id, 'completed')}
                              className="bg-green-600 hover:bg-green-700 text-xs"
                            >
                              Mark Completed
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleUpdateTrekStatus(booking.id, 'cancelled')}
                            className="text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Room Bookings Tab */}
          <TabsContent value="room-bookings" className="p-4 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Room Inquiries</h2>
              <Badge variant="secondary">{roomInquiries.length} inquiries</Badge>
            </div>

            {roomInquiries.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-stone-500">
                  No room inquiries yet
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {roomInquiries.map((inquiry) => (
                  <Card key={inquiry.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-base">{inquiry.full_name}</p>
                          <p className="text-sm text-stone-600">{inquiry.phone}</p>
                          <p className="text-xs text-stone-500">{inquiry.email}</p>
                        </div>
                        <Badge variant="outline">
                          {inquiry.status}
                        </Badge>
                      </div>

                      <div className="bg-stone-50 p-3 rounded-lg mb-2 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-stone-600">Check-in:</span>
                          <span className="font-semibold">{inquiry.check_in}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-600">Check-out:</span>
                          <span className="font-semibold">{inquiry.check_out}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-600">Guests:</span>
                          <span className="font-semibold">{inquiry.guest_count}</span>
                        </div>
                        {inquiry.room_type && (
                          <div className="flex justify-between">
                            <span className="text-stone-600">Room Type:</span>
                            <span className="font-semibold">{inquiry.room_type}</span>
                          </div>
                        )}
                      </div>

                      {inquiry.message && (
                        <p className="text-xs text-stone-600 italic bg-stone-50 p-2 rounded">
                          "{inquiry.message}"
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default HemuDashboard;
