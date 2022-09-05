const app = require("express")()
require("dotenv").config()
const bp = require('body-parser')

const mongoDB = require('./mongo')

const patientRouter = require('./router/PatientRouter')
const observationRouter = require('./router/ObservationRouter')

const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

mongoDB.mongodb.once("open", _ => {
  console.log("Mongo Conectado")
})

let allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
}

app.use(allowCrossDomain);

app.set('view engine', 'html')

app.use(bp.json({limit: '50mb', extended: true}))
  .use(bp.urlencoded({limit: '50mb',extended: true }))
  .use(patientRouter)
  .use(observationRouter)

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log("server started: " + PORT)
})
