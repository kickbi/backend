type Primitive = string | number | boolean | bigint | Date | null | undefined;

/**
 * Treats primitives, arrays, and functions as leaves.
 * This prevents recursing into Mongoose document methods/internals.
 */
type IsLeaf<T> = NonNullable<T> extends Primitive | ((...args: any[]) => any) | any[] ? true : false;

/** Depth-limited dot-notation paths (max 3 levels, data fields only). */
type DotPaths<T, D extends 0[] = []> = D["length"] extends 3 ? never : {
    [K in keyof T & string]: IsLeaf<T[K]> extends true
        ? K
        : K | `${K}.${string & DotPaths<NonNullable<T[K]>, [0, ...D]>}`;
}[keyof T & string];

/** Depth-limited nested projection — allows { SEO: { Slug: 1 } } or { SEO: 1 }. */
type TNestedProjection<T, D extends 0[] = []> = {
    [K in keyof T & string]?: IsLeaf<T[K]> extends true
        ? 1 | 0
        : D["length"] extends 3 ? 1 | 0 : 1 | 0 | TNestedProjection<NonNullable<T[K]>, [0, ...D]>;
} & { _id?: 1 | 0 };

/**
 * Type-safe projection for Mongoose queries.
 * Supports flat fields, nested objects, and dot-notation for sub-documents.
 * Functions and arrays are treated as leaves (Mongoose internals are not traversed).
 * Max traversal depth: 3 levels.
 *
 * Cast to Mongoose's ProjectionType<T> at the call site:
 *   Model.find(filter, projection as ProjectionType<TDoc>)
 *
 * @example { "SEO.Slug": 1 }           — dot-notation
 * @example { SEO: { Slug: 1 } }        — nested object
 * @example { SEO: 1, title: 1 }        — mixed flat
 */
export type TProjection<T> = TNestedProjection<T> & Partial<Record<DotPaths<T>, 1 | 0>>;

export interface ISearchPagination {
    query: string;
    page: number;
    limit: number;
    orderBy: string;
    orderDirection: "asc" | "desc";
}