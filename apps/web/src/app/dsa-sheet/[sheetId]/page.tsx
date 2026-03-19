import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../../packages/convex/convex/_generated/api";
import { notFound } from "next/navigation";
import { dsaSheetMetadata, dsaSheetJsonLd } from "../../seoHelpers";
import DSASheetPage from "../_components/DSASheetPage";

type Question = {
  id?: string;
};

type Topic = {
  topic: string;
  questions: Question[];
};

type Sheet = {
  name: string;
  slug: string;
  description?: string;
  topics?: Topic[];
};

interface Props {
  params: Promise<{ sheetId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sheetId } = await params;
  try {
    const sheet = (await fetchQuery(api.sheets.getBySlug, {
      slug: sheetId,
    })) as Sheet | null;

    if (!sheet) return { title: "Sheet Not Found" };

    return dsaSheetMetadata(sheet);
  } catch {
    return { title: "DSA Sheet — Script Valley" };
  }
}

export default async function DSASheetDetailPage({ params }: Props) {
  const { sheetId } = await params;

  let sheet: Sheet | null = null;

  try {
    sheet = (await fetchQuery(api.sheets.getBySlug, {
      slug: sheetId,
    })) as Sheet | null;
  } catch {}

  if (sheet === null) notFound();

  return (
    <>
      {sheet && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(dsaSheetJsonLd(sheet)),
          }}
        />
      )}
      <DSASheetPage />
    </>
  );
}