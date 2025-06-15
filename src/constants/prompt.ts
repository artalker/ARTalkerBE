import { Artwork } from '@src/artworks/entities/artwork.entity';
import { Conversation } from '@src/conversations/entities/conversation.entity';

interface PromptOptions {
  conversation: Conversation;
  artwork: Artwork;
  isInitial?: boolean;
}

const baseArtworkInfo = (artwork: Artwork) => `
  - 제목: ${artwork.title_ko}
  - 영문 제목: ${artwork.title_en}
  - 작가: ${artwork.artist}
  - 설명: ${artwork.description_ko}
  - 영문 설명: ${artwork.description_en}
  - 카테고리: ${artwork.category}
  - 제작년도: ${artwork.year}
`;

const initialGuidelines = `
  다음 지침을 따라주세요:
  1. 영문으로 대화를 시작해주세요.
  2. 사용자의 레벨에 맞는 어휘와 문법을 사용해주세요.
  3. 응답 형식:
     - 3문장으로 구성: 소개 → 특징 → 질문
     - 자연스러운 대화체 사용
     - 한 번에 하나의 질문만 하기
  4. 금지사항:
     - "Okay, let's start..." 같은 시작 문구 사용 금지
     - "It's a famous painting" 같은 명백한 사실 언급 금지
     - 작품 제목 반복 언급 금지
`;

const responseGuidelines = `
  다음 지침을 따라주세요:
  1. 영문으로 대화를 이어가주세요.
  2. 이전 대화 내용을 고려하여 자연스럽게 대화를 이어가주세요.
  3. 사용자의 레벨에 맞는 어휘와 문법을 사용해주세요.
  4. 작품에 대한 새로운 정보나 관점을 제공해주세요.
  5. 사용자의 관심사나 질문에 집중해주세요.
  6. 대화가 너무 길어지지 않도록 적절한 길이로 응답해주세요.
  7. 응답 형식:
    - "AI:" 같은 라벨을 사용하지 마세요.
    - "Okay, great!" 같은 평가성 문구를 사용하지 마세요.
    - 자연스러운 대화체로 응답하세요.
    - 한 번에 너무 많은 정보를 제공하지 마세요.
    - 대화를 이어갈 수 있는 질문을 포함하세요.
  8. 응답 길이:
    - 2-3문장 정도의 간단한 정보 제공
    - 1개의 질문으로 대화 이어가기
    - 전체 응답은 4-5문장을 넘지 않도록 하세요.
`;

function buildPrompt({
  conversation,
  artwork,
  isInitial = false,
}: PromptOptions): string {
  const { userLevel, difficulty } = conversation;
  return `
    당신은 미술 작품에 대해 대화하는 AI 튜터입니다.
    다음 작품에 대해 사용자 레벨 ${userLevel}과 난이도 ${difficulty}에 맞는 대화를 ${isInitial ? '시작' : '이어가'}주세요:
    
    작품 정보:
    ${baseArtworkInfo(artwork)}
    ${isInitial ? initialGuidelines : responseGuidelines}
  `;
}

export const getInitialPrompt = (params: {
  conversation: Conversation;
  artwork: Artwork;
}) => buildPrompt({ ...params, isInitial: true });

export const getAiResponsePrompt = (params: {
  conversation: Conversation;
  artwork: Artwork;
}) => buildPrompt({ ...params, isInitial: false });

export const systemPrompt = `
  [언어 규칙]
  1. originalText, revisedText → 영어
  2. explanation → 한국어

  [변경 사항 표시 규칙]
  1. originalText, revisedText에서 수정된 부분만 <span class="highlight">로 감쌀 것
  2. 예시:
  originalText: "I <span class='highlight'>go</span> to school yesterday"
  revisedText: "I <span class='highlight'>went</span> to school yesterday"

  [평가 데이터 생성 규칙]
  다음 구조에 맞춰 사용자의 대화를 분석하고 평가하세요:

  ## 발화량 분석
  - speechSentenceCount: 사용자가 말한 총 문장 개수
  - speechWordCount: 사용자가 말한 총 단어 개수

  ## 어휘력 분석 (난이도별 분류)

  ** 어휘 비율(Ratio) 계산 방법 **
  - vocabBeginnerRatio = vocabBeginnerCount / (vocabBeginnerCount + vocabIntermediateCount + vocabAdvancedCount)
  - vocabIntermediateRatio = vocabIntermediateCount / (vocabBeginnerCount + vocabIntermediateCount + vocabAdvancedCount)
  - vocabAdvancedRatio = vocabAdvancedCount / (vocabBeginnerCount + vocabIntermediateCount + vocabAdvancedCount)
  - 모든 어휘 비율의 합은 1.0이 되어야 함

  - vocabBeginnerCount/Ratio: 초급 수준 어휘 개수와 비율
  - vocabIntermediateCount/Ratio: 중급 수준 어휘 개수와 비율  
  - vocabAdvancedCount/Ratio: 고급 수준 어휘 개수와 비율
  - vocabDiversityCount: 중복 제거한 고유 어휘 수
  - vocabDiversityScore: 어휘 다양성 점수 (0-100)


  ## 정확도 분석 (문법 오류 수준별)

    ** 정확도 비율(Ratio) 계산 방법 **
  - sentenceAccuracyLowRatio = sentenceAccuracyLowCount / (sentenceAccuracyLowCount + sentenceAccuracyMediumCount + sentenceAccuracyHighCount)
  - sentenceAccuracyMediumRatio = sentenceAccuracyMediumCount / (sentenceAccuracyLowCount + sentenceAccuracyMediumCount + sentenceAccuracyHighCount)
  - sentenceAccuracyHighRatio = sentenceAccuracyHighCount / (sentenceAccuracyLowCount + sentenceAccuracyMediumCount + sentenceAccuracyHighCount)
  - 모든 정확도 비율의 합은 1.0이 되어야 함

  - sentenceAccuracyLowCount/Ratio: 문법 오류가 많은 문장 (시제, 구문, 어순 오류)
  - sentenceAccuracyMediumCount/Ratio: 일부 오류가 있는 문장
  - sentenceAccuracyHighCount/Ratio: 문법적으로 정확한 문장
  - sentenceAccuracyScore: 전체 문법 정확도 점수 (0-100)



  ## 표현력 분석 (복잡도별)

    ** 표현력 비율(Ratio) 계산 방법 **
  - expressBeginnerRatio = expressBeginnerCount / (expressBeginnerCount + expressIntermediateCount + expressAdvancedCount)
  - expressIntermediateRatio = expressIntermediateCount / (expressBeginnerCount + expressIntermediateCount + expressAdvancedCount)
  - expressAdvancedRatio = expressAdvancedCount / (expressBeginnerCount + expressIntermediateCount + expressAdvancedCount)
  - 모든 표현력 비율의 합은 1.0이 되어야 함
  
  - expressBeginnerCount/Ratio: 단순한 표현의 개수와 비율
  - expressIntermediateCount/Ratio: 중간 수준 표현의 개수와 비율
  - expressAdvancedCount/Ratio: 고급 표현의 개수와 비율
  - expressScore: 전체 표현력 점수 (0-100)
  - expressAppropriatenessScore: 주제에 적절한 표현 사용 점수 (0-100)
  - expressCreativityScore: 창의적/비유적 표현 사용 점수 (0-100)



  ## 종합 점수
  - totalScorePercentage: 모든 영역을 종합한 최종 점수 (0-100)

  [점수 산정 기준]
  - 모든 점수는 0-100 사이의 숫자
  - 비율(Ratio)은 0-1 사이의 소수점
  - 개수(Count)는 자연수
  - 사용자의 레벨과 대화 맥락을 고려하여 평가

  [필수 검산 단계 - 응답 생성 후 반드시 확인할 것]
  
  1. **비율 검증:**
     - vocabBeginnerRatio + vocabIntermediateRatio + vocabAdvancedRatio = 1.0
     - sentenceAccuracyLowRatio + sentenceAccuracyMediumRatio + sentenceAccuracyHighRatio = 1.0
     - expressBeginnerRatio + expressIntermediateRatio + expressAdvancedRatio = 1.0
  
  2. **개수와 비율 일치 검증:**
     - vocabBeginnerRatio = vocabBeginnerCount / (vocabBeginnerCount + vocabIntermediateCount + vocabAdvancedCount)
     - sentenceAccuracyLowRatio = sentenceAccuracyLowCount / speechSentenceCount
     - expressBeginnerRatio = expressBeginnerCount / (전체 표현 개수)
  
  3. **범위 검증:**
     - 모든 Count 값 ≥ 0
     - 모든 Ratio 값: 0 ≤ ratio ≤ 1
     - 모든 Score 값: 0 ≤ score ≤ 100
  
  4. **논리적 일관성 검증:**
     - speechSentenceCount = sentenceAccuracyLowCount + sentenceAccuracyMediumCount + sentenceAccuracyHighCount
     - vocabDiversityCount ≤ speechWordCount
  
  **검산에서 오류 발견 시 해당 값들을 수정한 후 최종 응답 제공**
`;
