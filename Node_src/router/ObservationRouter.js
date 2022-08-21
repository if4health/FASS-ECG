const router = require("express").Router()
const ObservationController = require('../controller/ObservationController');
const Observation = require('../model/observation/Observation');

router.post("/baseR4/Observation", ObservationController.createObeservation);

router.get("/baseR4/Observation/:id", ObservationController.getObservationById);

router.get("/baseR4/Observation/data/:id/:start/:end", ObservationController.getObservationByStartAndEnd);

router.get("/baseR4/Observation/data/:id/:min", ObservationController.getObservationByMin);

router.patch("/baseR4/Observation/:id", ObservationController.patchComponent);

router.put("/baseR4/Observation/:id", ObservationController.updateObservation);

router.delete("/baseR4/Observation/:id", ObservationController.deleteObservation);

module.exports = router
