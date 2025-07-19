
'use server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface FeedbackData {
  rating: number;
  comment: string;
  page: string;
}

export async function saveFeedback(feedback: FeedbackData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'feedback'), {
      ...feedback,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding feedback document: ", error);
    throw new Error("Failed to save feedback.");
  }
}
