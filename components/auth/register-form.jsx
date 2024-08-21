"use client";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import FormError from "./form-error";
import createUser from "@/actions/createUser";
import SpotifyIdInfoCard from "../SpotifyIdInfoCard";

export const RegisterForm = () => {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values) => {
    setError("");

    startTransition(() => {
      async function create() {
        try {
          const userString = await createUser(
            values.username,
            values.name,
            values.spotifyUserId,
            values.password,
          );
          const user = JSON.parse(userString);
          const res = await signIn("credentials", {
            redirect: true,
            username: user.username,
            password: user.password,
            callbackUrl: "/home", // should redirect to home page after successful signup
          });
        } catch (err) {
          setError(err.message);
        }
      }
      create();
    });
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 mb-7">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username*</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password*</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="spotifyUserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-1">
                    Spotify User ID <SpotifyIdInfoCard />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full text-lg mt-4"
          >
            Create an account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
