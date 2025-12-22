import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, fileType, language = 'en' } = await req.json();
    
    console.log('Processing medical file analysis:', { fileType, language });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Create language-specific prompts
    const languagePrompts: Record<string, { system: string; instruction: string }> = {
      en: {
        system: `You are an expert medical image analyst specializing in cardiovascular diagnostics. Analyze the provided medical image and extract clinically relevant information.

IMPORTANT: This is for educational and decision-support purposes only. Always recommend professional medical consultation.

Analyze the image and provide:
1. Type of medical image/document identified
2. Key findings and observations
3. Relevant cardiovascular indicators if applicable
4. Risk factors or abnormalities detected
5. Suggested follow-up actions

Respond in JSON format with this structure:
{
  "imageType": "string (e.g., ECG, X-ray, Lab Report, etc.)",
  "findings": ["array of key findings"],
  "cardiovascularIndicators": {
    "detected": boolean,
    "details": ["array of cardiovascular-related observations"]
  },
  "riskFactors": ["array of identified risk factors"],
  "abnormalities": ["array of any abnormalities detected"],
  "confidence": "low|medium|high",
  "recommendations": ["array of recommended actions"],
  "summary": "brief summary of the analysis"
}`,
        instruction: 'Analyze this medical image and provide a structured cardiovascular-focused analysis.'
      },
      fr: {
        system: `Vous êtes un expert en analyse d'images médicales spécialisé dans le diagnostic cardiovasculaire. Analysez l'image médicale fournie et extrayez les informations cliniquement pertinentes.

IMPORTANT: Ceci est à des fins éducatives et d'aide à la décision uniquement. Recommandez toujours une consultation médicale professionnelle.

Analysez l'image et fournissez:
1. Type d'image/document médical identifié
2. Résultats et observations clés
3. Indicateurs cardiovasculaires pertinents si applicable
4. Facteurs de risque ou anomalies détectés
5. Actions de suivi suggérées

Répondez en format JSON avec cette structure:
{
  "imageType": "string (ex: ECG, Radiographie, Rapport de laboratoire, etc.)",
  "findings": ["tableau des résultats clés"],
  "cardiovascularIndicators": {
    "detected": boolean,
    "details": ["tableau des observations cardiovasculaires"]
  },
  "riskFactors": ["tableau des facteurs de risque identifiés"],
  "abnormalities": ["tableau des anomalies détectées"],
  "confidence": "low|medium|high",
  "recommendations": ["tableau des actions recommandées"],
  "summary": "résumé bref de l'analyse"
}`,
        instruction: 'Analysez cette image médicale et fournissez une analyse structurée axée sur le cardiovasculaire.'
      },
      ar: {
        system: `أنت خبير في تحليل الصور الطبية متخصص في تشخيص أمراض القلب والأوعية الدموية. حلل الصورة الطبية المقدمة واستخرج المعلومات ذات الصلة السريرية.

هام: هذا لأغراض تعليمية ودعم القرار فقط. أوصِ دائماً باستشارة طبية مهنية.

حلل الصورة وقدم:
1. نوع الصورة/المستند الطبي المحدد
2. النتائج والملاحظات الرئيسية
3. المؤشرات القلبية الوعائية ذات الصلة إن وجدت
4. عوامل الخطر أو الشذوذات المكتشفة
5. الإجراءات المتابعة المقترحة

أجب بتنسيق JSON بهذا الهيكل:
{
  "imageType": "string (مثل: تخطيط القلب، أشعة، تقرير مختبر، إلخ)",
  "findings": ["مصفوفة النتائج الرئيسية"],
  "cardiovascularIndicators": {
    "detected": boolean,
    "details": ["مصفوفة الملاحظات القلبية الوعائية"]
  },
  "riskFactors": ["مصفوفة عوامل الخطر المحددة"],
  "abnormalities": ["مصفوفة الشذوذات المكتشفة"],
  "confidence": "low|medium|high",
  "recommendations": ["مصفوفة الإجراءات الموصى بها"],
  "summary": "ملخص موجز للتحليل"
}`,
        instruction: 'حلل هذه الصورة الطبية وقدم تحليلاً منظماً يركز على القلب والأوعية الدموية.'
      }
    };

    const langPrompts = languagePrompts[language] || languagePrompts.en;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: langPrompts.system
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: langPrompts.instruction
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add funds to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    console.log('AI Response:', content);

    // Parse the JSON response
    let analysis;
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      analysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      analysis = {
        imageType: 'Unknown',
        findings: ['Unable to fully analyze the image'],
        cardiovascularIndicators: { detected: false, details: [] },
        riskFactors: [],
        abnormalities: [],
        confidence: 'low',
        recommendations: ['Please consult with a healthcare professional'],
        summary: content.substring(0, 500)
      };
    }

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in analyze-medical-file function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
