import { Router } from "express"; //A mini Express app that you can attach routes to. Helps keep routes modular instead of filling up app.js.
import { healthCheck } from "../controllers/healthcheck.controller.js";

//Creates a new instance of Express Router.
//This router will hold all routes defined in this file.
const router = Router()

//.route("/") → Defines the base route for this router (here it’s /).
router.route("/").get(healthCheck) //.get(healthCheck) → On a GET request, run the healthCheck controller.

export default router //Exports the router so it can be used in your main app.js or index.js.
