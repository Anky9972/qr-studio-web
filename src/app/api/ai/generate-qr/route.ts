import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// AI QR generation using Gemini 2.5 Flash or GPT-4o with user-provided API keys

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      prompt,
      qrContent,
      creativity = 0.7,
      style = 'artistic',
      geminiApiKey,
      openaiApiKey,
      replicateApiKey,
      huggingfaceApiKey,
      stabilityApiKey,
      preferredProvider = 'auto'
    } = body;

    // Validate inputs
    if (!prompt || prompt.length < 10) {
      return NextResponse.json(
        { error: 'Prompt must be at least 10 characters' },
        { status: 400 }
      );
    }

    if (!qrContent || qrContent.length < 3) {
      return NextResponse.json(
        { error: 'QR content is required' },
        { status: 400 }
      );
    }

    if (!geminiApiKey && !openaiApiKey && !replicateApiKey && !huggingfaceApiKey && !stabilityApiKey) {
      return NextResponse.json(
        { error: 'At least one API key is required' },
        { status: 400 }
      );
    }

    // Build the full prompt with style guidance
    const fullPrompt = `Create a beautiful, artistic QR code that encodes "${qrContent}". ${prompt}. 
Style: ${style}. The QR code should be visually stunning but still scannable. 
Use high contrast and maintain the QR code structure.`;

    let imageUrl = '';
    let usedProvider = '';
    const errors: Record<string, string> = {};

    // Define provider priority for auto mode
    const providerPriority = ['replicate', 'huggingface', 'stability', 'openai'];
    const availableProviders = [
      { name: 'replicate', key: replicateApiKey, fn: generateWithReplicate },
      { name: 'huggingface', key: huggingfaceApiKey, fn: generateWithHuggingFace },
      { name: 'stability', key: stabilityApiKey, fn: generateWithStability },
      { name: 'openai', key: openaiApiKey, fn: generateWithOpenAI },
    ];

    // Try specific provider if selected
    if (preferredProvider !== 'auto') {
      const provider = availableProviders.find(p => p.name === preferredProvider);

      if (!provider || !provider.key) {
        return NextResponse.json(
          { error: `No API key configured for ${preferredProvider}` },
          { status: 400 }
        );
      }

      try {
        imageUrl = await provider.fn(provider.key, fullPrompt, qrContent, creativity);
        usedProvider = provider.name;
      } catch (error: any) {
        throw new Error(`${provider.name} generation failed: ${error.message}`);
      }
    }
    // Auto mode: Try providers in priority order
    else {
      for (const providerName of providerPriority) {
        const provider = availableProviders.find(p => p.name === providerName);

        if (!provider || !provider.key) continue;

        try {
          imageUrl = await provider.fn(provider.key, fullPrompt, qrContent, creativity);
          usedProvider = provider.name;
          break; // Success! Stop trying
        } catch (error: any) {
          console.error(`${provider.name} failed:`, error.message);
          errors[provider.name] = error.message;
          // Continue to next provider
        }
      }

      if (!imageUrl) {
        const errorMsg = Object.entries(errors)
          .map(([provider, err]) => `${provider}: ${err}`)
          .join('; ');
        throw new Error(`All providers failed. ${errorMsg}`);
      }
    }

    if (!imageUrl) {
      throw new Error('Failed to generate image');
    }

    // Log the generation (optional)
    try {
      await prisma.qRCode.create({
        data: {
          id: crypto.randomUUID(),
          userId: user.id,
          type: 'static',
          qrType: 'ai-generated',
          content: qrContent,
          name: `AI QR: ${prompt.substring(0, 50)}`,
          design: {
            aiGenerated: true,
            prompt,
            style,
            creativity,
            provider: usedProvider,
          },
          logo: imageUrl,
          updatedAt: new Date(),
        },
      });
    } catch (dbError) {
      console.error('Failed to save QR code to database:', dbError);
      // Continue anyway - generation succeeded
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      provider: usedProvider,
      prompt,
      style,
      creativity,
    });

    // Example integrations:

    // 1. REPLICATE (Stable Diffusion + ControlNet)
    // const response = await fetch('https://api.replicate.com/v1/predictions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     version: 'controlnet-qr-code-version-id',
    //     input: {
    //       prompt,
    //       qr_code_content: qrContent,
    //       controlnet_conditioning_scale: creativity,
    //       num_inference_steps: 50,
    //     },
    //   }),
    // });

    // 2. OPENAI DALL-E 3 (Note: Cannot guarantee QR scannability)
    // const response = await fetch('https://api.openai.com/v1/images/generations', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     model: 'dall-e-3',
    //     prompt: `Create an artistic QR code: ${prompt}`,
    //     size: '1024x1024',
    //     quality: 'hd',
    //   }),
    // });

    // 3. HUGGINGFACE (QR Code ControlNet)
    // const response = await fetch('https://api-inference.huggingface.co/models/monster-labs/control_v1p_sd15_qrcode_monster', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     inputs: prompt,
    //     parameters: {
    //       qr_code_content: qrContent,
    //       controlnet_conditioning_scale: creativity,
    //     },
    //   }),
    // });

    // PLACEHOLDER: Return a demo response
    // In production, replace this with actual AI generation
    return NextResponse.json({
      error: 'AI QR generation is not yet configured',
      message: 'Please add API keys for Replicate, OpenAI, or HuggingFace in your .env file',
      instructions: {
        replicate: 'Add REPLICATE_API_TOKEN to .env',
        openai: 'Add OPENAI_API_KEY to .env',
        huggingface: 'Add HUGGINGFACE_API_KEY to .env',
      },
      demoMode: true,
      // For demo purposes, return a sample QR code
      imageUrl: '/images/sample-ai-qr.png', // You would need to create this
    }, { status: 501 }); // 501 Not Implemented

    // PRODUCTION CODE (uncomment when API is configured):
    /*
    const aiResponse = await fetch('YOUR_AI_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `${prompt}. Style: ${style}. Create an artistic QR code that is still scannable.`,
        qr_content: qrContent,
        creativity_level: creativity,
        negative_prompt: 'blurry, low quality, distorted, unreadable',
        guidance_scale: 7.5,
        num_inference_steps: 50,
        width: 512,
        height: 512,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('AI generation failed');
    }

    const aiData = await aiResponse.json();
    const imageUrl = aiData.output[0]; // Adjust based on your API response

    // Save to database (optional)
    await prisma.qRCode.create({
      data: {
        userId: user.id,
        type: 'static',
        qrType: 'ai-generated',
        content: qrContent,
        name: `AI QR: ${prompt.substring(0, 50)}`,
        design: {
          aiGenerated: true,
          prompt,
          style,
          creativity,
        },
        // Store the generated image URL
        logo: imageUrl,
      },
    });

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt,
      style,
      creativity,
    });
    */

  } catch (error: any) {
    console.error('Error generating AI QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI QR code', details: error.message },
      { status: 500 }
    );
  }
}

// Endpoint to check AI generation status (for async generation)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
  }

  // Check generation status with your AI provider
  // Example for Replicate:
  /*
  const response = await fetch(`https://api.replicate.com/v1/predictions/${jobId}`, {
    headers: {
      'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
    },
  });

  const data = await response.json();

  return NextResponse.json({
    status: data.status, // 'starting', 'processing', 'succeeded', 'failed'
    output: data.output,
    error: data.error,
  });
  */

  return NextResponse.json({
    error: 'Status checking not yet implemented',
    status: 501,
  }, { status: 501 });
}

// Generate with Replicate (ControlNet QR) - BEST FOR QR CODES
async function generateWithReplicate(apiKey: string, prompt: string, qrContent: string, creativity: number): Promise<string> {
  // Step 1: Create prediction
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'cff97c29ef7a4803c8ba3ca85e1dd2d0c0a1b3f2', // QR Code ControlNet model
      input: {
        prompt: prompt,
        qr_code_content: qrContent,
        controlnet_conditioning_scale: creativity,
        num_inference_steps: 50,
        guidance_scale: 7.5,
        negative_prompt: 'blurry, low quality, distorted, unreadable, ugly, deformed',
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Replicate API request failed');
  }

  const prediction = await response.json();

  // Step 2: Poll for completion
  let result = prediction;
  while (result.status === 'starting' || result.status === 'processing') {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

    const statusResponse = await fetch(result.urls.get, {
      headers: {
        'Authorization': `Token ${apiKey}`,
      },
    });

    result = await statusResponse.json();

    if (result.status === 'failed') {
      throw new Error(result.error || 'Replicate generation failed');
    }
  }

  if (!result.output || result.output.length === 0) {
    throw new Error('No image generated by Replicate');
  }

  return Array.isArray(result.output) ? result.output[0] : result.output;
}

// Generate with HuggingFace (QR ControlNet)
async function generateWithHuggingFace(apiKey: string, prompt: string, qrContent: string, creativity: number): Promise<string> {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/monster-labs/control_v1p_sd15_qrcode_monster',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          qr_code_content: qrContent,
          controlnet_conditioning_scale: creativity,
          num_inference_steps: 50,
          guidance_scale: 7.5,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'HuggingFace API request failed');
  }

  // HuggingFace returns binary image data
  const blob = await response.blob();

  // Convert to base64 data URL
  const buffer = await blob.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const dataUrl = `data:image/png;base64,${base64}`;

  return dataUrl;
}

// Generate with Stability AI (SDXL + ControlNet)
async function generateWithStability(apiKey: string, prompt: string, qrContent: string, creativity: number): Promise<string> {
  const response = await fetch(
    'https://api.stability.ai/v2beta/stable-image/generate/sd3',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        output_format: 'png',
        aspect_ratio: '1:1',
        mode: 'text-to-image',
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Stability AI request failed');
  }

  const data = await response.json();

  if (!data.image) {
    throw new Error('No image generated by Stability AI');
  }

  // Stability returns base64 encoded image
  return `data:image/png;base64,${data.image}`;
}

// Generate with OpenAI GPT-4o + DALL-E 3
async function generateWithOpenAI(apiKey: string, prompt: string, qrContent: string): Promise<string> {
  // Step 1: Use GPT-4o to refine the prompt for QR code generation
  const refinementResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at creating image prompts for QR code generation. Your goal is to create prompts that will generate beautiful, artistic QR codes that are still scannable.'
        },
        {
          role: 'user',
          content: `Create a detailed DALL-E prompt for generating an artistic QR code. User request: "${prompt}". The QR code must encode: "${qrContent}". Keep the prompt under 400 characters.`
        }
      ],
      max_tokens: 200,
    }),
  });

  if (!refinementResponse.ok) {
    throw new Error('Failed to refine prompt with GPT-4o');
  }

  const refinementData = await refinementResponse.json();
  const refinedPrompt = refinementData.choices[0].message.content;

  // Step 2: Generate image with DALL-E 3
  const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: refinedPrompt,
      size: '1024x1024',
      quality: 'hd',
      n: 1,
    }),
  });

  if (!imageResponse.ok) {
    const errorData = await imageResponse.json();
    throw new Error(errorData.error?.message || 'DALL-E image generation failed');
  }

  const imageData = await imageResponse.json();

  if (!imageData.data || imageData.data.length === 0) {
    throw new Error('No image generated');
  }

  return imageData.data[0].url;
}
