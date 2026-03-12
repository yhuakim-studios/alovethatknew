import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

// Get allowed origins from environment, fallback for development
const getAllowedOrigins = (): string[] => {
  const envOrigins = Deno.env.get('ALLOWED_ORIGINS');
  if (envOrigins) {
    return envOrigins.split(',').map((o: string) => o.trim());
  }
  // Development fallback only
  return [
    "http://localhost:3000",
    "http://localhost:5173",
  ];
};

// In-memory rate limiting (per-instance)
// Consider Deno KV Store for production reliability
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Configuration
const MAX_REQUESTS_PER_MINUTE = 10;
const MAX_AMOUNT = 10000000; // Maximum 100,000 NGN (in kobo)
const MIN_AMOUNT = 10000; // Minimum 100 NGN (in kobo)
const ALLOWED_ORIGINS = getAllowedOrigins();

interface PaymentRequest {
  email?: unknown;
  amount?: unknown;
  name?: unknown;
  message?: unknown;
  csrf_token?: string; // for future CSRF protection
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// CORS headers with restricted origin and security attributes
const getCorsHeaders = (origin: string | null): Record<string, string> => {
  const isAllowed = origin && ALLOWED_ORIGINS.includes(origin);
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : '',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '3600',
  };
};

// Rate limiting middleware
const checkRateLimit = (clientIp: string): boolean => {
  const now = Date.now();
  const entry = rateLimitStore.get(clientIp) as RateLimitEntry | undefined;

  if (!entry || now > entry.resetTime) {
    // Reset or create new entry
    rateLimitStore.set(clientIp, {
      count: 1,
      resetTime: now + 60000, // 1 minute window
    });
    return true;
  }

  if (entry.count < MAX_REQUESTS_PER_MINUTE) {
    entry.count++;
    return true;
  }

  return false;
};

// Input validation
const validateInput = (data: PaymentRequest): { valid: boolean; error?: string } => {
  // Validate email
  if (!data.email || typeof data.email !== 'string') {
    return { valid: false, error: 'Invalid or missing email address' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Validate amount
  if (data.amount === undefined || data.amount === null) {
    return { valid: false, error: 'Amount is required' };
  }

  const amount = Number(data.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { valid: false, error: 'Amount must be a positive number' };
  }

  const amountInKobo = Math.round(amount * 100);
  if (amountInKobo < MIN_AMOUNT || amountInKobo > MAX_AMOUNT) {
    return {
      valid: false,
      error: `Amount must be between ${MIN_AMOUNT / 100} and ${MAX_AMOUNT / 100} NGN`,
    };
  }

  // Validate name (optional, max 100 chars)
  if (data.name && (typeof data.name !== 'string' || data.name.length > 100)) {
    return { valid: false, error: 'Name must be a string with max 100 characters' };
  }

  // Validate message (optional, max 500 chars)
  if (data.message && (typeof data.message !== 'string' || data.message.length > 500)) {
    return { valid: false, error: 'Message must be a string with max 500 characters' };
  }

  return { valid: true };
};

serve(async (req: { headers: { get: (arg0: string) => string; }; method: string; json: () => PaymentRequest | PromiseLike<PaymentRequest>; }) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Validate origin
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return new Response(JSON.stringify({ error: 'Unauthorized origin' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check rate limiting
  const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Parse request body
    let requestData: PaymentRequest;
    try {
      requestData = await req.json() as PaymentRequest;
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate input
    const validation = validateInput(requestData);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get secrets
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY not configured');
      return new Response(JSON.stringify({ error: 'Payment service temporarily unavailable' }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize payment with Paystack
    const amountInKobo = Math.round((requestData.amount as number) * 100);
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: requestData.email,
        amount: amountInKobo,
        currency: 'NGN',
        metadata: {
          donor_name: (requestData.name as string) || 'Anonymous',
          message: (requestData.message as string) || '',
          purpose: 'Wedding Gift',
        },
      }),
    });

    const data = await response.json() as Record<string, unknown>;

    if (!data.status) {
      return new Response(JSON.stringify({ error: 'Payment initialization failed' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return only necessary data
    const successData = data.data as Record<string, string> | undefined;
    return new Response(
      JSON.stringify({
        authorization_url: successData?.authorization_url || '',
        reference: successData?.reference || '',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Payment initialization error:', error);
    // Don't expose internal error details to client - log only server-side
    return new Response(JSON.stringify({ error: 'An error occurred processing your payment request. Please try again.' }), {
      status: 500,n      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
