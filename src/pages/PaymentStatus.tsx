import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const PaymentStatusPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("status") as "success" | "failed" | null;
  const message = searchParams.get("message") || "";
  const email = searchParams.get("email") || "";

  // Verify payment via webhook if not yet processed
  useEffect(() => {
    if (status === "success") {
      // Payment is confirmed - webhook will have processed it
      console.log("Payment successful - webhook handling record creation");
    }
  }, [status]);

  const isSuccess = status === "success";

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          {isSuccess ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
                  <CheckCircle2 className="w-16 h-16 text-green-500 relative" />
                </div>
              </div>
              <CardTitle className="text-2xl">Payment Successful! 💝</CardTitle>
              <CardDescription>
                Your wedding gift has been received
              </CardDescription>
            </>
          ) : status === "failed" ? (
            <>
              <div className="flex justify-center mb-4">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
              <CardTitle className="text-2xl">Payment Failed</CardTitle>
              <CardDescription>Unable to process your payment</CardDescription>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <AlertCircle className="w-16 h-16 text-yellow-500" />
              </div>
              <CardTitle className="text-2xl">Payment Status Unknown</CardTitle>
              <CardDescription>
                Unable to determine payment status
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Message */}
          <div className="text-center">
            <p className="text-gray-700">{message}</p>
          </div>

          {/* Email confirmation */}
          {email && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              <p className="text-xs text-gray-600 uppercase tracking-wide">
                Confirmation Sent To
              </p>
              <p className="text-sm font-medium text-gray-900">{email}</p>
              <p className="text-xs text-gray-500">
                Check your email for receipt details
              </p>
            </div>
          )}

          {/* Success message details */}
          {isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-green-900">
                What happens next?
              </p>
              <ul className="text-sm text-green-800 space-y-1">
                <li>✓ Your gift will be displayed on our gift registry</li>
                <li>✓ We'll send you a thank you message</li>
                <li>✓ See you at the wedding on April 7th! 🎉</li>
              </ul>
            </div>
          )}

          {/* Failure message details */}
          {status === "failed" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-red-900">
                Payment not completed
              </p>
              <p className="text-sm text-red-800">
                Your payment could not be processed. Please ensure:
              </p>
              <ul className="text-sm text-red-800 space-y-1 ml-4 list-disc">
                <li>You have sufficient funds</li>
                <li>Your card details are correct</li>
                <li>Your internet connection is stable</li>
              </ul>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-2">
            {isSuccess ? (
              <Button
                onClick={() => navigate("/")}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
              >
                Return to Wedding Site →
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/rsvp")}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                >
                  Try Payment Again
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>

          {/* Support contact */}
          <div className="text-center border-t pt-4">
            <p className="text-xs text-gray-600">
              Having issues?{" "}
              <a
                href="mailto:support@your-domain.com"
                className="text-rose-600 hover:underline"
              >
                Contact us
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatusPage;
