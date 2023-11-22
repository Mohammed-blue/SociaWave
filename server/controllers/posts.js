import Post from '../models/Post.js';
import User from '../models/User.js';

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;

        // Finding the user based on the 'userId' to retrieve user information
        const user = await User.findById(userId);

        // Creating a new post based on the 'Post' model schema
        const newPost = new Post({
            userId,
            firstName: user.firstName,   // Using the user's firstName for the post
            lastName: user.lastName,     // Using the user's lastName for the post
            location: user.location,     // Using the user's location for the post
            description,                 // Description of the new post
            userPicturePath: user.picturePath,  // Using the user's picture path for the post's author
            picturePath,                 // Picture path for the new post
            likes: {},                   // Initializing 'likes' as an empty Map
            comments: []                 // Initializing 'comments' as an empty Array
        });

        // Saving the new post to the database
        await newPost.save();

        // Retrieving all posts after the new post addition
        const post = await Post.find();

        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};


/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();  // Retrieving all posts from the 'Post' collection in the database
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;  // Extracting 'userId' from the request parameters
        const post = await Post.find({ userId });   // Retrieving posts associated with the provided 'userId'
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}


/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);   // Retrieving the post by its 'id' from the 'Post' collection
        const isLiked = post.likes.get(userId);  // Checking if the user has already liked the post

        if (isLiked) {
            post.likes.delete(userId);  // If liked, remove the like
        } else {
            post.likes.set(userId, true); // If not liked, set the like for the user
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },  // Update the 'likes' field with the new 'likes' Map
            { new: true }  // Returns the modified document
        )
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};