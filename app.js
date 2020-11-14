require('dotenv').config();
const express = require('express');
const axios = require('axios')

const app = express();


// Applies Access-Control-Allow-Origin header to all API requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});


app.get('/api/feed', (req, res) => {

    axios.get(`${process.env.TWITTER_SEARCH_API}?q=${req.query.search}&resultType=popular&tweet_mode=extended`, { headers: { 'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}` } })
        .then(resp => {
            console.log(`${resp.data.statuses.length} tweets found!`)
            res.json(resp.data)
        })
        .catch(err => console.log('Error fetching tweets:', err.message))

});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server listening on Port ${PORT}`));