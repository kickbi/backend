import mongoose, { ProjectionType } from "mongoose";
import Chapter from "../../models/course/chapter.model";
import Course from "../../models/course/course.model";
import Topic from "../../models/course/topic.model";
import { TProjection, ISearchPagination } from "../../interface/common.interface";
import { queryWithPaginate } from "../../utils/common";
import { TChapterDocument, TCourseDocument, TTopicDocument } from "../../interface/document.interface";

export const listCourses = async (params: ISearchPagination, projection: TProjection<TCourseDocument>) => {

    const searchFilter = params.query
        ? {
              Title: { $regex: params.query, $options: "i" },
          }
        : {};

    return queryWithPaginate(
        Course,
        searchFilter,
        params.page,
        params.limit,
        params.orderBy,
        params.orderDirection,
        projection
    )
};


export const getCourseBySlug = async (slug: string, projection: TProjection<TCourseDocument>) => {
    const course = await Course.findOne({ Slug: slug }, projection).lean();
    return course;
};


export const listCourseChapters = async (courseId: string | mongoose.Types.ObjectId, projection: TProjection<TChapterDocument>) => {
    const chapters = await Chapter.find({ CourseId: courseId }, projection)
        .sort({ Order: 1 })
        .lean();

    return chapters;
};



