"use client";
import axios from "axios";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useProModal } from "@/hooks/use-pro-modal";

import {
  Code,
  ImageIcon,
  MessageSquare,
  Music,
  VideoIcon,
  Zap,
} from "lucide-react";
import { useState } from "react";

const tools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/conversation",
  },
  {
    label: "Music Generation",
    icon: Music,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/music",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
    href: "/image",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    color: "text-orange-700",
    bgColor: "bg-orange-500/10",
    href: "/video",
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-green-700",
    bgColor: "bg-green-500/10",
    href: "/code",
  },
];
export const ProModal = () => {
  const proModal = useProModal();
  const [loading, setLoading] = useState(false);
  const onSubscribe = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-yellow">
      <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-center items-center flex-col">
              Upgrade to Genius
              <Badge className="uppercase text-sm py-1"> pro</Badge>
            </DialogTitle>
            <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium"></DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              size="lg"
              variant="premium"
              className="w-full"
              onClick={onSubscribe}
            >
              Upgrade
              <Zap className="w-4 h-4 ml-2 fill--white" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
