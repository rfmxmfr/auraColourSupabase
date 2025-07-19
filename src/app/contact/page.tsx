
'use client';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Send, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState } from 'react';
import { submitContactFormAction } from '../actions';
import { toast } from 'sonner';


const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  subject: z.string().min(1, { message: "Please select a subject." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const result = await submitContactFormAction(values);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Message Sent!", {
        description: "Thank you for contacting us. We will get back to you shortly.",
      });
      form.reset();
    } else {
      toast.error("Submission Failed", {
        description: result.error || "An unknown error occurred. Please try again.",
      });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 text-gray-800">
      <Header />

      <section
        className="pt-32 pb-20"
      >
        <div
          className="max-w-6xl mx-auto px-6 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
          >
            Contact
            <span
              className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Aura Colours
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Ready to discover your perfect colors? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-white/50 backdrop-blur-xl border-white/30 shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <p className="text-gray-600">aurastyle.contact@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <Phone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Phone</p>
                      <p className="text-gray-600">+44 7700 900000</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Location</p>
                      <p className="text-gray-600">Glasgow, Scotland</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur-xl border-white/30 shadow-lg rounded-2xl">
                 <CardHeader>
                  <CardTitle className="text-2xl">Business Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Monday - Friday</span>
                        <span className="font-semibold text-gray-900">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Saturday</span>
                        <span className="font-semibold text-gray-900">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Sunday</span>
                        <span className="font-semibold text-gray-900">Closed</span>
                    </div>
                    <div className="mt-6 pt-4 border-t border-purple-100">
                        <p className="text-sm text-purple-700 font-medium text-center">
                            ⏰ Response within 24 hours guaranteed
                        </p>
                    </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="bg-white/50 backdrop-blur-xl border-white/30 shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Send a Message</CardTitle>
                  <CardDescription>We'll get back to you as soon as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>Subject</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="color-analysis">Color Analysis Consultation</SelectItem>
                                    <SelectItem value="style-consultation">Style Consultation</SelectItem>
                                    <SelectItem value="virtual-wardrobe">Virtual Wardrobe Service</SelectItem>
                                    <SelectItem value="personal-shopping">Personal Shopping</SelectItem>
                                    <SelectItem value="general">General Inquiry</SelectItem>
                                </SelectContent>
                                </Select>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                       <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                               <Textarea rows={5} placeholder="Tell us about your style goals and how we can help..." {...field}/>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4" />}
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
