import mongoose from "mongoose";

// Define the schema for a post
const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        location: String,
        description: String,
        picturePath: String,
        userPicturePath: String,
        likes: {
            type: Map, // Defining the 'likes' field as a Map
            of: Boolean, // Indicates the values within the Map are Booleans
        },
        comments: {
            type: Array, // Defining the 'comments' field as an Array
            default: [] // Setting an empty array as the default value
        }
    },
    { timestamps: true } // Adding timestamps for better record keeping
);

// Create a model 'Post' based on the defined schema
const Post = mongoose.model("Post", postSchema);

export default Post;