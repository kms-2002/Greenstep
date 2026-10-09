const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type ChatMessage = { role: 'user' | 'model'; text: string };

const jsonResponse = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
});

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return jsonResponse({ error: 'POST 요청만 지원합니다.' }, 405);

  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) return jsonResponse({ error: '서버에 GEMINI_API_KEY가 설정되지 않았습니다.' }, 503);

  try {
    const body = await request.json();
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, 1000) : '';
    if (!message) return jsonResponse({ error: '질문 내용을 입력해 주세요.' }, 400);

    const history: ChatMessage[] = Array.isArray(body.history)
      ? body.history
          .filter((item: unknown): item is ChatMessage =>
            typeof item === 'object' && item !== null &&
            ((item as ChatMessage).role === 'user' || (item as ChatMessage).role === 'model') &&
            typeof (item as ChatMessage).text === 'string')
          .slice(-10)
          .map((item) => ({ role: item.role, text: item.text.slice(0, 1000) }))
      : [];

    const context = {
      profile: body.profile && typeof body.profile === 'object' ? body.profile : {},
      recentActivities: Array.isArray(body.activities) ? body.activities.slice(0, 20) : [],
      availableChallenges: Array.isArray(body.challenges) ? body.challenges.slice(0, 30) : [],
    };
    const model = Deno.env.get('GEMINI_MODEL') || 'gemini-3.8-flash';
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: `너는 GreenStep의 친근한 한국어 환경 실천 도우미 하모야. 사용자의 질문에 먼저 직접 답하고, 제공된 프로필·최근 실천·활성 챌린지에 맞춰 간결하고 구체적으로 안내해. 챌린지 포인트는 전달된 데이터에 있는 수치만 안내하고, 실제 포인트 지급을 확정적으로 약속하지 마. 데이터에 없는 진주시 정책이나 학교 정보를 사실처럼 만들지 말고 모른다고 말해. 활동 맥락은 다음 JSON이야: ${JSON.stringify(context).slice(0, 12000)}` }],
          },
          contents: [
            ...history.map((item) => ({ role: item.role, parts: [{ text: item.text }] })),
            { role: 'user', parts: [{ text: message }] },
          ],
          generationConfig: { temperature: 0.6, maxOutputTokens: 700 },
        }),
      },
    );

    if (!geminiResponse.ok) {
      // Do not return upstream payloads, which may contain sensitive diagnostics.
      return jsonResponse({ error: 'Gemini API 요청이 실패했습니다. 키 권한, 모델명, 사용량 한도를 확인해 주세요.' }, 502);
    }

    const result = await geminiResponse.json();
    const reply = result.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? '')
      .join('')
      .trim();
    if (!reply) return jsonResponse({ error: 'Gemini가 답변을 반환하지 않았습니다.' }, 502);
    return jsonResponse({ reply });
  } catch {
    return jsonResponse({ error: '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.' }, 400);
  }
});
