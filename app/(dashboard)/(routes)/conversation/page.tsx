"use client";
import * as z from "zod";
import { Heading } from "@/components/Heading";
import { MessageSquare } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { useProModal } from "@/hooks/use-pro-modal";

const CoversationPage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });
      console.log("client response");
      console.log(response);
      const assistant_response = {
        role: "assistant",
        content: response.data,
      };
      setMessages((current) => [...current, userMessage, assistant_response]);
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
        title="Conversation"
        description="Our most advanced model"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
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
                        placeholder="Type your question..."
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
        <div className="space-y-4 mt-4">
          <Progress className="h-3 bg-orange" value={50} />

          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div key={message.content}>{message.content}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoversationPage;
