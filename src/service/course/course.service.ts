import mongoose from "mongoose";
import Chapter from "../../models/course/chapter.model";
import Course from "../../models/course/course.model";
import Topic from "../../models/course/topic.model";
import { IProjection } from "../../interface/common.interface";

export const listCourses = async (projection: IProjection) => {
    const courses = await Course.find().projection(projection).lean();
    return courses;
};


export const getCourseById = async (courseId: string, projection: IProjection) => {
    const course = await Course.findById(courseId).projection(projection).lean();

    // if there are AI explanation versions for the course, select one random version and return it.
    if (course && course.AIExplanationVersions && course.AIExplanationVersions.length > 0) {
        const randomIndex = Math.floor(Math.random() * course.AIExplanationVersions.length);
        course.AIExplanationVersions = [course.AIExplanationVersions[randomIndex]];
    }

    return course;
};


export const listCourseChapters = async (courseId: string, projection: IProjection) => {
    const chapters = await Chapter.find({ CourseId: courseId })
        .projection(projection)
        .sort({ Order: 1 })
        .lean();

    return chapters;
};


export const getTopicById = async (topicId: string, projection: IProjection) => {
    const topic = await Topic.findById(topicId).projection(projection).lean();

    // Select one random AIExplanationVersion from Content so we don't ship all versions to the client.
    if (topic && topic.Content?.AIExplanationVersions && topic.Content.AIExplanationVersions.length > 0) {
        const randomIndex = Math.floor(Math.random() * topic.Content.AIExplanationVersions.length);
        topic.Content.AIExplanationVersions = [topic.Content.AIExplanationVersions[randomIndex]];
    }

    const previousTopic = await Topic.findOne({
        ChapterId: topic.ChapterId,
        Order: topic.Order - 1,
    })
        .projection({ _id: 1, Title: 1 })
        .lean();

    const nextTopic = await Topic.findOne({ ChapterId: topic.ChapterId, Order: topic.Order + 1 })
        .projection({ _id: 1, Title: 1 })
        .lean();

    if (previousTopic) {
        topic.PreviousTopic = previousTopic;
    }

    if (nextTopic) {
        topic.NextTopic = nextTopic;
    }
    return topic;
};

