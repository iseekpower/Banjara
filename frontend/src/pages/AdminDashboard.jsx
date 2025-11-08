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
import { LogOut, Mountain, Utensils, Home, HelpCircle, Shield, Calendar, ChefHat, Package, Bell } from 'lucide-react';
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
  
  const [menuDialog, setMenuDialog] = useState(false);
  const [faqDialog, setFaqDialog] = useState(false);
  const [ruleDialog, setRuleDialog] = useState(false);
  const [announcementDialog, setAnnouncementDialog] = useState(false);
  
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const fetchAllData = async () => {
    try {
      const [treks, bbqs, rooms, menu, faqsData, rulesData, orders, subs, anns] = await Promise.all([
        axios.get(`${API}/bookings/trek`),
        axios.get(`${API}/bookings/bbq`),
        axios.get(`${API}/inquiries/room`),
        axios.get(`${API}/menu`),
        axios.get(`${API}/faqs`),
        axios.get(`${API}/rules`),
        axios.get(`${API}/orders/food`),
        axios.get(`${API}/subscriptions`),
        axios.get(`${API}/announcements`)
      ]);

      setTrekBookings(treks.data);
      setBbqBookings(bbqs.data);
      setRoomInquiries(rooms.data);
      setMenuItems(menu.data);
      setFaqs(faqsData.data);
      setRules(rulesData.data);
      setFoodOrders(orders.data);
      setSubscriptions(subs.data);
      setAnnouncements(anns.data);
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
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6" data-testid="admin-tabs">
            <TabsTrigger value="bookings" data-testid="bookings-tab">
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="treks" data-testid="treks-tab">
              <Mountain className="w-4 h-4 mr-2" />
              Treks
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

          {/* Trek Bookings */}
          <TabsContent value="treks" className="space-y-4">
            <Card data-testid="trek-bookings-card">
              <CardHeader>
                <CardTitle>Trek Bookings</CardTitle>
                <CardDescription>Manage trek reservations</CardDescription>
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
    </div>
  );
};

export default AdminDashboard;
