export interface InterviewSession {
  id: string;
  orgId?: string;
  title?: string;
  status: InterviewStatus;
  scheduledAt?: string;
  startedAt?: string;
  endedAt?: string;
  durationMinutes: number;
  roomId: string;
  inviteToken?: string;
  notes?: string;
  recordingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type InterviewStatus =
  | 'SCHEDULED'
  | 'WAITING'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface InterviewParticipant {
  id: string;
  interviewId: string;
  userId?: string;
  role: ParticipantRole;
  joinedAt?: string;
  leftAt?: string;
  guestName?: string;
  guestEmail?: string;
}

export type ParticipantRole = 'interviewer' | 'candidate' | 'observer';

export interface InterviewFeedbackData {
  id: string;
  interviewId: string;
  reviewerId?: string;
  candidateId?: string;
  overallScore?: number;
  problemSolving?: number;
  codeQuality?: number;
  communication?: number;
  technicalKnowledge?: number;
  hireDecision?: HireDecision;
  strengths?: string;
  improvements?: string;
  privateNotes?: string;
  submittedAt: string;
}

export type HireDecision = 'strong_yes' | 'yes' | 'no' | 'strong_no';

export interface CreateInterviewDto {
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  questionIds?: string[];
  candidateEmail?: string;
  candidateName?: string;
}

export interface InterviewWithParticipants extends InterviewSession {
  participants: InterviewParticipant[];
}
