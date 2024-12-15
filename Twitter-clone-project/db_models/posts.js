import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    'post-profile': {
        profile_photo: { type: String, required: false },
        profile_name: { type: String, required: true },
        profile_id: { type: String, required: true },
        profile_verified: { type: Boolean, required: true }
    },
    'post-content': {
        text: { type: String, required: false },
        media: {
            'image': { type: String, required: false },
            'video': { type: String, required: false }
        }
    },
    'post-meta-data': {
        'post_time': { type: Number, required: true },
        'post_comments': { type: Number, required: true },
        'post_reposts': { type: Number, required: true },
        'post_likes': { type: Number, required: true },
        'post_views': { type: Number, required: true },
        'post_bookmarks': { type: Number, required: true },
        'post_shares': { type: Number, required: true }
    }
});

export const Post = mongoose.model('Post', postSchema);