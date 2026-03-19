import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import {
  dsaSheetsPageMetadata,
  dsaSheetsListJsonLd,
} from "../seoHelpers";
import DSASheetExplorePage from "./_components/DSASheetExplorePage";

type RawSheet = {
  name: string;
  slug: string;
  description?: string;
};

type Sheet = {
  name: string;
  slug: string;
  description?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  return dsaSheetsPageMetadata();
}

export default async function DSASheetsPage() {
  let sheets: Sheet[] = [];

  try {
    const raw = (await fetchQuery(api.sheets.getAll)) as RawSheet[] | null;

    sheets = (raw ?? []).map((s) => ({
      name: s.name,
      slug: s.slug,
      description: s.description,
    }));
  } catch {
  }

  return (
    <>
      {sheets.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(dsaSheetsListJsonLd(sheets)),
          }}
        />
      )}
      <DSASheetExplorePage />
    </>
  );
}