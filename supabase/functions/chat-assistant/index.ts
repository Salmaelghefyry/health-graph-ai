import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, predictions, conditions, language } = await req.json();
    const lang = language || 'en';
    const langNames: Record<string,string> = { en: 'English', fr: 'French', ar: 'Arabic' };
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Chat request received');

    const languageInstruction = `\nImportant: Reply to the user in ${langNames[lang] || 'English'} (language code: ${lang}). Use this language for all text in your responses.`;

    const systemPrompt = `You are a helpful medical AI assistant for a disease prediction platform. Your role is to:${languageInstruction}
`
1. Explain disease predictions and their reasoning based on medical knowledge graphs
2. Clarify relationships between diseases (progression, comorbidity, risk factors)
3. Provide educational information about health conditions
4. Answer questions about recommendations
5. Help users understand their risk profile

Current patient context:
- Conditions: ${conditions?.join(', ') || 'None specified'}
- Recent predictions: ${predictions ? JSON.stringify(predictions) : 'None available'}

Important guidelines:
- Always emphasize that predictions are for educational purposes and users should consult healthcare providers
- Be empathetic and supportive
- Explain medical concepts in simple terms
- Reference the graph-based relationships when explaining predictions
- Keep responses concise but informative`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error: unknown) {
    console.error('Error in chat-assistant function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
