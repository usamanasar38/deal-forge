"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { address } from "gill";
import { useState } from "react";
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
  offeredAmount: z.string().min(1, "Offered amount is required"),
  requestedAmount: z.string().min(1, "Requested amount is required"),
});

type OfferFormData = z.infer<typeof offerFormSchema>;

interface OfferFormProps {
  readonly onSuccess?: () => void;
}

export function OfferForm({ onSuccess }: OfferFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const makeOfferMutation = useMakeOfferMutation();

  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      offeredMint: "",
      requestedMint: "",
      offeredAmount: "",
      requestedAmount: "",
    },
  });

  const onSubmit = async (data: OfferFormData) => {
    try {
      setIsSubmitting(true);

      // Generate a random offer ID
      const offerId = BigInt(Math.floor(Math.random() * 1_000_000_000_000));

      // Validate addresses
      const offeredMint = address(data.offeredMint);
      const requestedMint = address(data.requestedMint);

      // Convert amounts to bigint (assuming 9 decimals)
      const DECIMALS = 1_000_000_000n;
      const offeredAmount = BigInt(
        Math.floor(Number.parseFloat(data.offeredAmount) * Number(DECIMALS))
      );
      const requestedAmount = BigInt(
        Math.floor(Number.parseFloat(data.requestedAmount) * Number(DECIMALS))
      );

      await makeOfferMutation.mutateAsync({
        offerId,
        offeredMint,
        requestedMint,
        offeredAmount,
        requestedAmount,
      });

      // Reset form on success
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating offer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || makeOfferMutation.isPending;

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
