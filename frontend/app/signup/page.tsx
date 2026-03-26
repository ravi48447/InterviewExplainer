'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KeyRound, Mail, User, Briefcase, Code2, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchDomains, Domain } from '@/lib/api';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    domainId: '',
    experienceLevel: ''
  });
  
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetchDomains().then(setDomains).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const user = await signup({
        ...formData,
        domainId: parseInt(formData.domainId)
      });
      if (user.domainSlug) {
        router.push(`/${user.domainSlug}`);
      } else {
        router.push('/domains');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-4 py-12 bg-slate-50/50 dark:bg-slate-950/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex space-x-2">
                <div className={`h-2 w-8 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
                <div className={`h-2 w-8 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {step === 1 ? 'Join the Community' : 'Personalize Your Path'}
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              {step === 1 
                ? 'Create an account to start tracking your interview readiness' 
                : 'Help us tailor the interview preparation to your specific goals'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30">
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="name"
                          placeholder="Ravi Shankar"
                          value={formData.name}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="domainId">Primary Domain</Label>
                      <Select 
                        value={formData.domainId} 
                        onValueChange={(val) => handleSelectChange('domainId', val)}
                      >
                        <SelectTrigger className="pl-10 relative">
                          <Code2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <SelectValue placeholder="Select a domain" />
                        </SelectTrigger>
                        <SelectContent>
                          {domains.map((domain) => (
                            <SelectItem key={domain.id} value={domain.id.toString()}>
                              {domain.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experienceLevel">Experience Level</Label>
                      <Select 
                        value={formData.experienceLevel} 
                        onValueChange={(val) => handleSelectChange('experienceLevel', val)}
                      >
                        <SelectTrigger className="pl-10 relative">
                          <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="E0_0_TO_1">0-1 Years (Entry)</SelectItem>
                          <SelectItem value="E1_1_TO_3">1-3 Years (Junior)</SelectItem>
                          <SelectItem value="E2_3_TO_5">3-5 Years (Mid-Level)</SelectItem>
                          <SelectItem value="E3_5_PLUS">5+ Years (Senior)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4 pt-4">
                {step === 2 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setStep(1)}
                    className="w-1/3"
                  >
                    Back
                  </Button>
                )}
                <Button 
                  type="submit" 
                  className={`flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-6 transition-all duration-200 shadow-lg shadow-blue-500/20`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      {step === 1 ? 'Continue' : 'Complete Registration'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">
                  Already have an account?
                </span>
              </div>
            </div>
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full py-6 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                Sign In Instead
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
