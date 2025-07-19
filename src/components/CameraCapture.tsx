
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Camera, RefreshCcw, X, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface CameraCaptureProps {
  onCapture: (imageDataUri: string) => void;
  onCancel: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        onCapture(dataUri);
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Take a Photo</CardTitle>
            <CardDescription>Position your face in the center of the frame.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                <canvas ref={canvasRef} className="hidden" />
                {hasCameraPermission === false && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Alert variant="destructive" className="max-w-sm">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access in your browser settings to use this feature.
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
            </div>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>
                <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleCapture} disabled={hasCameraPermission !== true}>
                <Camera className="mr-2 h-4 w-4" /> Capture Photo
            </Button>
        </CardFooter>
    </Card>
  );
}
