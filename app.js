const fetch = require('isomorphic-fetch')
const _ = require('lodash')
const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3')
const watsonVisionApiKey = 'YOUR WATSON VISION API KEY'
const YaTranslateApiKey = 'YOUR YANDEX TRANSLATE API KEY'
const translate = require('yandex-translate')(YaTranslateApiKey)
const express = require('express')
const bodyParser = require('body-parser')
const vkApiV = '5.60'
const app = express()

const visualRecognition = new VisualRecognitionV3({
  api_key: watsonVisionApiKey,
  version_date: '2016-05-19'
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.post('/image', (request, response) => {
  let src = request.body.src
  console.log(src)
  visualRecognition.detectFaces({url: src}, (err, res) => {
    if (err) throw err

    if (res.images.length == 0 || res.images[0].faces.length == 0) {

      visualRecognition.classify({url: src}, (err, res) => {
        if (err) throw err

        let classes = _.sortBy(res.images[0].classifiers[0].classes, 'score')
        translate.translate(_.last(classes).class, {to: "ru"}, (err, res) => {
          response.send({type: 'classes', data: res})
        })

      })

    } else {
      response.send({type: 'faces', data: res})
    }
  })
})

app.listen(8000, () => console.log('listening on port 3000'))
