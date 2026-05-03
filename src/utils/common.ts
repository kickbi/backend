import mongoose from "mongoose";
import { TProjection } from "../interface/common.interface";


export const queryWithPaginate = async function<T>(
    Model: mongoose.Model<T>, 
    searchQuery: Object, 
    page: number, 
    limit: number, 
    orderBy: string, 
    orderDirection: "asc" | "desc", 
    projection: TProjection<T>
) {
    const totalCount = await Model.countDocuments(searchQuery);
    
    return {
        count: totalCount,
        list: await Model.find(searchQuery, projection)
            .sort({ [orderBy]: orderDirection === "asc" ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
    };
}