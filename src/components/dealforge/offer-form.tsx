"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { address } from "gill";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMakeOfferMutation } from "./dealforge-data-access";

const offerFormSchema = z.object({
  offeredMint: z.string().min(1, "Offered token mint is required"),
  requestedMint: z.string().min(1, "Requested token mint is required"),
  offeredAmount: z.coerce
    .number({
      error: "Offered amount is required",
    })
    .gt(0, "Offered amount should be greater than 0"),
  requestedAmount: z.coerce
    .number({
      error: "Requested amount is required",
    })
    .gt(0, "Requested amount should be greater than 0"),
});
type OfferFormData = z.infer<typeof offerFormSchema>;
type OfferFormDataInput = z.input<typeof offerFormSchema>;

interface OfferFormProps {
  readonly onSuccess?: () => void;
}

export function OfferForm({ onSuccess }: OfferFormProps) {
  const { mutate: makeOfferMutation, isPending: isLoading } =
    useMakeOfferMutation();

  const form = useForm<OfferFormDataInput, unknown, OfferFormData>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      offeredMint: "",
      requestedMint: "",
      offeredAmount: 0,
      requestedAmount: 0,
    },
  });

  const onSubmit = (data: OfferFormData) => {
    try {
      // Generate a random offer ID
      const offerId = BigInt(Math.floor(Math.random() * 1_000_000_000_000));

      // Validate addresses
      const offeredMint = address(data.offeredMint);
      const requestedMint = address(data.requestedMint);

      const offeredAmount = data.offeredAmount;
      const requestedAmount = data.requestedAmount;

      makeOfferMutation(
        {
          offerId,
          offeredMint,
          requestedMint,
          offeredAmount,
          requestedAmount,
        },
        {
          onSuccess: () => {
            // Reset form on success
            form.reset();
            onSuccess?.();
          },
        }
      );
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Offer</CardTitle>
        <CardDescription>
          Create a new token swap offer on the escrow platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="offeredMint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offered Token Mint</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter token mint address you want to offer"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="offeredAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offered Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0.0"
                      step="0.000000001"
                      type="number"
                      {...field}
                      disabled={isLoading}
                      value={String(field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requestedMint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requested Token Mint</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter token mint address you want in return"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requestedAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requested Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0.0"
                      step="0.000000001"
                      type="number"
                      {...field}
                      disabled={isLoading}
                      value={String(field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading ? "Creating Offer..." : "Create Offer"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
