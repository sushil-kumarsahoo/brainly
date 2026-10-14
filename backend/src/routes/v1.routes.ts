import { Router } from "express";
import authRouter from "./auth.routes.js";
import contentRouter from "./content.routes.js";
import brainRouter from "./brain.routes.js";

const v1Router = Router();

v1Router.use("/auth",authRouter);
v1Router.use("/content",contentRouter);
v1Router.use("/brain",brainRouter);

export default v1Router;