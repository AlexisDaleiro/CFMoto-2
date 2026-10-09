export const isPreview = process.env.VERCEL_ENV === "preview" || process.env.SITE_INDEXABLE !== "true";
