import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => Boolean(token?.id)
  }
});

export const config = {
  matcher: ["/dashboard", "/game/:path*"]
};
