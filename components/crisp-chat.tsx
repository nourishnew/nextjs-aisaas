"use client";

import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("9caf265e-7b9c-4f1d-808e-878037907eee");
  }, []);

  return null;
};
