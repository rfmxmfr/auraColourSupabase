// Client-side submission type
export interface ClientSubmission {
  id: string;
  userId: string;
  status: string;
  questionnaireResponses: string;
  photoDataUri: string;
  createdAt: Date;
  lastModified: Date;
}

// Server-side submission type (matches database schema)
export interface ServerSubmission {
  id: string;
  user_id: string;
  status: string;
  questionnaire_data: string;
  image_url: string;
  stripe_session_id?: string;
  created_at: Date;
  updated_at: Date;
}

// Conversion function to map server submission to client submission
export function mapServerToClientSubmission(serverSubmission: ServerSubmission): ClientSubmission {
  return {
    id: serverSubmission.id,
    userId: serverSubmission.user_id,
    status: serverSubmission.status,
    questionnaireResponses: typeof serverSubmission.questionnaire_data === 'string' 
      ? serverSubmission.questionnaire_data 
      : JSON.stringify(serverSubmission.questionnaire_data),
    photoDataUri: serverSubmission.image_url,
    createdAt: new Date(serverSubmission.created_at),
    lastModified: new Date(serverSubmission.updated_at)
  };
}

// Conversion function to map client submission to server submission
export function mapClientToServerSubmission(clientSubmission: ClientSubmission): Partial<ServerSubmission> {
  return {
    id: clientSubmission.id,
    user_id: clientSubmission.userId,
    status: clientSubmission.status,
    questionnaire_data: clientSubmission.questionnaireResponses,
    image_url: clientSubmission.photoDataUri,
    updated_at: clientSubmission.lastModified
  };
}