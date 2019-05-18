import { envConfig } from "./config/env-configuration"
import * as express from "express"
import routes from "./routes/index"
import * as fs from "fs"
import { interpolateSwaggerToJson, mergeSwaggerJson } from "./config/swagger"
import * as path from "path"
import * as swaggerUI from "swagger-ui-express"

const setupRoutes = (app: express.Application) => {

    app.use(envConfig.apiBase, routes)

    let swaggerFile = fs.readFileSync(path.join(envConfig.root, "../swagger.json"), "utf-8")
    swaggerFile = interpolateSwaggerToJson(swaggerFile, envConfig)
    mergeSwaggerJson(JSON.stringify(swaggerFile)).then((contents: any) => {
        app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(contents))
    }).catch((error) => {
        console.log("Loading swagger configuration: " + error)
    })
}

export { setupRoutes }