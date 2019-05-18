import * as express from "express"
import { Response, NextFunction } from "express"
import * as compression from "compression"
import * as cors from "cors"
import * as bodyParser from "body-parser"
import * as helmet from "helmet"
import { envConfig } from "../config/env-configuration";

const configureExpress = (app: express.Application) => {

    app.use(compression())
    app.use(cors())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))           
    
    if (envConfig.env === "production") {
        app.use((req, res, next) => {
            res.setHeader("Access-Control-Alloe-Origin", "*")
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-type, Authorization, " +
                "Cache-control, Pragma")
            next()
        })
        app.use(helmet())
    } else {
        app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*")
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-type, Authorization, " +
                "Cache-control, Pragma")
            next()
        })
    }
}

export { configureExpress }