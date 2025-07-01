# 🎮 Levels System (레벨 시스템)

ARTalker의 경험치 및 레벨 관리 시스템입니다.

## 📊 시스템 개요

- **7단계 레벨 시스템**: 관찰자(1) → 거장(7)
- **대화 완료 시 자동 경험치 지급**: `endConversation` API 호출 시
- **레벨 차이 기반 경험치 계산**: 유저 레벨 vs 대화 난이도 비교

## 🚀 API 엔드포인트

### 레벨 정보 조회

```bash
# 모든 레벨 정보 조회
GET /levels

# 사용자 현재 레벨 정보
GET /levels/user/:userId

# 사용자 경험치 통계 (레벨 진행도, 최근 획득 내역 등)
GET /levels/user/:userId/stats

# 사용자 경험치 획득 히스토리
GET /levels/user/:userId/history
```

### 경험치 관리

```bash
# 경험치 수동 지급 (관리자용)
POST /levels/user/:userId/experience
{
  "experienceGained": 15,
  "experienceType": "conversation_complete",
  "conversationId": 123,
  "difficulty": 3,
  "bonusReason": "도전적인 대화 보너스"
}

# 대화 경험치 미리 계산
POST /levels/calculate-conversation-experience
{
  "userLevel": 2,
  "conversationLevel": 4
}
```

## 💫 경험치 계산 방식

### 레벨 차이 기반 계산

```
기본 경험치: 10

도전적인 대화 (대화 레벨 > 유저 레벨):
- 레벨 차이 +1: x1.5 (15 경험치)
- 레벨 차이 +2: x2.0 (20 경험치)
- 레벨 차이 +3: x2.5 (25 경험치)

적정 난이도 (대화 레벨 = 유저 레벨):
- x1.0 (10 경험치)

쉬운 대화 (대화 레벨 < 유저 레벨):
- 레벨 차이 -1: x0.8 (8 경험치)
- 레벨 차이 -2: x0.6 (6 경험치)
- 최소 1 경험치 보장
```

## 🎯 자동 경험치 지급

대화 종료 시 자동으로 경험치가 지급됩니다:

```bash
# 대화 종료 API 호출 시 자동 지급
PATCH /conversations/:id/end

# 응답 예시
{
  "id": 1045,
  "isComplete": true,
  "experienceGained": 25,
  "levelUp": false,
  "experienceBreakdown": [
    "기본 경험치: 10",
    "도전적인 대화 (레벨 차이 +3): x2.5"
  ],
  "oldLevel": 1,
  "newLevel": 1
}
```

## 📋 레벨 요구사항

| 레벨 | 이름                       | 필요 경험치 |
| ---- | -------------------------- | ----------- |
| 1    | 관찰자 (Observer)          | 0           |
| 2    | 탐험가 (Explorer)          | 100         |
| 3    | 학습자 (Learner)           | 250         |
| 4    | 대화가 (Conversationalist) | 500         |
| 5    | 예술가 (Artist)            | 1000        |
| 6    | 비평가 (Critic)            | 2000        |
| 7    | 거장 (Virtuoso)            | 4000        |
