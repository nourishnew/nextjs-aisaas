"use client";
import * as z from "zod";
import { Heading } from "@/components/Heading";
import { MessageSquare, VideoIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./constants";
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useProModal } from "@/hooks/use-pro-modal";

const VideoPage = () => {
  const router = useRouter();
  const [video, setVideo] = useState<string>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });
  const proModal = useProModal();
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo(undefined);
      const response = await axios.post("/api/video", values);
      console.log("client response");
      console.log(response);
      setVideo(response.data);
      form.reset();
    } catch (err: any) {
      console.error(err);
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
        title="Video Generation"
        description="Turn your prompt into a video"
        icon={VideoIcon}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
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
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-transparent "
                        placeholder="Clown fish swimming in space"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
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
        {isLoading && <div>Loading</div>}
        <div className="space-y-4 mt-4">
          {video && (
            <video
              className="w-full aspect-video mt-8 rounded-lg border-bg-black"
              controls
            >
              <source src={video} />
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
