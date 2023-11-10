import User from "../models/User.js";

/* READE */
/* READ Endpoint to fetch user data */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params // Extracting the user ID from the request parameters
        const user = await User.findById(id);  // Fetching the user data from the database based on the provided ID
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}


export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id);

        // Fetch the user's friends' data concurrently
        const friends = await Promise.all(
            // Map over the user's friend IDs
            user.friends.map((id) => {
            // Fetch individual friend data using their ID
            User.findById(id)
        })
        )

        // Format the fetched friend data to include specific fields
        const formattedFriends = await friends.map((
            {
                _id,
                firstName,
                lastName,
                occupation,
                location,
                picturePath
            }
            ) => {
                return { _id, firstName, lastName, occupation, location, picturePath }
            }
        )

        res.status(200).json(formattedFriends);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}


/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        // Extract IDs for the user and friend from the request parameters
        const { id, friendId } = req.params;
        // Find the user data based on the provided user ID
        const user = await User.findById(id);
        // Find the friend data based on the provided friend ID
        const friend = await User.findById(friendId);

        // Check if the friend ID is already in the user's friends list
        if (user.friends.includes(friendId)) {
            // Remove friend from the user's friend list
            user.friends = user.friends.filter((id) => id !== friendId)
            // Remove user from the friend's friend list
            friend.friends = friend.friends.filter((id) => id !== id)
        } else {
            // Add friend ID to the user's friend list
            user.friends.push(friendId);
            // Add user ID to the friend's friend list
            friend.friends.push(id);
        }

        // Save changes made to the user and friend objects
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => {
            User.findById(id)
        })
        )

        const formattedFriends = await friends.map((
            {
                _id,
                firstName,
                lastName,
                occupation,
                location,
                picturePath
            }
            ) => {
                return { _id, firstName, lastName, occupation, location, picturePath }
            }
        )
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}