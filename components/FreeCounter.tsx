import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { MAX_FREE_COUNTS } from "@/constants";
import { Progress } from "@/components/ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { useProModal } from "@/hooks/use-pro-modal";

interface FreeCounterProps {
  apiLimitCount: number;
  isPro: boolean;
}

export const FreeCounter = ({
  apiLimitCount = 0,
  isPro = false,
}: FreeCounterProps) => {
  const [mounted, setMounted] = useState(false);
  const proModal = useProModal();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  if (isPro) return null;

  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <p>
              {apiLimitCount}/{MAX_FREE_COUNTS} free generations
            </p>
            <Progress className="h-3 bg-gray-200" value={50} />
          </div>
          <Button
            className="w-full rounded-lg"
            variant="premium"
            onClick={proModal.onOpen}
          >
            {" "}
            Upgrade <Zap className="w-4 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
