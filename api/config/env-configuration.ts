import * as path from "path"
import { LOCAL_SECRET } from "./constants/conf"
import { PORT, HOST, BASE_API, SRC_PATH } from "./constants/conf"

interface IEnvironmentConfig {
    apiBase: string
    host: string
    env: string
    root: string
    ip: string
    port: number
    secret: string
}

const envConfig: IEnvironmentConfig = {
    apiBase: process.env.API_BASE || BASE_API,
    host: process.env.HOST_NAME || HOST,
    env: process.env.NODE_ENV || 'development',
    root: path.join(__dirname, SRC_PATH),
    ip: process.env.IP || '',
    port: Number(process.env.PORT) || PORT,
    secret: process.env.SECRET || LOCAL_SECRET
}

export { IEnvironmentConfig, envConfig }


// const devEnvConfig: IEnvironmentConfig = {
//     apiBase: process.env.API_BASE || '/api',
//     host: process.env.HOST_NAME || 'localhost',
//     env: process.env.NODE_ENV || 'development',
//     root: path.join(__dirname, '../src/'),
//     ip: process.env.IP || '',
//     port: Number(process.env.PORT) || 8080,
//     secrets: process.env.SECRET || LOCAL_SECRET
// }


// const prodEnvConfig: IEnvironmentConfig = {
//     apiBase: process.env.API_BASE || '/api',
//     host: process.env.HOST_NAME || 'localhost',
//     env: process.env.NODE_ENV || 'production',
//     root: path.join(__dirname, '../src/'),
//     ip: process.env.IP || '',
//     port: Number(process.env.PORT) || 8081,
//     secrets: process.env.SECRET || LOCAL_SECRET
// }



