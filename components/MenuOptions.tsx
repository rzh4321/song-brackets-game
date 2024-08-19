import { Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema } from "./Game";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Play } from "lucide-react";

import { z } from "zod";
import useStore from "@/gameStore";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { PlaylistInfo } from "@/types";

type MenuOptionsProps = {
  playlistInfo: PlaylistInfo | undefined;
  setShowTournament: React.Dispatch<React.SetStateAction<boolean>>;
  form: any;
};

export function biggestPowerOfTwo(n: number): number {
  // Ensure n is positive
  n = Math.abs(Math.floor(n));
  n = Math.min(n, 128);

  // Edge case: if n is 0 or 1, return 0
  if (n <= 1) return 0;

  // Subtract 1 to handle the case where n is already a power of 2
  n = n - 1;

  // Set all bits after the most significant bit to 1
  n |= n >> 1;
  n |= n >> 2;
  n |= n >> 4;
  n |= n >> 8;
  n |= n >> 16;

  // Add 1 to get the next power of 2, then divide by 2

  return (n + 1) >> 1;
}

export default function MenuOptions({
  playlistInfo,
  setShowTournament,
  form,
}: MenuOptionsProps) {
  function onSubmit(data: z.infer<typeof FormSchema>) {
    setShowTournament(true);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"spotify"} className="px-3 sm:px-4">
          <Play />
          <span className="hidden sm:block">Play</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {playlistInfo?.name}
          </DialogTitle>
          <DialogDescription className="">
            Choose the game settings.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="ranked"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Ranked</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="showProgress"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Show Progress</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bracketSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bracket Size</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={Math.min(
                      32,
                      biggestPowerOfTwo(playlistInfo?.count!),
                    ).toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bracket size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="16">16</SelectItem>
                      <SelectItem value="32">32</SelectItem>
                      <SelectItem value="64">64</SelectItem>
                      <SelectItem value="128">128</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant={"spotify"} type="submit">
              Start
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
