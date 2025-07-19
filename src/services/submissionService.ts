// src/services/submissionService.ts
'use server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, getDoc, serverTimestamp, query, where, orderBy, Timestamp, updateDoc, limit } from 'firebase/firestore';

export type SubmissionStatus = 'draft' | 'pending_payment' | 'paid' | 'in progress' | 'completed';

export interface Submission {
  id: string;
  userId: string;
  status: SubmissionStatus;
  questionnaireResponses: string;
  photoDataUri: string;
  stripeSessionId?: string;
  createdAt: Date;
  lastModified: Date;
}

export async function createDraftSubmission(userId: string): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'submissions'), {
      userId,
      status: 'draft',
      questionnaireResponses: '',
      photoDataUri: '',
      createdAt: serverTimestamp(),
      lastModified: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating draft submission: ", error);
    throw new Error("Failed to start submission.");
  }
}

export async function findActiveDraftSubmission(userId: string): Promise<Submission | null> {
    try {
        const q = query(
            collection(db, "submissions"), 
            where('userId', '==', userId),
            where('status', '==', 'draft'),
            orderBy("lastModified", "desc"),
            limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
            const lastModified = data.lastModified instanceof Timestamp ? data.lastModified.toDate() : new Date();
            return {
                id: doc.id,
                ...data,
                createdAt,
                lastModified,
            } as Submission;
        }
        return null;
    } catch (error) {
        console.error("Error finding active draft submission: ", error);
        throw new Error("Failed to look for existing drafts.");
    }
}


export async function updateDraftSubmission(submissionId: string, data: Partial<Omit<Submission, 'id' | 'userId' | 'createdAt'>>) {
    try {
        const docRef = doc(db, 'submissions', submissionId);
        await updateDoc(docRef, {
            ...data,
            lastModified: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error updating draft submission: ", error);
        throw new Error("Failed to save progress.");
    }
}


export async function finalizeSubmissionForPayment(submissionId: string, questionnaireResponses: string, photoDataUri: string): Promise<void> {
  try {
    const docRef = doc(db, 'submissions', submissionId);
    await updateDoc(docRef, {
      questionnaireResponses,
      photoDataUri,
      status: 'pending_payment',
      lastModified: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error finalizing submission: ", error);
    throw new Error("Failed to finalize submission for payment.");
  }
}

export async function getSubmissions(statuses: SubmissionStatus[]): Promise<Submission[]> {
  try {
    const q = query(
      collection(db, "submissions"), 
      where('status', 'in', statuses),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const submissions: Submission[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
        const lastModified = data.lastModified instanceof Timestamp ? data.lastModified.toDate() : new Date();
        submissions.push({
            id: doc.id,
            userId: data.userId,
            questionnaireResponses: data.questionnaireResponses,
            photoDataUri: data.photoDataUri,
            createdAt,
            lastModified,
            status: data.status,
        });
    });
    return submissions;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw new Error("Failed to get submissions.");
  }
}

export async function getSubmission(id: string): Promise<Submission | null> {
    try {
        const docRef = doc(db, 'submissions', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
            const lastModified = data.lastModified instanceof Timestamp ? data.lastModified.toDate() : new Date();
            return {
                id: docSnap.id,
                ...data,
                createdAt,
                lastModified,
            } as Submission;
        }
        return null;
    } catch (error) {
        console.error("Error getting document: ", error);
        throw new Error("Failed to get submission.");
    }
}


export async function updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<void> {
    try {
        const docRef = doc(db, 'submissions', id);
        await updateDoc(docRef, { status, lastModified: serverTimestamp() });
    } catch (error) {
        console.error("Error updating status: ", error);
        throw new Error("Failed to update submission status.");
    }
}

export async function addStripeSessionId(submissionId: string, stripeSessionId: string): Promise<void> {
    try {
        const docRef = doc(db, 'submissions', submissionId);
        await updateDoc(docRef, { stripeSessionId, lastModified: serverTimestamp() });
    } catch (error) {
        console.error("Error adding Stripe session ID: ", error);
        throw new Error("Failed to link Stripe session to submission.");
    }
}
