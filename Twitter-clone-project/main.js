import express from "express"
import mongoose from "mongoose"
import { Post } from "./db_models/posts.js"

import { dirname } from "node:path"
import { fileURLToPath } from 'node:url'

let conn = await mongoose.connect('mongodb://localhost:27017/twitter_clone')

const app = express()
const port = 3000

app.use('/src', express.static('src'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: dirname(fileURLToPath(import.meta.url)) })
})

app.post('/get_posts', async (req, res) => {
    let db_posts = await Post.find({})
    res.json(db_posts);
})

app.post('/upload_post', (req, res) => {
    try {
        let post_data = req.body
        if (post_data['post-profile'].profile_photo == '')
            post_data['post-profile'].profile_photo = '/src/images/default_profile_200x200.png';

        post_data['post-meta-data'] = {
            'post_time': Date.now(),
            'post_comments': 0,
            'post_reposts': 0,
            'post_likes': 0,
            'post_views': 0,
            'post_bookmarks': 0,
            'post_shares': 0
        }
        let post = new Post(post_data);
        post.save();
        res.sendStatus(202);
    } catch (e) {
        console.log(e)
        res.sendStatus(500);
    }
})

app.post('/post_footer_command', async (req, res) => {
    let post_id = req.body['post-id']
    let update = req.body['update']
    await Post.findByIdAndUpdate(post_id, { $inc: { [`post-meta-data.${update}`]: 1 } });
    res.sendStatus(202);
})

app.listen(port, () => {
    console.log(`App is listening at http://localhost:3000`)
})