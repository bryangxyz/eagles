const express = require('express');
const axios = require('axios');
const router = express.Router();
const dotenv = require('dotenv').config({path: '../.env'})

router.get('/query', function(req, res) {
  // console.log('sending request with query string')
  axios({
    method: 'get', 
    url: 'https://www.googleapis.com/youtube/v3/videos',
    params: {
      id: req.query.string,
      part: 'snippet,contentDetails,statistics',
      key: 'AIzaSyCrcduTSfmMXWq9DSkXS0lQp8LaaiVZQeA'
    }
  })
  .then((response) => {
    res.send(response.data.items);
  })
  .catch((err) => {
    console.log('Youtube API get request error', err);
  })
})


module.exports = router;