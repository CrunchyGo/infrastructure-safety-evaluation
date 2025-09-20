'use client';
import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { LoginSchema, type LoginFormData } from '@/schemas/validation';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Shield, Building2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/service';
import toast from 'react-hot-toast';

const Login = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const { mutate: loginMutation, isPending: isLoginPending } = useLogin({
    onSuccess: (data) => {
      console.log('data', data);
      login(data.data.data.user.udiseCode);
      toast.success('Login Successful');
      router.push('/');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      udiseCode: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const formData = {
      udise_code: data.udiseCode,
      password: data.password,
    }

    loginMutation(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="heading-1 text-white mb-2">Infrastructure Safety Evaluation</h1>
          <p className="body-large text-white/80">Secure access to school safety inspections</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-form border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="heading-3">Login to ISE System</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="udiseCode" className="text-sm font-medium text-foreground">
                  UDISE Code
                </Label>
                <Input
                  id="udiseCode"
                  type="text"
                  placeholder="Enter 6+ digit UDISE code"
                  {...register('udiseCode')}
                  className={errors.udiseCode ? 'border-destructive' : ''}
                  disabled={isLoginPending}
                />
                {errors.udiseCode && (
                  <p className="text-sm text-destructive">{errors.udiseCode.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register('password')}
                  className={errors.password ? 'border-destructive' : ''}
                  disabled={isLoginPending}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="professional"
                size="lg"
                className="w-full"
                disabled={isLoginPending}
              >
                {isLoginPending ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;