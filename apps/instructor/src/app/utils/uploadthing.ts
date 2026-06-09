import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "../api/uploadthing/route";

export const { useUploadThing } =
  generateReactHelpers<OurFileRouter>();