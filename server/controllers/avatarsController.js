import User from "../models/userModel.js";


export const setAvatar = async (req,res,next) => {
    try 
    {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
        isAvatarImageSet: true,
        avatarImage,
    }, {new: true});

    return res.json({isSet: userData.isAvatarImageSet, image: userData.avatarImage});
} catch (err) {
    next(err);
}
};