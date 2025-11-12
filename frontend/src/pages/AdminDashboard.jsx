import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { LogOut, Mountain, Utensils, Home, HelpCircle, Shield, Calendar, ChefHat, Package, Bell, QrCode, Download, Printer, Image as ImageIcon, Plus, Edit, Trash2, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [trekBookings, setTrekBookings] = useState([]);
  const [bbqBookings, setBbqBookings] = useState([]);
  const [roomInquiries, setRoomInquiries] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [rules, setRules] = useState([]);
  const [foodOrders, setFoodOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [treks, setTreks] = useState([]);
  const [gallery, setGallery] = useState([]);
  
  const [menuDialog, setMenuDialog] = useState(false);
  const [faqDialog, setFaqDialog] = useState(false);
  const [ruleDialog, setRuleDialog] = useState(false);
  const [announcementDialog, setAnnouncementDialog] = useState(false);
  const [trekDialog, setTrekDialog] = useState(false);
  const [galleryDialog, setGalleryDialog] = useState(false);
  
  const [editingItem, setEditingItem] = useState(null);
  
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    description: '',
    event_type: 'other',
    event_date: '',
    active: true
  });

  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true
  });

  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    order: 0
  });

  const [ruleForm, setRuleForm] = useState({
    rule: '',
    order: 0
  });

  const [trekForm, setTrekForm] = useState({
    name: '',
    duration: '',
    difficulty: 'Easy',
    description: '',
    highlights: '',
    best_season: '',
    what_to_carry: '',
    images: '',
    altitude: '',
    distance: '',
    featured: false,
    active: true
  });

  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'nature'
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const fetchAllData = async () => {
    try {
      const [treks_data, bbqs, rooms, menu, faqsData, rulesData, orders, subs, anns, treksData, galleryData] = await Promise.all([
        axios.get(`${API}/bookings/trek`),
        axios.get(`${API}/bookings/bbq`),
        axios.get(`${API}/inquiries/room`),
        axios.get(`${API}/menu`),
        axios.get(`${API}/faqs`),
        axios.get(`${API}/rules`),
        axios.get(`${API}/orders/food`),
        axios.get(`${API}/subscriptions`),
        axios.get(`${API}/announcements`),
        axios.get(`${API}/treks`),
        axios.get(`${API}/gallery`)
      ]);

      setTrekBookings(treks_data.data);
      setBbqBookings(bbqs.data);
      setRoomInquiries(rooms.data);
      setMenuItems(menu.data);
      setFaqs(faqsData.data);
      setRules(rulesData.data);
      setFoodOrders(orders.data);
      setSubscriptions(subs.data);
      setAnnouncements(anns.data);
      setTreks(treksData.data);
      setGallery(galleryData.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/login`, { password });
      setIsAuthenticated(true);
      toast.success('Login successful');
    } catch (error) {
      toast.error('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...menuForm,
        price: menuForm.price ? parseInt(menuForm.price) : null
      };
      
      if (editingItem) {
        await axios.put(`${API}/menu/${editingItem}`, data);
        toast.success('Menu item updated');
      } else {
        await axios.post(`${API}/menu`, data);
        toast.success('Menu item added');
      }
      
      setMenuDialog(false);
      setEditingItem(null);
      setMenuForm({ name: '', description: '', price: '', category: '', available: true });
      fetchAllData();
    } catch (error) {
      toast.error('Failed to save menu item');
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${API}/menu/${id}`);
        toast.success('Menu item deleted');
        fetchAllData();
      } catch (error) {
        toast.error('Failed to delete menu item');
      }
    }
  };

  const handleEditMenuItem = (item) => {
    setEditingItem(item.id);
    setMenuForm({
      name: item.name,
      description: item.description || '',
      price: item.price?.toString() || '',
      category: item.category,
      available: item.available
    });
    setMenuDialog(true);
  };

  const handleAddFAQ = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`${API}/faqs/${editingItem}`, faqForm);
        toast.success('FAQ updated');
      } else {
        await axios.post(`${API}/faqs`, faqForm);
        toast.success('FAQ added');
      }
      
      setFaqDialog(false);
      setEditingItem(null);
      setFaqForm({ question: '', answer: '', order: 0 });
      fetchAllData();
    } catch (error) {
      toast.error('Failed to save FAQ');
    }
  };

  const handleDeleteFAQ = async (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await axios.delete(`${API}/faqs/${id}`);
        toast.success('FAQ deleted');
        fetchAllData();
      } catch (error) {
        toast.error('Failed to delete FAQ');
      }
    }
  };

  const handleEditFAQ = (faq) => {
    setEditingItem(faq.id);
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      order: faq.order
    });
    setFaqDialog(true);
  };

  const handleAddRule = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`${API}/rules/${editingItem}`, ruleForm);
        toast.success('Rule updated');
      } else {
        await axios.post(`${API}/rules`, ruleForm);
        toast.success('Rule added');
      }
      
      setRuleDialog(false);
      setEditingItem(null);
      setRuleForm({ rule: '', order: 0 });
      fetchAllData();
    } catch (error) {
      toast.error('Failed to save rule');
    }
  };

  const handleDeleteRule = async (id) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      try {
        await axios.delete(`${API}/rules/${id}`);
        toast.success('Rule deleted');
        fetchAllData();
      } catch (error) {
        toast.error('Failed to delete rule');
      }
    }
  };

  const handleEditRule = (rule) => {
    setEditingItem(rule.id);
    setRuleForm({
      rule: rule.rule,
      order: rule.order
    });
    setRuleDialog(true);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API}/orders/food/${orderId}/status?status=${newStatus}`);
      toast.success(`Order status updated to ${newStatus}`);
      fetchAllData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleUpdateSubscriptionStatus = async (subId, newStatus) => {
    try {
      await axios.put(`${API}/subscriptions/${subId}/status?status=${newStatus}`);
      toast.success(`Subscription status updated to ${newStatus}`);
      fetchAllData();
    } catch (error) {
      toast.error('Failed to update subscription status');
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/announcements`, announcementForm);
      toast.success('Announcement created successfully!');
      setAnnouncementDialog(false);
      setAnnouncementForm({
        title: '',
        description: '',
        event_type: 'other',
        event_date: '',
        active: true
      });
      fetchAllData();
    } catch (error) {
      toast.error('Failed to create announcement');
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await axios.delete(`${API}/announcements/${announcementId}`);
        toast.success('Announcement deleted');
        fetchAllData();
      } catch (error) {
        toast.error('Failed to delete announcement');
      }
    }
  };

  // Trek Management Handlers
  const handleAddTrek = async (e) => {
    e.preventDefault();
    try {
      const trekData = {
        ...trekForm,
        highlights: trekForm.highlights.split('\n').filter(h => h.trim()),
        what_to_carry: trekForm.what_to_carry.split('\n').filter(w => w.trim()),
        images: trekForm.images.split('\n').filter(i => i.trim()),
        price: 5000
      };
      
      if (editingItem) {
        await axios.put(`${API}/treks/${editingItem}`, trekData);
        toast.success('Trek updated');
      } else {
        await axios.post(`${API}/treks`, trekData);
        toast.success('Trek added');
      }
      
      setTrekDialog(false);
      setEditingItem(null);
      setTrekForm({
        name: '',
        duration: '',
        difficulty: 'Easy',
        description: '',
        highlights: '',
        best_season: '',
        what_to_carry: '',
        images: '',
        altitude: '',
        distance: '',
        featured: false,
        active: true
      });
      fetchAllData();
    } catch (error) {
      toast.error('Failed to save trek');
    }
  };

  const handleEditTrek = (trek) => {
    setEditingItem(trek.id);
    setTrekForm({
      name: trek.name,
      duration: trek.duration,
      difficulty: trek.difficulty,
      description: trek.description,
      highlights: trek.highlights.join('\n'),
      best_season: trek.best_season,
      what_to_carry: trek.what_to_carry.join('\n'),
      images: trek.images.join('\n'),
      altitude: trek.altitude || '',
      distance: trek.distance || '',
      featured: trek.featured,
      active: trek.active
    });
    setTrekDialog(true);
  };

  const handleDeleteTrek = async (trekId) => {
    if (window.confirm('Are you sure you want to delete this trek?')) {
      try {
        await axios.delete(`${API}/treks/${trekId}`);
        toast.success('Trek deleted');
        fetchAllData();
      } catch (error) {
        toast.error('Failed to delete trek');
      }
    }
  };

  // Gallery Management Handlers
  const handleAddGalleryImage = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/gallery`, galleryForm);
      toast.success('Image added to gallery');
      setGalleryDialog(false);
      setGalleryForm({
        title: '',
        description: '',
        image_url: '',
        category: 'nature'
      });
      fetchAllData();
    } catch (error) {
      toast.error('Failed to add image');
    }
  };

  const handleDeleteGalleryImage = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await axios.delete(`${API}/gallery/${imageId}`);
        toast.success('Image deleted');
        fetchAllData();
      } catch (error) {
        toast.error('Failed to delete image');
      }
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

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <Card className="w-full max-w-md" data-testid="admin-login-card">
          <CardHeader>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Enter password to access Banjara Core Dashboard</CardDescription>
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
                  data-testid="admin-password-input"
                />
              </div>
              <Button type="submit" className="w-full" data-testid="admin-login-btn">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="dashboard-title">Banjara Core Dashboard</h1>
            <p className="text-sm text-gray-600">Manage your homestay</p>
          </div>
          <Button onClick={handleLogout} variant="outline" data-testid="logout-btn">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-11" data-testid="admin-tabs">
            <TabsTrigger value="food-orders" data-testid="food-orders-tab">
              <ChefHat className="w-4 h-4 mr-2" />
              Food Orders
            </TabsTrigger>
            <TabsTrigger value="qr-code" data-testid="qr-code-tab">
              <QrCode className="w-4 h-4 mr-2" />
              QR Menu
            </TabsTrigger>
            <TabsTrigger value="subscriptions" data-testid="subscriptions-tab">
              <Package className="w-4 h-4 mr-2" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="announcements" data-testid="announcements-tab">
              <Bell className="w-4 h-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="bookings" data-testid="bookings-tab">
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="treks" data-testid="treks-tab">
              <Mountain className="w-4 h-4 mr-2" />
              Treks
            </TabsTrigger>
            <TabsTrigger value="gallery" data-testid="gallery-tab">
              <ImageIcon className="w-4 h-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="rooms" data-testid="rooms-tab">
              <Home className="w-4 h-4 mr-2" />
              Rooms
            </TabsTrigger>
            <TabsTrigger value="menu" data-testid="menu-tab">
              <Utensils className="w-4 h-4 mr-2" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="faqs" data-testid="faqs-tab">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="rules" data-testid="rules-tab">
              <Shield className="w-4 h-4 mr-2" />
              Rules
            </TabsTrigger>
          </TabsList>

          {/* QR Code Tab */}
          <TabsContent value="qr-code" className="space-y-4">
            <Card data-testid="qr-code-card" className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-6 h-6 text-emerald-600" />
                  Food Menu QR Code
                </CardTitle>
                <CardDescription>
                  Print and display this QR code at your homestay. Guests can scan it to access Hemu's food menu instantly!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl border-2 border-emerald-200">
                  <div className="text-center space-y-4">
                    <div className="bg-white p-6 rounded-xl inline-block shadow-lg">
                      <img 
                        src={`${API}/qr/food-menu`} 
                        alt="Food Menu QR Code"
                        className="w-64 h-64"
                        data-testid="qr-code-image"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-bold text-emerald-900">Hemu's by Banjara Barracks</p>
                      <p className="text-sm text-stone-600">Scan to order delicious food!</p>
                      <p className="text-xs text-stone-500 font-mono">mountain-retreat-6.preview.emergentagent.com/food</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <a 
                    href={`${API}/qr/food-menu`} 
                    download="hemu-menu-qr-code.png"
                    className="block"
                  >
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700" data-testid="download-qr-btn">
                      <Download className="w-4 h-4 mr-2" />
                      Download QR Code
                    </Button>
                  </a>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => window.print()}
                    data-testid="print-qr-btn"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print QR Code
                  </Button>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <h4 className="font-bold text-amber-900 mb-2">💡 Where to Display:</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• At reception desk</li>
                    <li>• In guest rooms (on table or wall)</li>
                    <li>• At the dining area</li>
                    <li>• Common areas and cafe</li>
                    <li>• Share in village WhatsApp groups for delivery orders</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h4 className="font-bold text-blue-900 mb-2">📱 How Customers Use It:</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Open camera or QR scanner on phone</li>
                    <li>Point at QR code</li>
                    <li>Click the notification to open menu</li>
                    <li>Browse Hemu's dishes and place order</li>
                    <li>Specify guest room or village address</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Food Orders */}
          <TabsContent value="food-orders" className="space-y-4">
            <Card data-testid="food-orders-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Hemu's Food Orders</CardTitle>
                    <CardDescription>Manage incoming orders and update preparation status</CardDescription>
                  </div>
                  <Badge className="bg-emerald-500">{foodOrders.length} Total Orders</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {foodOrders.map((order) => (
                        <TableRow key={order.id} data-testid={`food-order-${order.id}`}>
                          <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                          <TableCell>
                            <Badge variant="outline">{order.order_type}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold">{order.customer_name}</TableCell>
                          <TableCell>{order.phone}</TableCell>
                          <TableCell className="text-xs">
                            {order.order_type === 'guest' ? `Room ${order.room_number}` : order.delivery_address}
                          </TableCell>
                          <TableCell>
                            <div className="text-xs max-w-xs">
                              {order.items.map((item, idx) => (
                                <div key={idx}>{item.name} x{item.quantity}</div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="font-bold">₹{order.total_amount}</TableCell>
                          <TableCell className="text-xs">{order.estimated_time} min</TableCell>
                          <TableCell>
                            <Badge className={getOrderStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <select
                              className="text-xs border rounded p-1"
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              data-testid={`order-status-${order.id}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="preparing">Preparing</option>
                              <option value="ready">Ready</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </TableCell>
                        </TableRow>
                      ))}
                      {foodOrders.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center text-gray-500">
                            No food orders yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions */}
          <TabsContent value="subscriptions" className="space-y-4">
            <Card data-testid="subscriptions-card">
              <CardHeader>
                <CardTitle>Meal Subscriptions</CardTitle>
                <CardDescription>Manage recurring meal subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Meals</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Price/Day</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell className="font-semibold">{sub.customer_name}</TableCell>
                          <TableCell>{sub.phone}</TableCell>
                          <TableCell className="text-xs max-w-xs">{sub.address}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{sub.plan_type}</Badge>
                          </TableCell>
                          <TableCell className="text-xs">
                            {sub.meal_preferences.join(', ')}
                          </TableCell>
                          <TableCell>{sub.start_date}</TableCell>
                          <TableCell>₹{sub.price_per_day}</TableCell>
                          <TableCell>
                            <Badge className={sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {sub.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <select
                              className="text-xs border rounded p-1"
                              value={sub.status}
                              onChange={(e) => handleUpdateSubscriptionStatus(sub.id, e.target.value)}
                            >
                              <option value="active">Active</option>
                              <option value="paused">Paused</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </TableCell>
                        </TableRow>
                      ))}
                      {subscriptions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center text-gray-500">
                            No subscriptions yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements */}
          <TabsContent value="announcements" className="space-y-4">
            <Card data-testid="announcements-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Event Announcements</CardTitle>
                    <CardDescription>Create announcements for Jam Nights, Pizza Nights, BBQ, etc.</CardDescription>
                  </div>
                  <Button onClick={() => setAnnouncementDialog(true)} data-testid="add-announcement-btn">
                    Create Announcement
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="border p-4 rounded-lg flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg">{announcement.title}</h3>
                          <Badge variant="outline">{announcement.event_type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{announcement.description}</p>
                        {announcement.event_date && (
                          <p className="text-xs text-gray-500">Date: {announcement.event_date}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                  {announcements.length === 0 && (
                    <p className="text-center text-gray-500">No announcements yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BBQ Bookings */}
          <TabsContent value="bookings" className="space-y-4">
            <Card data-testid="bbq-bookings-card">
              <CardHeader>
                <CardTitle>BBQ Night Bookings</CardTitle>
                <CardDescription>Manage barbecue night reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>People</TableHead>
                        <TableHead>Requests</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bbqBookings.map((booking) => (
                        <TableRow key={booking.id} data-testid={`bbq-booking-${booking.id}`}>
                          <TableCell>{booking.date}</TableCell>
                          <TableCell>{booking.full_name}</TableCell>
                          <TableCell>{booking.email}</TableCell>
                          <TableCell>{booking.phone}</TableCell>
                          <TableCell>{booking.person_count}</TableCell>
                          <TableCell>{booking.special_requests || '-'}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                              {booking.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                      {bbqBookings.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-gray-500">
                            No BBQ bookings yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trek Management */}
          <TabsContent value="treks" className="space-y-4">
            <Card data-testid="trek-management-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Trek Management</CardTitle>
                    <CardDescription>Add, edit, or remove treks</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingItem(null);
                    setTrekForm({
                      name: '',
                      duration: '',
                      difficulty: 'Easy',
                      description: '',
                      highlights: '',
                      best_season: '',
                      what_to_carry: '',
                      images: '',
                      altitude: '',
                      distance: '',
                      featured: false,
                      active: true
                    });
                    setTrekDialog(true);
                  }} className="bg-emerald-600 hover:bg-emerald-700" data-testid="add-trek-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Trek
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {treks.map((trek) => (
                    <Card key={trek.id} className="border-2">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold">{trek.name}</h3>
                              {trek.featured && (
                                <Badge className="bg-yellow-500 text-white">
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                              <Badge className={trek.active ? "bg-green-500" : "bg-gray-400"}>
                                {trek.active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-stone-600 mb-3">{trek.description}</p>
                            <div className="flex gap-4 text-sm text-stone-600">
                              <span>⏱️ {trek.duration}</span>
                              <span>📊 {trek.difficulty}</span>
                              {trek.altitude && <span>⛰️ {trek.altitude}</span>}
                              {trek.distance && <span>📏 {trek.distance}</span>}
                            </div>
                            <div className="mt-2 text-sm">
                              <span className="text-emerald-600 font-semibold">₹5,000 per person</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTrek(trek)}
                              data-testid={`edit-trek-${trek.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteTrek(trek.id)}
                              data-testid={`delete-trek-${trek.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {treks.length === 0 && (
                    <div className="text-center py-8 text-stone-500">
                      No treks added yet. Click "Add Trek" to get started.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Trek Bookings Card */}
            <Card data-testid="trek-bookings-card">
              <CardHeader>
                <CardTitle>Trek Bookings</CardTitle>
                <CardDescription>View trek reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Trek</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>People</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trekBookings.map((booking) => (
                        <TableRow key={booking.id} data-testid={`trek-booking-${booking.id}`}>
                          <TableCell className="font-semibold">{booking.trek_name}</TableCell>
                          <TableCell>{booking.date}</TableCell>
                          <TableCell>{booking.full_name}</TableCell>
                          <TableCell>{booking.email}</TableCell>
                          <TableCell>{booking.phone}</TableCell>
                          <TableCell>{booking.person_count}</TableCell>
                          <TableCell>₹{booking.cost}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                              {booking.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                      {trekBookings.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-gray-500">
                            No trek bookings yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Room Inquiries */}
          <TabsContent value="rooms" className="space-y-4">
            <Card data-testid="room-inquiries-card">
              <CardHeader>
                <CardTitle>Room Inquiries</CardTitle>
                <CardDescription>Manage room inquiries and availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Check-in</TableHead>
                        <TableHead>Check-out</TableHead>
                        <TableHead>Guests</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Room Type</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roomInquiries.map((inquiry) => (
                        <TableRow key={inquiry.id} data-testid={`room-inquiry-${inquiry.id}`}>
                          <TableCell>{inquiry.check_in}</TableCell>
                          <TableCell>{inquiry.check_out}</TableCell>
                          <TableCell>{inquiry.guest_count}</TableCell>
                          <TableCell>{inquiry.full_name}</TableCell>
                          <TableCell>{inquiry.email}</TableCell>
                          <TableCell>{inquiry.phone}</TableCell>
                          <TableCell>{inquiry.room_type || '-'}</TableCell>
                          <TableCell className="max-w-xs truncate">{inquiry.message || '-'}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                              {inquiry.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                      {roomInquiries.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center text-gray-500">
                            No room inquiries yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Management */}
          <TabsContent value="menu" className="space-y-4">
            <Card data-testid="menu-management-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Menu Management</CardTitle>
                    <CardDescription>Add and manage menu items</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingItem(null);
                    setMenuForm({ name: '', description: '', price: '', category: '', available: true });
                    setMenuDialog(true);
                  }} data-testid="add-menu-item-btn">
                    Add Menu Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {menuItems.map((item) => (
                        <TableRow key={item.id} data-testid={`menu-item-${item.id}`}>
                          <TableCell className="font-semibold">{item.name}</TableCell>
                          <TableCell className="max-w-xs truncate">{item.description || '-'}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.price ? `₹${item.price}` : '-'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${
                              item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {item.available ? 'Yes' : 'No'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditMenuItem(item)}
                                data-testid={`edit-menu-${item.id}`}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteMenuItem(item.id)}
                                data-testid={`delete-menu-${item.id}`}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {menuItems.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-500">
                            No menu items yet. Add your first item!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Management */}
          <TabsContent value="faqs" className="space-y-4">
            <Card data-testid="faq-management-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>FAQ Management</CardTitle>
                    <CardDescription>Add and manage frequently asked questions</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingItem(null);
                    setFaqForm({ question: '', answer: '', order: 0 });
                    setFaqDialog(true);
                  }} data-testid="add-faq-btn">
                    Add FAQ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="border p-4 rounded-lg" data-testid={`faq-${faq.id}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{faq.question}</h3>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditFAQ(faq)}
                            data-testid={`edit-faq-${faq.id}`}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteFAQ(faq.id)}
                            data-testid={`delete-faq-${faq.id}`}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                  {faqs.length === 0 && (
                    <p className="text-center text-gray-500">No FAQs yet. Add your first FAQ!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* House Rules Management */}
          <TabsContent value="rules" className="space-y-4">
            <Card data-testid="rules-management-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>House Rules Management</CardTitle>
                    <CardDescription>Add and manage house rules</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingItem(null);
                    setRuleForm({ rule: '', order: 0 });
                    setRuleDialog(true);
                  }} data-testid="add-rule-btn">
                    Add Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rules.map((rule) => (
                    <div key={rule.id} className="border p-3 rounded-lg flex justify-between items-center" data-testid={`rule-${rule.id}`}>
                      <p className="text-base">{rule.rule}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditRule(rule)}
                          data-testid={`edit-rule-${rule.id}`}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteRule(rule.id)}
                          data-testid={`delete-rule-${rule.id}`}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {rules.length === 0 && (
                    <p className="text-center text-gray-500">No rules yet. Add your first rule!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Menu Item Dialog */}
      <Dialog open={menuDialog} onOpenChange={(open) => {
        setMenuDialog(open);
        if (!open) {
          setEditingItem(null);
          setMenuForm({ name: '', description: '', price: '', category: '', available: true });
        }
      }}>
        <DialogContent data-testid="menu-item-dialog">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the menu item details' : 'Add a new item to your menu'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMenuItem} className="space-y-4">
            <div>
              <Label htmlFor="menu-name">Name</Label>
              <Input
                id="menu-name"
                value={menuForm.name}
                onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                required
                data-testid="menu-name-input"
              />
            </div>
            <div>
              <Label htmlFor="menu-description">Description</Label>
              <Textarea
                id="menu-description"
                value={menuForm.description}
                onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                data-testid="menu-description-input"
              />
            </div>
            <div>
              <Label htmlFor="menu-category">Category</Label>
              <Input
                id="menu-category"
                value={menuForm.category}
                onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                required
                placeholder="e.g., Continental, Local, Beverages"
                data-testid="menu-category-input"
              />
            </div>
            <div>
              <Label htmlFor="menu-price">Price (Optional)</Label>
              <Input
                id="menu-price"
                type="number"
                value={menuForm.price}
                onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                placeholder="Leave empty if price varies"
                data-testid="menu-price-input"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="menu-available"
                checked={menuForm.available}
                onChange={(e) => setMenuForm({ ...menuForm, available: e.target.checked })}
                className="w-4 h-4"
                data-testid="menu-available-input"
              />
              <Label htmlFor="menu-available">Available</Label>
            </div>
            <Button type="submit" className="w-full" data-testid="submit-menu-item">
              {editingItem ? 'Update' : 'Add'} Menu Item
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* FAQ Dialog */}
      <Dialog open={faqDialog} onOpenChange={(open) => {
        setFaqDialog(open);
        if (!open) {
          setEditingItem(null);
          setFaqForm({ question: '', answer: '', order: 0 });
        }
      }}>
        <DialogContent data-testid="faq-dialog">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the FAQ details' : 'Add a new frequently asked question'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddFAQ} className="space-y-4">
            <div>
              <Label htmlFor="faq-question">Question</Label>
              <Input
                id="faq-question"
                value={faqForm.question}
                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                required
                data-testid="faq-question-input"
              />
            </div>
            <div>
              <Label htmlFor="faq-answer">Answer</Label>
              <Textarea
                id="faq-answer"
                value={faqForm.answer}
                onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                required
                rows={4}
                data-testid="faq-answer-input"
              />
            </div>
            <div>
              <Label htmlFor="faq-order">Order (for sorting)</Label>
              <Input
                id="faq-order"
                type="number"
                value={faqForm.order}
                onChange={(e) => setFaqForm({ ...faqForm, order: parseInt(e.target.value) })}
                data-testid="faq-order-input"
              />
            </div>
            <Button type="submit" className="w-full" data-testid="submit-faq">
              {editingItem ? 'Update' : 'Add'} FAQ
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Rule Dialog */}
      <Dialog open={ruleDialog} onOpenChange={(open) => {
        setRuleDialog(open);
        if (!open) {
          setEditingItem(null);
          setRuleForm({ rule: '', order: 0 });
        }
      }}>
        <DialogContent data-testid="rule-dialog">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit House Rule' : 'Add House Rule'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the house rule' : 'Add a new house rule'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRule} className="space-y-4">
            <div>
              <Label htmlFor="rule-text">Rule</Label>
              <Textarea
                id="rule-text"
                value={ruleForm.rule}
                onChange={(e) => setRuleForm({ ...ruleForm, rule: e.target.value })}
                required
                rows={3}
                data-testid="rule-text-input"
              />
            </div>
            <div>
              <Label htmlFor="rule-order">Order (for sorting)</Label>
              <Input
                id="rule-order"
                type="number"
                value={ruleForm.order}
                onChange={(e) => setRuleForm({ ...ruleForm, order: parseInt(e.target.value) })}
                data-testid="rule-order-input"
              />
            </div>
            <Button type="submit" className="w-full" data-testid="submit-rule">
              {editingItem ? 'Update' : 'Add'} Rule
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Announcement Dialog */}
      <Dialog open={announcementDialog} onOpenChange={setAnnouncementDialog}>
        <DialogContent data-testid="announcement-dialog">
          <DialogHeader>
            <DialogTitle>Create Event Announcement</DialogTitle>
            <DialogDescription>
              Announce upcoming events like Jam Nights, Pizza Nights, BBQ, Bonfire
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <div>
              <Label htmlFor="ann-title">Event Title</Label>
              <Input
                id="ann-title"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                required
                placeholder="e.g., Live Jam Night with Local Artists"
                data-testid="announcement-title"
              />
            </div>
            <div>
              <Label htmlFor="ann-description">Description</Label>
              <Textarea
                id="ann-description"
                value={announcementForm.description}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, description: e.target.value })}
                required
                rows={3}
                placeholder="Describe the event"
                data-testid="announcement-description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ann-type">Event Type</Label>
                <select
                  id="ann-type"
                  className="w-full p-2 border rounded-lg"
                  value={announcementForm.event_type}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, event_type: e.target.value })}
                  data-testid="announcement-type"
                >
                  <option value="jam_night">Jam Night</option>
                  <option value="pizza_night">Pizza Night</option>
                  <option value="bbq">BBQ Night</option>
                  <option value="bonfire">Bonfire</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="ann-date">Event Date</Label>
                <Input
                  id="ann-date"
                  type="date"
                  value={announcementForm.event_date}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, event_date: e.target.value })}
                  data-testid="announcement-date"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" data-testid="submit-announcement">
              Create Announcement
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Trek Dialog */}
      <Dialog open={trekDialog} onOpenChange={(open) => {
        setTrekDialog(open);
        if (!open) {
          setEditingItem(null);
          setTrekForm({
            name: '',
            duration: '',
            difficulty: 'Easy',
            description: '',
            highlights: '',
            best_season: '',
            what_to_carry: '',
            images: '',
            altitude: '',
            distance: '',
            featured: false,
            active: true
          });
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="trek-dialog">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Trek' : 'Add New Trek'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update trek details' : 'Add a new trek to your offerings'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddTrek} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trek-name">Trek Name</Label>
                <Input
                  id="trek-name"
                  value={trekForm.name}
                  onChange={(e) => setTrekForm({ ...trekForm, name: e.target.value })}
                  required
                  placeholder="e.g., Kedarkantha Trek"
                  data-testid="trek-name-input"
                />
              </div>
              <div>
                <Label htmlFor="trek-duration">Duration</Label>
                <Input
                  id="trek-duration"
                  value={trekForm.duration}
                  onChange={(e) => setTrekForm({ ...trekForm, duration: e.target.value })}
                  required
                  placeholder="e.g., 5 Days 4 Nights"
                  data-testid="trek-duration-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trek-difficulty">Difficulty</Label>
                <select
                  id="trek-difficulty"
                  className="w-full p-2 border rounded-lg"
                  value={trekForm.difficulty}
                  onChange={(e) => setTrekForm({ ...trekForm, difficulty: e.target.value })}
                  data-testid="trek-difficulty-input"
                >
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Difficult">Difficult</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div>
                <Label htmlFor="trek-season">Best Season</Label>
                <Input
                  id="trek-season"
                  value={trekForm.best_season}
                  onChange={(e) => setTrekForm({ ...trekForm, best_season: e.target.value })}
                  placeholder="e.g., April to June, September to November"
                  data-testid="trek-season-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trek-altitude">Altitude (optional)</Label>
                <Input
                  id="trek-altitude"
                  value={trekForm.altitude}
                  onChange={(e) => setTrekForm({ ...trekForm, altitude: e.target.value })}
                  placeholder="e.g., 12,500 ft"
                  data-testid="trek-altitude-input"
                />
              </div>
              <div>
                <Label htmlFor="trek-distance">Distance (optional)</Label>
                <Input
                  id="trek-distance"
                  value={trekForm.distance}
                  onChange={(e) => setTrekForm({ ...trekForm, distance: e.target.value })}
                  placeholder="e.g., 20 km"
                  data-testid="trek-distance-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="trek-description">Description</Label>
              <Textarea
                id="trek-description"
                value={trekForm.description}
                onChange={(e) => setTrekForm({ ...trekForm, description: e.target.value })}
                required
                rows={3}
                placeholder="Describe the trek experience"
                data-testid="trek-description-input"
              />
            </div>

            <div>
              <Label htmlFor="trek-highlights">Highlights (one per line)</Label>
              <Textarea
                id="trek-highlights"
                value={trekForm.highlights}
                onChange={(e) => setTrekForm({ ...trekForm, highlights: e.target.value })}
                rows={4}
                placeholder="Summit views&#10;Alpine lakes&#10;Dense forests&#10;Local culture"
                data-testid="trek-highlights-input"
              />
            </div>

            <div>
              <Label htmlFor="trek-carry">What to Carry (one per line)</Label>
              <Textarea
                id="trek-carry"
                value={trekForm.what_to_carry}
                onChange={(e) => setTrekForm({ ...trekForm, what_to_carry: e.target.value })}
                rows={4}
                placeholder="Trekking shoes&#10;Warm clothes&#10;Rain gear&#10;Water bottle"
                data-testid="trek-carry-input"
              />
            </div>

            <div>
              <Label htmlFor="trek-images">Image URLs (one per line)</Label>
              <Textarea
                id="trek-images"
                value={trekForm.images}
                onChange={(e) => setTrekForm({ ...trekForm, images: e.target.value })}
                rows={3}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                data-testid="trek-images-input"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="trek-featured"
                  checked={trekForm.featured}
                  onChange={(e) => setTrekForm({ ...trekForm, featured: e.target.checked })}
                  className="w-4 h-4"
                  data-testid="trek-featured-input"
                />
                <Label htmlFor="trek-featured">Featured Trek</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="trek-active"
                  checked={trekForm.active}
                  onChange={(e) => setTrekForm({ ...trekForm, active: e.target.checked })}
                  className="w-4 h-4"
                  data-testid="trek-active-input"
                />
                <Label htmlFor="trek-active">Active</Label>
              </div>
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" data-testid="submit-trek">
              {editingItem ? 'Update' : 'Add'} Trek
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
