# 그린퀴즈 OpenRouter 설정

그린퀴즈 신규 문제는 OpenRouter, 챌린지 사진 심사는 Groq를 사용합니다.
최근 실천 및 이전 문제를 이용한 맞춤 출제, 하루 한 문제 저장, 서버 채점과 포인트 지급은 유지합니다.
이미 저장된 오늘의 문제는 다시 생성하지 않습니다.

## 키 준비

1. https://openrouter.ai/settings/keys 에 로그인하여 API 키를 만듭니다.
2. Supabase 프로젝트 → Edge Functions → Secrets에 `OPENROUTER_API_KEY` 이름으로 등록합니다.
3. `OPENROUTER_QUIZ_MODEL`은 기본 `openrouter/free`입니다. 무료 모델만 선택하는 라우터입니다. 무료 요청 한도 및 혼잡에 따른 제한이 있으며, 유료 모델로 자동 전환하지 않습니다. 다른 모델을 지정할 때도 `:free`로 끝나는 무료 모델 ID만 허용합니다.

키는 GitHub, 브라우저 코드, `.env.example`에 넣지 않습니다. 예제 파일 수정만으로 배포 서버에 키가 등록되지 않습니다.

## 서버 배포

프로젝트 루트에서 Supabase CLI 로그인 후 실행합니다.

```powershell
npx supabase login
npx supabase functions deploy greenstep-ai --project-ref dfgdtvgpnsyjhnsttibs
```

`greenstep-ai/index.ts`, `greenstep-ai/openrouter.ts`, 기존 `greenstep-chat/quiz.ts`가 함께 번들됩니다.
프런트 배포만으로 Edge Function이 갱신되지는 않습니다. 기존 Groq Secret은 사진 인증에 계속 필요합니다.

## 확인

키 등록 및 함수 배포 이후, 오늘 문제가 아직 없는 로그인 계정에서 그린퀴즈를 엽니다. 무료 모델은 크레딧 충전 없이 요청 한도 내에서 사용합니다.
키 누락, 인증 오류, 크레딧 부족, 요청 제한을 구분하여 표시합니다.
정답과 해설은 기존과 같이 서버에서 관리하며 기존 채점 RPC를 통해 보상을 적립합니다.
실제 API 호출 확인 전에는 연결 완료로 간주하지 않습니다.

참고: https://openrouter.ai/docs/api/api-reference/chat/send-chat-completion-request
