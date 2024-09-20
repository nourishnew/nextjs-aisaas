"use client";
import * as z from "zod";
import { Heading } from "@/components/Heading";
import {
  CodeIcon,
  Download,
  ImageIcon,
  MessageSquare,
  MusicIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { amountOptions, formSchema, resolutionOptions } from "./constants";
import axios from "axios";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactMarkDown from "react-markdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { useProModal } from "@/hooks/use-pro-modal";

const ImagePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "1024x1024",
    },
  });
  const [images, setImages] = useState<string[]>([]);
  const isLoading = form.formState.isSubmitting;
  const proModal = useProModal();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImages([]);

      const response = await axios.post("/api/image", values);
      console.log(response);
      const urls = response.data.map(
        (image: { revised_prompt: string; url: string }) => image.url
      );
      console.log(urls);
      setImages(urls);

      form.reset();
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 403) {
        proModal.onOpen();
      }
    } finally {
      router.refresh();
    }
  };
  return (
    <div>
      <Heading
        title="Image generation"
        description="Turn your prompt into an image"
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-transparent "
                        placeholder="A picture of a horse in space"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="amount"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select amount"
                            defaultValue={field.value}
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {amountOptions.map((amount) => (
                          <SelectItem value={amount.value} key={amount.value}>
                            {amount.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                name="resolution"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select resolution"
                            defaultValue={field.value}
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {resolutionOptions.map((resolution) => (
                          <SelectItem
                            value={resolution.value}
                            key={resolution.value}
                          >
                            {resolution.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button
                variant="outline"
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          <div className="flex flex-col-reverse gap-y-4">
            {isLoading && <p>Loading</p>}
            {images.length != 0 && !isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                {" "}
                {images.map((image, index) => (
                  <Card className="rounded-lg overflow-hidden" key={image}>
                    <div className="relative aspect-square">
                      <Image alt="Image" src={image} fill />
                    </div>
                    <CardFooter className="p-2">
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => window.open(image)}
                      >
                        <Download className="h-4 w-4 mr-2">Download</Download>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
