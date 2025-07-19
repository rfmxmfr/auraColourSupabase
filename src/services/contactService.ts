
'use server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export async function saveContactInquiry(formData: ContactFormData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'contacts'), {
      ...formData,
      createdAt: serverTimestamp(),
      status: 'new', // to track if it's been read or actioned
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding contact inquiry document: ", error);
    throw new Error("Failed to save contact inquiry.");
  }
}
