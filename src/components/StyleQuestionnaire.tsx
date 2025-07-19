
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Submission, updateDraftSubmission } from '@/services/submissionService';
import { useDebouncedCallback } from 'use-debounce';


const styles = ["Casual", "Chic", "Bohemian", "Classic", "Trendy", "Minimalist"];
const colors = ["Reds/Pinks", "Blues/Greens", "Yellows/Oranges", "Purples", "Neutrals (Black, White, Gray)", "Earth Tones"];

const formSchema = z.object({
  style: z.string().min(1, 'Please select a style.'),
  colors: z.array(z.string()).min(1, 'Please select at least one color preference.'),
});

type FormData = z.infer<typeof formSchema>;

interface StyleQuestionnaireProps {
  initialData: Submission;
  onSubmit: (submissionId: string, formData: FormData, photoDataUri: string) => void;
}

const stepsConfig = [
    { name: 'Style', fields: ['style'] as const },
    { name: 'Colors', fields: ['colors'] as const },
    { name: 'Photo', fields: [] as const },
    { name: 'Review', fields: [] as const },
];
const TOTAL_STEPS = stepsConfig.length;

const parseStyle = (responses: string): string => {
    const match = responses.match(/Style: ([\w\s]+)/);
    return match ? match[1] : "";
}
const parseColors = (responses: string): string[] => {
    const match = responses.match(/Favorite Colors: ([\w\s,]+)/);
    return match ? match[1].split(',').map(c => c.trim()) : [];
}

export function StyleQuestionnaire({ initialData, onSubmit }: StyleQuestionnaireProps) {
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
        const payload: { questionnaireResponses?: string; photoDataUri?: string } = {};
        
        const responses: string[] = [];
        if (data.style) responses.push(`Style: ${data.style}`);
        if (data.colors && data.colors.length > 0) responses.push(`Favorite Colors: ${data.colors.join(', ')}`);
        
        if(responses.length > 0) payload.questionnaireResponses = responses.join('\n');
        if(photoUri) payload.photoDataUri = photoUri;

        if (Object.keys(payload).length > 0) {
            await updateDraftSubmission(submissionId, payload);
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
      onSubmit(submissionId, formData, photoDataUri);
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
    <Card className="w-full max-w-2xl mx-auto overflow-hidden">
       <CardHeader>
        <div className="mb-4">
            <div className="flex justify-between mb-2">
                {stepsConfig.map((s, index) => (
                    <div key={s.name} className="flex-1 text-center text-xs font-medium text-muted-foreground">
                        <span className={cn(index + 1 <= step && "text-primary")}>
                            {s.name}
                        </span>
                    </div>
                ))}
            </div>
            <Progress value={progressValue} className="w-full h-2" />
             <p className="text-sm text-muted-foreground text-center mt-2">
                Step {step} of {TOTAL_STEPS} - {currentStepInfo.name}
            </p>
        </div>
        <CardTitle>{stepsConfig[step - 1].name}</CardTitle>
        <CardDescription>
            {step === 1 && "What's your go-to aesthetic?"}
            {step === 2 && "Which colors are you drawn to?"}
            {step === 3 && "A clear, well-lit photo helps us provide the best analysis."}
            {step === 4 && "Review your information before proceeding to payment."}
        </CardDescription>
    </CardHeader>
      <CardContent className="min-h-[300px]">
        <Form {...form}>
            <AnimatePresence mode="wait">
                 <motion.div
                    key={step}
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
                 >
                    {step === 1 && (
                    <FormField
                        name="style"
                        control={control}
                        render={({ field }) => (
                        <FormItem>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {styles.map((style) => (
                                <FormItem key={style}>
                                <RadioGroupItem value={style} id={style} className="sr-only" />
                                <Label htmlFor={style} className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                    {style}
                                </Label>
                                </FormItem>
                            ))}
                            </RadioGroup>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {colors.map((color) => (
                                        <FormItem key={color} className="flex items-center space-x-2">
                                            <input type="checkbox" id={color} value={color}
                                                checked={field.value.includes(color)}
                                                onChange={(e) => {
                                                    const newColors = e.target.checked
                                                    ? [...field.value, color]
                                                    : field.value.filter((c) => c !== color);
                                                    field.onChange(newColors);
                                                }}
                                                className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                            <Label htmlFor={color} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">{color}</Label>
                                        </FormItem>
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    )}
                    {step === 3 && (
                        <div className="flex flex-col items-center gap-4">
                        <div 
                            onDragEnter={handleDrag} 
                            onDragLeave={handleDrag} 
                            onDragOver={handleDrag} 
                            onDrop={handleDrop}
                            className={cn(
                                "w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center relative overflow-hidden transition-colors",
                                dragActive ? "border-primary bg-primary/10" : "bg-muted/50"
                            )}
                        >
                            {photoPreview ? (
                                <Image src={photoPreview} alt="Photo preview" layout="fill" objectFit="cover" />
                            ) : (
                                <div className="text-center text-muted-foreground p-4">
                                    <UploadCloud className="mx-auto h-12 w-12" />
                                    <p className="mt-2 font-semibold">{dragActive ? "Drop the file here..." : "Drag & drop a photo or click to upload"}</p>
                                    <p className="text-xs">PNG, JPG up to 4MB</p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <Input id="photo" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="hidden" />
                            <Button asChild variant="outline">
                                <Label htmlFor="photo" className="cursor-pointer">{photoPreview ? "Change Photo" : "Choose File"}</Label>
                            </Button>
                            <Button variant="outline" onClick={() => setShowCamera(true)}>
                                <Camera className="mr-2 h-4 w-4" /> Use Camera
                            </Button>
                        </div>
                        <div className="p-4 bg-amber-50 border-l-4 border-amber-400 text-amber-800 text-sm rounded-r-lg">
                            <div className="flex">
                                <AlertTriangle className="h-5 w-5 mr-3"/>
                                <div>
                                    <p className="font-bold">Photo Tips for Best Results</p>
                                    <ul className="list-disc pl-5 mt-2">
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
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold">Your Style:</h3>
                                <p className="text-muted-foreground">{watchedValues.style}</p>
                            </div>
                            <div>
                                <h3 className="font-bold">Color Preferences:</h3>
                                <p className="text-muted-foreground">{watchedValues.colors.join(', ')}</p>
                            </div>
                            <div>
                                <h3 className="font-bold">Your Photo:</h3>
                                {photoPreview && <Image src={photoPreview} alt="Your photo" width={150} height={150} className="rounded-lg mt-2" />}
                            </div>
                            <div>
                                <h3 className="font-bold">Payment:</h3>
                                <p className="text-muted-foreground">A payment of £75 will be processed upon submission.</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={prevStep}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        ) : <div />}
        {step < TOTAL_STEPS ? (
          <Button onClick={nextStep}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            Proceed to Payment
            <CreditCard className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
