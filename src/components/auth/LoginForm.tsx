
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, ArrowRight } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back to the attendance system."
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fill for testing
  const fillTestCredentials = () => {
    setEmail('hamza@tanseeq-investment.com');
    setPassword('password123');
  };

  return (
    <Card className="w-full border-0 shadow-none bg-transparent">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Enter your credentials to access the system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="pl-10" 
                required 
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button 
                type="button" 
                onClick={() => navigate('/forgot-password')} 
                className="text-sm text-tanseeq hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="pl-10" 
                required 
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              type="submit" 
              className="w-full bg-tanseeq hover:bg-tanseeq/90 mt-2 group" 
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : (
                <>
                  Login
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          className="w-full text-xs text-muted-foreground hover:bg-secondary/50" 
          onClick={fillTestCredentials}
        >
          Fill Test Credentials
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
