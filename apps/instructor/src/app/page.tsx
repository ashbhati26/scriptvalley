"use client";

import InstructorGuard  from "./components/InstructorGuard";
import InstructorLayout from "./components/InstructorLayout";

export default function Page() {
  return (
    <InstructorGuard>
      <InstructorLayout />
    </InstructorGuard>
  );
}