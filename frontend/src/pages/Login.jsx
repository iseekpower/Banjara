import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { User, Lock, Phone, Mountain } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Login state
  const [loginForm, setLoginForm] = useState({
    phone: '',
    password: ''
  });

  // Signup state
  const [signupForm, setSignupForm] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    user_type: 'guest',
    room_number: '',
    cafe_name: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await login(loginForm.phone, loginForm.password);
      
      // Redirect based on user type
      if (user.user_type === 'admin') {
        navigate('/admin-banjara-core');
      } else if (user.user_type === 'hemu') {
        navigate('/hemu-dashboard');
      } else {
        navigate('/food');
      }
      
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validation
    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (signupForm.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (signupForm.user_type === 'guest' && !signupForm.room_number) {
      toast.error('Please enter your room number');
      return;
    }

    setIsLoading(true);

    try {
      await signup({
        name: signupForm.name,
        phone: signupForm.phone,
        password: signupForm.password,
        user_type: signupForm.user_type,
        room_number: signupForm.user_type === 'guest' ? signupForm.room_number : null,
        cafe_name: signupForm.user_type === 'traveler' ? signupForm.cafe_name : null
      });
      
      toast.success('Account created successfully!');
      navigate('/food');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Mountain className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-stone-900 mb-2">Banjara Barracks</h1>
          <p className="text-stone-600">Welcome back! Please login to continue</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card className="border-0 shadow-2xl">
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your phone number and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-phone">Phone Number / Username</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                      <Input
                        id="login-phone"
                        type="text"
                        placeholder="Enter phone number or username"
                        value={loginForm.phone}
                        onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Admin and staff can use their username
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup">
            <Card className="border-0 shadow-2xl">
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Sign up to order food and book treks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={signupForm.phone}
                        onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password (min 6 characters)"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="Re-enter your password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>I am a</Label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="user_type"
                          value="guest"
                          checked={signupForm.user_type === 'guest'}
                          onChange={(e) => setSignupForm({ ...signupForm, user_type: e.target.value })}
                          className="w-4 h-4 text-emerald-600"
                        />
                        <span className="text-sm">Guest at Banjara</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="user_type"
                          value="traveler"
                          checked={signupForm.user_type === 'traveler'}
                          onChange={(e) => setSignupForm({ ...signupForm, user_type: e.target.value })}
                          className="w-4 h-4 text-emerald-600"
                        />
                        <span className="text-sm">Traveler in Kalga</span>
                      </label>
                    </div>
                  </div>

                  {signupForm.user_type === 'guest' && (
                    <div>
                      <Label htmlFor="room-number">Room Number</Label>
                      <Input
                        id="room-number"
                        type="text"
                        placeholder="e.g., Attic Room 1"
                        value={signupForm.room_number}
                        onChange={(e) => setSignupForm({ ...signupForm, room_number: e.target.value })}
                        required
                      />
                    </div>
                  )}

                  {signupForm.user_type === 'traveler' && (
                    <div>
                      <Label htmlFor="cafe-name">Where are you staying?</Label>
                      <Input
                        id="cafe-name"
                        type="text"
                        placeholder="e.g., Moon Dance Cafe"
                        value={signupForm.cafe_name}
                        onChange={(e) => setSignupForm({ ...signupForm, cafe_name: e.target.value })}
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
