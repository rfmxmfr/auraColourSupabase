'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, UploadCloud, CreditCard, Camera, AlertTriangle, Loader2 } from 'lucide-react';
import { CameraCapture } from './CameraCapture';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { updateDraftSubmission } from '@/services/submissionService';
import { ClientSubmission } from '@/types/submission';
import { useDebouncedCallback } from 'use-debounce';

const styles = ["Casual", "Chic", "Bohemian", "Classic", "Trendy", "Minimalist"];
const colors = ["Reds/Pinks", "Blues/Greens", "Yellows/Oranges", "Purples", "Neutrals (Black, White, Gray)", "Earth Tones"];

const formSchema = z.object({
  style: z.string().min(1, 'Please select a style.'),
  colors: z.array(z.string()).min(1, 'Please select at least one color preference.'),
  email: z.string().email('Please enter a valid email address').optional(),
});

type FormData = z.infer<typeof formSchema>;

interface StyleQuestionnaireProps {
  initialData: ClientSubmission;
  onSubmit: (submissionId: string, formData: FormData, photoDataUri: string, email?: string) => void;
}

const stepsConfig = [
    { name: 'Style', fields: ['style'] as const },
    { name: 'Colors', fields: ['colors'] as const },
    { name: 'Photo', fields: [] as const },
    { name: 'Review', fields: [] as const },
];
const TOTAL_STEPS = stepsConfig.length;

const parseStyle = (responses: string): string => {
    if (!responses) return "";
    try {
        // Try to parse as JSON first
        const parsed = JSON.parse(responses);
        return parsed.style || "";
    } catch (e) {
        // Fall back to regex for legacy format
        const match = responses.match(/Style: ([\w\s]+)/);
        return match ? match[1] : "";
    }
}

const parseColors = (responses: string): string[] => {
    if (!responses) return [];
    try {
        // Try to parse as JSON first
        const parsed = JSON.parse(responses);
        return Array.isArray(parsed.colors) ? parsed.colors : [];
    } catch (e) {
        // Fall back to regex for legacy format
        const match = responses.match(/Favorite Colors: ([\w\s,]+)/);
        return match ? match[1].split(',').map(c => c.trim()) : [];
    }
}

export function EnhancedQuestionnaire({ initialData, onSubmit }: StyleQuestionnaireProps) {
  const [step, setStep] = useState(1);
  const [submissionId, setSubmissionId] = useState<string>(initialData.id);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData.photoDataUri || null);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(initialData.photoDataUri || null);
  const [showCamera, setShowCamera] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      style: parseStyle(initialData.questionnaireResponses),
      colors: parseColors(initialData.questionnaireResponses),
    },
    mode: 'onChange'
  });

  const { control, trigger, getValues, watch, setValue } = form;

  // Auto-save logic
  const debouncedSave = useDebouncedCallback(async (data: Partial<FormData>, photoUri: string | null) => {
    if (submissionId) {
      try {
        // Convert to server format
        const serverPayload: { questionnaire_data?: any; image_url?: string } = {};
        
        if (data.style || (data.colors && data.colors.length > 0)) {
          serverPayload.questionnaire_data = {
            style: data.style,
            colors: data.colors
          };
        }
        
        if(photoUri) serverPayload.image_url = photoUri;

        if (Object.keys(serverPayload).length > 0) {
            await updateDraftSubmission(submissionId, serverPayload);
        }
      } catch (error) {
        // Silent fail for auto-save to not disrupt user experience
        console.error("Auto-save failed", error);
      }
    }
  }, 1500);

  const watchedValues = watch();
  useEffect(() => {
      debouncedSave(watchedValues, photoDataUri);
  }, [watchedValues, photoDataUri, debouncedSave]);

  const nextStep = async () => {
    const fieldsToValidate = stepsConfig[step - 1].fields;
    const isValid = fieldsToValidate.length > 0 ? await trigger(fieldsToValidate) : true;
    
    if (step === 3 && !photoDataUri) {
        toast.error("Photo Required", { description: "Please upload or take a photo to continue."});
        return;
    }

    if (isValid) {
      if (step < TOTAL_STEPS) {
        setStep(s => s + 1);
      }
    }
  };

  const prevStep = () => setStep(s => s - 1);

  const processFile = (file: File) => {
    if (file) {
      if(file.size > 4 * 1024 * 1024) { // 4MB limit
        toast.error("File too large", { description: "Please upload an image smaller than 4MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const result = loadEvent.target?.result as string;
        setPhotoPreview(result);
        setPhotoDataUri(result);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleCapture = (imageDataUri: string) => {
    setPhotoPreview(imageDataUri);
    setPhotoDataUri(imageDataUri);
    setShowCamera(false);
  };

  const handleSubmit = () => {
    if (photoDataUri && submissionId) {
      const formData = getValues();
      const email = formData.email;
      onSubmit(submissionId, formData, photoDataUri, email);
    } else {
        toast.error("Incomplete Submission", { description: "Please ensure all fields are filled and a photo is provided." });
    }
  };

  const progressValue = (step / TOTAL_STEPS) * 100;
  const currentStepInfo = stepsConfig[step - 1];
  
  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  if (showCamera) {
    return <CameraCapture onCapture={handleCapture} onCancel={() => setShowCamera(false)} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto questionnaire-container">
      {/* Progress bar and step indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {stepsConfig.map((s, index) => (
            <div 
              key={s.name} 
              className={cn(
                "flex flex-col items-center step-indicator",
                index + 1 <= step ? "text-primary active" : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2",
                index + 1 < step ? "bg-primary text-primary-foreground border-primary" : 
                index + 1 === step ? "border-primary text-primary" : 
                "border-muted-foreground text-muted-foreground"
              )}>
                {index + 1}
              </div>
              <span className="text-sm font-medium">{s.name}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-4">
          <Progress value={progressValue} className="h-2" />
        </div>
      </div>

      {/* Main content area with gradient background */}
      <div className="bg-gradient-to-br from-accent/50 to-background rounded-xl shadow-lg overflow-hidden">
        {/* Header section */}
        <div className="bg-primary text-primary-foreground p-6 text-center">
          <h2 className="text-2xl font-bold">{currentStepInfo.name}</h2>
          <p className="mt-2 opacity-90">
            {step === 1 && "What's your go-to aesthetic?"}
            {step === 2 && "Which colors are you drawn to?"}
            {step === 3 && "A clear, well-lit photo helps us provide the best analysis."}
            {step === 4 && "Review your information before proceeding to payment."}
          </p>
        </div>

        {/* Form content */}
        <div className="p-8 min-h-[400px]">
          <Form {...form}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                className="h-full"
              >
                {step === 1 && (
                  <FormField
                    name="style"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          {styles.map((style) => (
                            <div key={style} className="relative">
                              <RadioGroupItem value={style} id={style} className="peer sr-only" {...field} />
                              <Label 
                                htmlFor={style} 
                                className={cn(
                                  "flex flex-col items-center justify-center rounded-xl border-2 p-6 hover:border-primary transition-all duration-200",
                                  "cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10",
                                  "h-full text-center option-card",
                                  field.value === style ? "selected" : ""
                                )}
                              >
                                <div className="text-lg font-medium mb-2">{style}</div>
                                <div className="text-sm text-muted-foreground">
                                  {style === "Casual" && "Comfortable, relaxed everyday wear"}
                                  {style === "Chic" && "Elegant, sophisticated fashion"}
                                  {style === "Bohemian" && "Free-spirited, artistic expression"}
                                  {style === "Classic" && "Timeless, traditional pieces"}
                                  {style === "Trendy" && "Current fashion-forward looks"}
                                  {style === "Minimalist" && "Simple, clean aesthetic"}
                                </div>
                              </Label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {step === 2 && (
                  <FormField
                    name="colors"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {colors.map((color) => {
                            const isSelected = field.value.includes(color);
                            return (
                              <div 
                                key={color} 
                                className={cn(
                                  "flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 option-card",
                                  isSelected ? "border-primary bg-primary/10 selected" : "border-muted hover:border-primary/50"
                                )}
                                onClick={() => {
                                  const newColors = isSelected
                                    ? field.value.filter((c) => c !== color)
                                    : [...field.value, color];
                                  field.onChange(newColors);
                                }}
                              >
                                <div className={cn(
                                  "w-6 h-6 rounded-full mr-4 flex items-center justify-center border-2",
                                  isSelected ? "border-primary" : "border-muted-foreground"
                                )}>
                                  {isSelected && (
                                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium">{color}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {color === "Reds/Pinks" && "Passionate, energetic tones"}
                                    {color === "Blues/Greens" && "Calming, natural shades"}
                                    {color === "Yellows/Oranges" && "Warm, cheerful hues"}
                                    {color === "Purples" && "Creative, luxurious colors"}
                                    {color === "Neutrals (Black, White, Gray)" && "Timeless, versatile basics"}
                                    {color === "Earth Tones" && "Grounding, natural palette"}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {step === 3 && (
                  <div className="flex flex-col items-center gap-6">
                    <div 
                      onDragEnter={handleDrag} 
                      onDragLeave={handleDrag} 
                      onDragOver={handleDrag} 
                      onDrop={handleDrop}
                      className={cn(
                        "w-full h-72 border-2 border-dashed rounded-xl flex items-center justify-center relative overflow-hidden transition-colors photo-upload-area",
                        dragActive ? "border-primary bg-primary/10" : "border-muted bg-muted/30"
                      )}
                    >
                      {photoPreview ? (
                        <Image src={photoPreview} alt="Photo preview" layout="fill" objectFit="cover" />
                      ) : (
                        <div className="text-center p-6">
                          <UploadCloud className="mx-auto h-16 w-16 text-primary/60" />
                          <p className="mt-4 text-lg font-medium">{dragActive ? "Drop the file here..." : "Drag & drop a photo or click to upload"}</p>
                          <p className="mt-2 text-sm text-muted-foreground">PNG, JPG up to 4MB</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <Input id="photo" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="hidden" />
                      <Button asChild variant="outline" className="rounded-full px-6">
                        <Label htmlFor="photo" className="cursor-pointer">{photoPreview ? "Change Photo" : "Choose File"}</Label>
                      </Button>
                      <Button variant="outline" onClick={() => setShowCamera(true)} className="rounded-full px-6">
                        <Camera className="mr-2 h-4 w-4" /> Use Camera
                      </Button>
                    </div>
                    <div className="p-6 bg-amber-50 border-l-4 border-amber-400 text-amber-800 rounded-r-xl w-full">
                      <div className="flex">
                        <AlertTriangle className="h-6 w-6 mr-4 flex-shrink-0"/>
                        <div>
                          <p className="font-bold text-lg">Photo Tips for Best Results</p>
                          <ul className="list-disc pl-5 mt-3 space-y-2">
                            <li>Use natural daylight, avoid direct sun.</li>
                            <li>No makeup and hair pulled back from face.</li>
                            <li>A clear photo of your face is essential.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-background rounded-xl p-6 shadow-sm review-card">
                        <h3 className="text-xl font-bold mb-4 text-primary">Your Style</h3>
                        <p className="text-lg">{watchedValues.style}</p>
                      </div>
                      <div className="bg-background rounded-xl p-6 shadow-sm review-card">
                        <h3 className="text-xl font-bold mb-4 text-primary">Color Preferences</h3>
                        <p className="text-lg">{watchedValues.colors.join(', ')}</p>
                      </div>
                    </div>
                    <div className="bg-background rounded-xl p-6 shadow-sm review-card">
                      <h3 className="text-xl font-bold mb-4 text-primary">Your Photo</h3>
                      <div className="flex justify-center">
                        {photoPreview && (
                          <div className="relative w-48 h-48 rounded-xl overflow-hidden border-4 border-primary/20">
                            <Image src={photoPreview} alt="Your photo" layout="fill" objectFit="cover" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Email collection for anonymous users */}
                    {initialData.userId === 'anonymous' && (
                      <div className="bg-accent/30 rounded-xl p-6 review-card">
                        <h3 className="text-xl font-bold mb-4 text-primary">Your Results</h3>
                        <p className="mb-4">Enter your email to receive your analysis results:</p>
                        <FormField
                          name="email"
                          control={control}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex gap-4">
                                <Input 
                                  placeholder="your.email@example.com" 
                                  className="flex-1" 
                                  {...field} 
                                />
                              </div>
                              <FormMessage />
                              <p className="text-sm text-muted-foreground mt-2">
                                Optional: Provide your email to receive your results. You'll have the option to create an account after payment to access your results anytime.
                              </p>
                            </FormItem>
                          )}
                        />
                        <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                          <p className="text-sm">
                            <strong>Note:</strong> You don't need an account to take this quiz. Your results will be sent to your email if provided, or you can create an account after payment to access them anytime.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-primary/10 rounded-xl p-6 review-card">
                      <h3 className="text-xl font-bold mb-4 text-primary">Payment</h3>
                      <p className="text-lg">A payment of £75 will be processed upon submission.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </Form>
        </div>

        {/* Footer with navigation buttons */}
        <div className="p-6 bg-muted/30 flex justify-between">
          {step > 1 ? (
            <Button 
              variant="outline" 
              onClick={prevStep}
              className="rounded-full px-6 questionnaire-btn"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : <div />}
          
          {step < TOTAL_STEPS ? (
            <Button 
              onClick={nextStep}
              className="rounded-full px-8 bg-primary hover:bg-primary/90 questionnaire-btn"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              className="rounded-full px-8 bg-primary hover:bg-primary/90 questionnaire-btn"
            >
              Proceed to Payment
              <CreditCard className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}