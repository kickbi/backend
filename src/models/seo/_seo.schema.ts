import mongoose from "mongoose";

/**
 * Shared SEO subdocument schema embedded into Subject, Course, Chapter, and Topic.
 *
 * Fields designed so that a single course API response contains every SEO token
 * the frontend needs to render <head> metadata, Open Graph tags, and JSON-LD
 * structured data without additional requests.
 *
 * Slug         — URL-friendly identifier (e.g. "schrodinger-equation")
 * MetaTitle    — <title> tag content (50-60 chars recommended)
 * MetaDescription — <meta name="description"> content (150-160 chars recommended)
 * OgTitle      — og:title Open Graph tag
 * OgDescription — og:description Open Graph tag
 * OgImage      — S3 key for og:image (resolved to a full URL by the API)
 * CanonicalUrl — relative path for <link rel="canonical"> (frontend prepends base domain)
 * JsonLd       — Serialized JSON-LD object for schema.org structured data
 */
export const SeoSchema = new mongoose.Schema(
    {
        Slug: {
            type: String,
        },
        MetaTitle: {
            type: String,
        },
        MetaDescription: {
            type: String,
        },
        OgTitle: {
            type: String,
        },
        OgDescription: {
            type: String,
        },
        OgImage: {
            type: String,
        },
        CanonicalUrl: {
            type: String,
        },
        JsonLd: {
            type: String,
        },
    },
    { _id: false }
);
