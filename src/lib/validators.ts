import { z } from "zod";

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .email("Invalid email format")
  .min(1, "Email is required");

/**
 * Amount validation schema (in NGN currency)
 * Min: 100 NGN, Max: 100,000 NGN
 */
export const amountSchema = z
  .number()
  .positive("Amount must be greater than 0")
  .min(100, "Amount must be at least 100 NGN")
  .max(100000, "Amount cannot exceed 100,000 NGN");

/**
 * Name validation schema
 */
export const nameSchema = z
  .string()
  .max(100, "Name must not exceed 100 characters")
  .optional();

/**
 * Message validation schema
 */
export const messageSchema = z
  .string()
  .max(500, "Message must not exceed 500 characters")
  .optional();

/**
 * Payment request validation schema
 */
export const paymentRequestSchema = z.object({
  email: emailSchema,
  amount: amountSchema,
  name: nameSchema,
  message: messageSchema,
});

export type PaymentRequestData = z.infer<typeof paymentRequestSchema>;

/**
 * Validate payment request data
 * @param data - The data to validate
 * @returns Validation result with data or error
 */
export const validatePaymentRequest = (data: unknown) => {
  return paymentRequestSchema.safeParse(data);
};
