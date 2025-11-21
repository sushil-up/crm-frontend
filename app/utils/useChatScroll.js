"use client";
import React from "react";

export default function useChatScrol(messsage) {
  const ref = React.useRef();
  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messsage]);
  return ref;
}
