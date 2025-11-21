import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});

// Only match protected routes (not public files like /assets/)
export const config = {
  matcher: ["/((?!api|_next|assets|favicon.ico).*)"],
};
