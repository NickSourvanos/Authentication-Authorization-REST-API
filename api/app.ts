import * as express from "express"
import { setupRoutes } from "./routes";
import { configureExpress } from "./config/express";
import { envConfig } from "./config/env-configuration";

class App {

    public app: express.Application

    constructor() {
        this.app = express()
        this.config()
    }

    private config = (): void => {
        configureExpress(this.app)
        setupRoutes(this.app)
    }
}

const app = new App().app

app.listen(envConfig.port, envConfig.ip,  () => {
    console.log("Server is running on port " + envConfig.port + " in " + envConfig.env + " mode")
})

export { app }
