import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DISEASE_GRAPH = {
  nodes: [
    { id: 'hypertension', name: 'Hypertension', category: 'cardiovascular' },
    { id: 'diabetes', name: 'Type 2 Diabetes', category: 'metabolic' },
    { id: 'obesity', name: 'Obesity', category: 'metabolic' },
    { id: 'heart_disease', name: 'Heart Disease', category: 'cardiovascular' },
    { id: 'stroke', name: 'Stroke', category: 'cardiovascular' },
    { id: 'kidney_disease', name: 'Chronic Kidney Disease', category: 'renal' },
    { id: 'fatty_liver', name: 'Non-Alcoholic Fatty Liver', category: 'hepatic' },
    { id: 'sleep_apnea', name: 'Sleep Apnea', category: 'respiratory' },
    { id: 'depression', name: 'Depression', category: 'mental' },
    { id: 'anxiety', name: 'Anxiety Disorder', category: 'mental' },
  ],
  edges: [
    { from: 'obesity', to: 'diabetes', weight: 0.65, type: 'risk_factor' },
    { from: 'obesity', to: 'hypertension', weight: 0.55, type: 'risk_factor' },
    { from: 'obesity', to: 'sleep_apnea', weight: 0.70, type: 'comorbidity' },
    { from: 'diabetes', to: 'heart_disease', weight: 0.45, type: 'progression' },
    { from: 'diabetes', to: 'kidney_disease', weight: 0.40, type: 'progression' },
    { from: 'hypertension', to: 'heart_disease', weight: 0.50, type: 'progression' },
    { from: 'hypertension', to: 'stroke', weight: 0.35, type: 'progression' },
    { from: 'hypertension', to: 'kidney_disease', weight: 0.30, type: 'progression' },
    { from: 'heart_disease', to: 'stroke', weight: 0.25, type: 'progression' },
    { from: 'sleep_apnea', to: 'hypertension', weight: 0.40, type: 'risk_factor' },
    { from: 'depression', to: 'heart_disease', weight: 0.20, type: 'risk_factor' },
    { from: 'anxiety', to: 'hypertension', weight: 0.25, type: 'risk_factor' },
    { from: 'obesity', to: 'fatty_liver', weight: 0.60, type: 'comorbidity' },
    { from: 'diabetes', to: 'fatty_liver', weight: 0.45, type: 'comorbidity' },
  ]
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conditions, patientAge } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Processing prediction for conditions:', conditions);

    // Build prompt with disease graph context
    const systemPrompt = `You are a medical AI assistant specialized in disease risk prediction based on a medical knowledge graph. 
You analyze patient conditions and predict potential disease risks using graph-based relationships.

DISEASE KNOWLEDGE GRAPH:
${JSON.stringify(DISEASE_GRAPH, null, 2)}

Edge types:
- risk_factor: Condition increases risk of developing another condition
- progression: Condition may progress to another condition over time
- comorbidity: Conditions frequently occur together

Your task is to analyze the patient's current conditions and predict:
1. Diseases they are at risk for (based on graph edges)
2. The probability of each predicted disease (0-100%)
3. Risk level (high/medium/low)
4. The progression pathway (how the condition might develop)
5. Personalized recommendations

Always respond in valid JSON format.`;

    const userPrompt = `Patient Information:
- Age: ${patientAge || 'Not specified'}
- Current/Past Conditions: ${conditions.join(', ')}

Based on the disease knowledge graph, analyze this patient's risk profile and provide predictions.

Respond with this exact JSON structure:
{
  "predictions": [
    {
      "disease": "Disease Name",
      "probability": 75,
      "riskLevel": "high|medium|low",
      "pathway": "Condition A → Risk Factor → Disease Name",
      "reasoning": "Brief explanation of why this is predicted"
    }
  ],
  "recommendations": [
    {
      "type": "test|lifestyle|prevention|diet",
      "title": "Recommendation title",
      "description": "Detailed recommendation",
      "priority": "high|medium|low"
    }
  ],
  "graphAnalysis": {
    "activatedNodes": ["node_ids that are relevant"],
    "riskPaths": ["path descriptions"]
  }
}`;

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
          { role: "user", content: userPrompt }
        ],
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
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('AI Response:', content);

    // Parse the JSON from the response
    let result;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      result = {
        predictions: [],
        recommendations: [],
        graphAnalysis: { activatedNodes: [], riskPaths: [] }
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in predict-diseases function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
