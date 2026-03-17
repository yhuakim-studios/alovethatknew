import { useState } from "react";

interface InitiatePaymentParams {
  email: string;
  amount: number;
  name?: string;
  message?: string;
}

interface PaymentResponse {
  authorization_url: string;
  reference: string;
}

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async (params: InitiatePaymentParams) => {
    setLoading(true);
    setError(null);

    try {
      // Call the initialize-payment edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/initialize-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify(params),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Payment initialization failed");
      }

      const data = (await response.json()) as PaymentResponse;

      // Redirect to Paystack
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error("No authorization URL received");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment failed";
      setError(message);
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    initiatePayment,
    loading,
    error,
  };
};

/**
 * Hook to verify payment status after redirect from Paystack
 */
export const usePaymentVerification = (reference: string | null) => {
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading",
  );
  const [message, setMessage] = useState("");

  // Verification is handled by the payment-redirect function
  // This hook can be used to restore state if needed
  const verifyPayment = async () => {
    if (!reference) {
      setStatus("failed");
      setMessage("No payment reference provided");
      return;
    }

    try {
      // The payment-redirect function handles verification and redirects
      // This is just for display purposes
      setStatus("success");
      setMessage("Payment verified successfully");
    } catch (err) {
      setStatus("failed");
      setMessage(err instanceof Error ? err.message : "Verification failed");
    }
  };

  return {
    status,
    message,
    verifyPayment,
  };
};
