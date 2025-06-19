import { z } from 'zod/v3'; // openai 버전 문제로 인해 사용 (zodTextFormat)
export const aiResponseSchema = z.object({
  output_text: z.string().describe('AI 응답 텍스트'),
  ko_content: z.string().describe('AI 응답 한국어 텍스트'),
});

export const resultSchema = z
  .object({
    ratings: z.object({
      // 발화량
      speechSentenceCount: z.number().int().positive().describe('총 문장 수'),
      speechWordCount: z.number().int().positive().describe('총 단어 수'),

      // 어휘력 (Vocabulary)
      // 초급 어휘
      vocabBeginnerCount: z.number().int().positive().describe('초급 어휘 수'),
      vocabBeginnerRatio: z.number().describe('초급 어휘 비율'),
      // 중급 어휘
      vocabIntermediateCount: z
        .number()
        .int()
        .positive()
        .describe('중급 어휘 수'),
      vocabIntermediateRatio: z.number().describe('중급 어휘 비율'),
      // 고급 어휘
      vocabAdvancedCount: z.number().int().positive().describe('고급 어휘 수'),
      vocabAdvancedRatio: z.number().describe('고급 어휘 비율'),
      // 어휘 다양도
      vocabDiversityCount: z
        .number()
        .int()
        .positive()
        .describe('어휘 다양도 수'),
      vocabDiversityScore: z.number().describe('어휘 다양도 점수'),

      // 정확도 (Accuracy)
      sentenceAccuracyLowCount: z
        .number()
        .int()
        .positive()
        .describe('시제, 구문, 어순 오류 많은 문장 갯수'),
      sentenceAccuracyLowRatio: z
        .number()
        .describe('시제, 구문, 어순 오류 많은 문장 비율'),

      sentenceAccuracyMediumCount: z
        .number()
        .int()
        .positive()
        .describe('일부 오류 있는 문장 갯수'),
      sentenceAccuracyMediumRatio: z
        .number()
        .describe('일부 오류 있는 문장 비율'),
      sentenceAccuracyHighCount: z
        .number()
        .int()
        .positive()
        .describe('오류 없는 정확한 문장 갯수'),
      sentenceAccuracyHighRatio: z
        .number()
        .describe('오류 없는 정확한 문장 비율'),

      sentenceAccuracyScore: z.number().describe('문장 정확도 점수'),

      // 표현력 (Expressiveness)
      expressBeginnerCount: z
        .number()
        .int()
        .positive()
        .describe('초급 표현력 수'),
      expressBeginnerRatio: z.number().describe('초급 표현력 비율'),
      expressIntermediateCount: z
        .number()
        .int()
        .positive()
        .describe('중급 표현력 수'),
      expressIntermediateRatio: z.number().describe('중급 표현력 비율'),
      expressAdvancedCount: z
        .number()
        .int()
        .positive()
        .describe('고급 표현력 수'),
      expressAdvancedRatio: z.number().describe('고급 표현력 비율'),
      expressScore: z.number().describe('표현력 점수'),
      expressAppropriatenessScore: z
        .number()
        .describe('주제 표현의 적절성 점수'),
      expressCreativityScore: z.number().describe('창의적, 비유적 표현 점수'),

      // 종합 점수
      totalScorePercentage: z
        .number()
        .min(0)
        .max(100)
        .describe('종합점수 (100점 기준)'),
    }),

    feedback: z.object({
      originalText: z.string().describe('원본 문장'),
      revisedText: z.string().describe('수정된 문장'),
      explanation: z.string().describe('수정 이유를 한국어로 설명'),
    }),
  })
  .strict();
