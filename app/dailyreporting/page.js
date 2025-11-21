"use client";
import { notFound, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
export default function page() {
  const pathName = usePathname();

  useEffect(() => {
    if (pathName == "/dailyreporting") {
      notFound();
    }
  });
}
