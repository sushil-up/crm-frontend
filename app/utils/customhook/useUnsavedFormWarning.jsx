import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUnsavedChangesDialog } from "./unsavedChageDialogBox";

export const useUnsavedChangesWarning = (formSubmitted, watch, isDirty) => {
  const router = useRouter();
  const { showDialog } = useUnsavedChangesDialog();

  const isFormCompletelyEmpty = (values) => {
    return Object.values(values).every(
      (v) =>
        v === "" ||
        v === null ||
        v === undefined ||
        (Array.isArray(v) && v.length === 0) ||
        (typeof v === "object" &&
          !Array.isArray(v) &&
          Object.keys(v).length === 0)
    );
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const values = watch();
      const formEmpty = isFormCompletelyEmpty(values);

      if (!formSubmitted && isDirty && !formEmpty) {
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    const handleRouteChange = async (url) => {
      const values = watch();
      const formEmpty = isFormCompletelyEmpty(values);

      if (!formSubmitted && isDirty && !formEmpty) {
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        const confirmed = await showDialog(message);
        if (!confirmed) {
          throw new Error("Route change aborted.");
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const originalPush = router.push;
    router.push = async (url, ...args) => {
      try {
        await handleRouteChange(url);
        await originalPush(url, ...args);
      } catch (e) {
        console.log(e.message);
      }
    };

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.push = originalPush;
    };
  }, [router, formSubmitted, isDirty, watch, showDialog]);
};
