import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {PORT , mongoDBURL } from './config.js'

import showsRoute from './routes/showsRoute.js';



const app = express();
app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!');
})


app.use('/', showsRoute);


mongoose.connect(mongoDBURL)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        }) 
    }).catch((err) => {
        console.log(err);
    })
