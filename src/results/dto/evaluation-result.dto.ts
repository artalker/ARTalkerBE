export interface EvaluationResult {
  period: string;
  totalSessions: string;
  type: string;
  [key: string]: string; // 동적 필드들을 위한 인덱스 시그니처
}
