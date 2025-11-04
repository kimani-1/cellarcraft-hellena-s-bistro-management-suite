import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth-store';
import { Wine } from 'lucide-react';
import { toast } from 'sonner';
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
type LoginFormInputs = z.infer<typeof loginSchema>;
export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'owner@cellarcraft.com',
      password: 'password',
    },
  });
  const onSubmit = async (data: LoginFormInputs) => {
    // Mock authentication
    if (data.email === 'owner@cellarcraft.com' && data.password === 'password') {
      toast.success('Login Successful', { description: "Welcome back to Hellena's Bistro!" });
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      login();
      navigate('/');
    } else {
      toast.error('Login Failed', { description: 'Invalid email or password.' });
    }
  };
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')]">
      <div className="absolute inset-0 bg-black/50" />
      <Card className="w-full max-w-md z-10 bg-card/50 backdrop-blur-lg border-border/50 shadow-glow-lg animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Wine className="h-12 w-12 text-gold" />
          </div>
          <CardTitle className="text-3xl font-display font-bold text-gold">Hellena's Bistro</CardTitle>
          <CardDescription className="text-muted-foreground">Enter your credentials to access the management suite.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="owner@cellarcraft.com"
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-gold text-charcoal hover:bg-gold/90" disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}