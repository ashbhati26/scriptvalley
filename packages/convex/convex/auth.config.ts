export default {
  providers: [
    {
      domain:
        process.env.NEXT_PUBLIC_CLERK_ISSUER ||
        "https://clerk.thecodeone.in",
      applicationID: "convex",
    },
  ],
};
