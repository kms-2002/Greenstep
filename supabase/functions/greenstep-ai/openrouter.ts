// Server only: never expose the OpenRouter key through VITE_* variables.
export async function generateQuiz(messages: unknown[]) {
  const key = Deno.env.get('OPENROUTER_API_KEY')?.trim();
  if (!key) throw new Error('퀴즈 AI 설정이 필요합니다. 관리자에게 OpenRouter API 키 등록을 요청해주세요.');
  const model = Deno.env.get('OPENROUTER_QUIZ_MODEL')?.trim() || 'openrouter/free';
  if (model !== 'openrouter/free' && !model.endsWith(':free')) {
    throw new Error('퀴즈는 무료 모델만 지원합니다. OPENROUTER_QUIZ_MODEL을 openrouter/free로 설정해주세요.');
  }
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'X-Title': 'GreenStep Quiz' },
    body: JSON.stringify({
      model,
      messages, response_format: { type: 'json_object' },
      provider: { require_parameters: true }, max_tokens: 2048,
    }),
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) {
    const errors: Record<number, string> = {
      401: 'OpenRouter API 키가 유효하지 않습니다. 관리자에게 문의해주세요.',
      402: 'OpenRouter 사용 크레딧이 부족합니다. 관리자에게 문의해주세요.',
      403: 'OpenRouter 모델 사용 권한을 확인해주세요.',
      429: '퀴즈 생성 요청 한도에 도달했습니다. 잠시 후 다시 시도해주세요.',
      502: '퀴즈 AI가 일시적으로 응답하지 않습니다. 잠시 후 다시 시도해주세요.',
      503: '선택한 퀴즈 모델을 사용할 수 없습니다. 관리자에게 문의해주세요.',
    };
    throw new Error(errors[response.status] || `퀴즈 AI 연결 오류(${response.status}). 관리자에게 문의해주세요.`);
  }
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (data.error || typeof content !== 'string' || data.choices?.[0]?.finish_reason === 'length') {
    throw new Error('완성된 퀴즈를 받지 못했습니다. 다시 시도해주세요.');
  }
  try { return JSON.parse(content); }
  catch { throw new Error('퀴즈 응답 형식을 읽지 못했습니다. 다시 시도해주세요.'); }
}
