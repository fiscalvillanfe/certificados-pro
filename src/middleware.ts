import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", // página de login
  },
});

export const config = {
  matcher: ["/dashboard/:path*"], // protege tudo dentro de /dashboard
};
