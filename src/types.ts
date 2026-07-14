export type UserPath = 'individual' | 'business';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  isSimulated?: boolean;
}

export interface WajihCase {
  id: string;
  title: string;
  pathType: UserPath;
  category: string;
  status: 'pending_docs' | 'under_review' | 'completed' | 'draft';
  progress: number; // 0 to 100
  createdAt: string;
  description: string;
  suggestedAction: string;
  generatedDocument?: string;
  requiredDocs: {
    name: string;
    submitted: boolean;
  }[];
}

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  type: string; // pdf, xlsx, png, docx
  status: 'analyzed' | 'analyzing' | 'error';
  analysisResult?: {
    summary: string;
    readinessScore: number;
    issuesFound: string[];
    recommendations: string[];
  };
}

export interface AlertItem {
  id: string;
  title: string;
  desc: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  date: string;
  badge: string;
}
