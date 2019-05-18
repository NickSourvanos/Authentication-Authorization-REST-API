import { IEnvironmentConfig } from "./env-configuration";
import * as yaml from "js-yaml"
import {JsonRefsOptions, resolveRefs} from "json-refs";
import * as fs from "fs"
import * as path from "path"

const interpolateSwaggerToJson = (contents: string, config: IEnvironmentConfig) => {
    if(!contents) throw TypeError("Swagger configuration is empty")
    contents = contents.replace("${HOST_NAME}", config.host)
        .replace("${PORT}", config.port.toString()).replace("${API_BASE}", config.apiBase);
    return yaml.safeLoad(contents)
}

const mergeSwaggerYamls = async (contents: string, config: IEnvironmentConfig) => {
    const root = yaml.safeLoad(contents);
    const options: JsonRefsOptions = {
        refPostProcessor : (object: any) => {
            const content = fs.readFileSync(path.join(config.root, object.$ref), "utf-8")
            return yaml.safeLoad(content)
        }
    }
    return resolveRefs(root, options)
}

const mergeSwaggerJson = async (contents: string) => {
    const something = await resolveRefs(JSON.parse(contents))
    return something.resolved
}

export { interpolateSwaggerToJson, mergeSwaggerYamls, mergeSwaggerJson }