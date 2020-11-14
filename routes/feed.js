const express = require('express');
const router = express.Router();

const axios = require('axios')

router.get('/', (req, res) => {

    // axios.get('https://api.twitter.com/1.1/search/tweets.json?q=SamSchaeferSays', { headers: { 'Authorization': 'AAAAAAAAAAAAAAAAAAAAAI4OHgEAAAAAlbk0HSIAqcc3havrrU9j2NeAQ34%3DzJmzwHuQerd8JJ2TeuHfqwKgBt6bK4tk93w3ocBB2vPuKMF3cG' } })
    //     .then(resp => console.log('Response', resp))
    //     .catch(err => console.log('Error', err))
})

module.exports = router;