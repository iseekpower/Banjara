import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingBag, Clock, CheckCircle, XCircle, User, MapPin, Phone, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MyOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserData();
    }
  }, [isAuthenticated, user]);

  const fetchUserData = async () => {
    try {
      const [ordersRes, billingRes] = await Promise.all([
        axios.get(`${API}/users/${user.id}/orders`),
        axios.get(`${API}/users/${user.id}/billing`)
      ]);
      setOrders(ordersRes.data);
      setBilling(billingRes.data);
    } catch (error) {
      toast.error('Failed to load your orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'preparing': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'ready': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-gray-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Please Login</h2>
            <p className="text-stone-600 mb-4">You need to be logged in to view your orders</p>
            <Link to="/food">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Go to Food Menu
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/food" className="flex items-center text-emerald-600 hover:text-emerald-700 mb-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Food Menu
              </Link>
              <h1 className="text-3xl font-bold text-stone-900">My Profile & Orders</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-emerald-200">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-stone-600">Name</p>
                  <p className="font-semibold text-lg">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-600">Phone</p>
                  <p className="font-semibold flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    {user?.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-stone-600">Type</p>
                  <Badge className={user?.user_type === 'guest' ? 'bg-blue-500' : 'bg-purple-500'}>
                    {user?.user_type === 'guest' ? 'Guest at Banjara' : 'Traveler in Kalga'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-stone-600">
                    {user?.user_type === 'guest' ? 'Room' : 'Staying At'}
                  </p>
                  <p className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    {user?.user_type === 'guest' ? user?.room_number : (user?.cafe_name || 'Kalga')}
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-stone-600">Member Since</p>
                  <p className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    {new Date(user?.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-stone-600 mb-2">Total Spent on Food</p>
                  <p className="text-3xl font-bold text-emerald-600">₹{billing?.orders?.total_spent || 0}</p>
                  <p className="text-xs text-stone-500 mt-1">{billing?.orders?.count || 0} orders placed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-emerald-600" />
                  My Orders ({orders.length})
                </CardTitle>
                <CardDescription>Track all your food orders from Hemu's kitchen</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                    <p className="text-stone-500 mb-4">No orders yet</p>
                    <Link to="/food">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        Order Now
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border-2">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-sm text-stone-600">
                                {new Date(order.created_at).toLocaleDateString()} · {new Date(order.created_at).toLocaleTimeString()}
                              </p>
                              <p className="text-xs text-stone-500 mt-1">Order ID: {order.id.slice(0, 8)}</p>
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(order.status)}
                                {order.status}
                              </span>
                            </Badge>
                          </div>

                          <div className="bg-stone-50 p-4 rounded-lg mb-3">
                            <p className="text-sm font-semibold mb-2">Items:</p>
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm mb-1">
                                <span>{item.name} x{item.quantity}</span>
                                <span className="font-semibold">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                            {order.special_instructions && (
                              <p className="text-xs text-stone-600 mt-2 italic">
                                Note: {order.special_instructions}
                              </p>
                            )}
                          </div>

                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-stone-600">Total Amount</p>
                              <p className="text-2xl font-bold text-emerald-600">₹{order.total_amount}</p>
                            </div>
                            <div className="text-right text-sm text-stone-600">
                              <p>Cooking Time: {order.estimated_time} mins</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
