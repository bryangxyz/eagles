const express = require('express');
const axios = require('axios');
const router = express.Router();
const ScreenshotApi = require('screenshotapi');

const API_KEY = 'c4fba7e3-338b-4f78-affe-a8af4ad07e2a';
 
router.post('/screenshot', function(req,res){
  var captureRequest = {
    url: req.body.url,
    webdriver: 'firefox',
    viewport: '1480x1037',
    fullpage: true,
    javascript: true
  };
   
  ScreenshotApi.captureScreenshot(
    API_KEY,        // your api key 
    captureRequest
    )
    .then( (localFile) => {
      console.log(`Downloaded to ${localFile}`);
      res.send(localFile);
    })
    .catch( (err) => {
      console.error('Error capturing screenshot:', err);
  })

})

module.exports = router; 