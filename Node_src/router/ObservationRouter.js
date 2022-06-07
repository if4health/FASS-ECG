const router = require("express").Router()
const ObservationController = require('../controller/ObservationController');
const Observation = require('../model/observation/Observation');

router.post("/baseR4/Observation", ObservationController.createObeservation)

router.get("/baseR4/Observation/:id", ObservationController.getObservationById)

router.patch("/baseR4/Observation/:id", ObservationController.patchComponent);

router.put("/baseR4/Observation/:id", ObservationController.updateObservation);

module.exports = router