import * as Ajv from "ajv"
import { Response, Request, NextFunction } from "express";

const ajv = Ajv({ allErrors: true, removeAdditional: 'all' })

const addScehma = (schema: object, schemaName: string) => {
    ajv.addSchema(schema, schemaName)
}

const errorResponse = (schemaErrors: any) => {
    const errors = schemaErrors.map((error: any) => {
        return {
            message: error.message,
            path: error.dataPath
        }
    })

    return { errors, status: 'failed' }
}

const validateSchema = (schemaName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const valid = ajv.validate(schemaName, req.body)
        if(!valid) return res.send(errorResponse(ajv.errors))
        next()
    }
}

export { addScehma, validateSchema }