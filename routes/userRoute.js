const { Router } = require('express')
const router = Router();

router.post("/sigin")
router.post("/login")
router.get("/cources")
router.post("/courses/:courseId")
router.get("/purchasedCourses")

module.exports = router;