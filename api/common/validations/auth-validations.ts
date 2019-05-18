import { Request, Response, NextFunction } from "express"
import { UNAUTHORIZED, BCRYPT_SALT_ROUNDS, USER_CREATED, EMAIL_IN_USE, USER_DELETED, INVALID_USER_SUPLIED, PASSWORD_CHANGED, USER_UPDATED, USER_DOES_NOT_EXIST, INVALID_USER, INVALID_USER_ID } from "../../config/constants/conf"
import User from "../../models/User"
import UserModel from "../../models/UserModel"
import { knex } from "../../config/db/database-configuration"
import * as bc from "bcrypt"

const verifyToken = (req:Request, res: Response, next: NextFunction) => {    //Check if heder is undefined    
    const bearerHeader = req.headers['authorization']   //Get auth header value

    if(typeof bearerHeader !== 'undefined') {        
        const bearer = bearerHeader.split(' ')  //split token from Bearer         
        const bearerToken = bearer[1]   //and keep only the token        
        req.body.token = bearerToken    //append token to request body
        next()
    } else{        
        res.status(403).json({ message: UNAUTHORIZED }) //if anuothorizd return forbiden
        next()
    }
}

const checkIfUserHasApplicationAccess = (user: User, application: string): boolean => user.application == application

const checkIfUserIsValid = (user: User): boolean => user.active 

const getUserRole = (user: User): string => user.role

const checkIfUserIsAuthorized = (user: User, role: string) => user.role == role
    
const validateUser = (user: User, application: string) => 
    checkIfUserHasApplicationAccess(user, application) &&
    checkIfUserIsValid(user)

const checkIfUserexists = (userId: number): Promise<UserModel> => { 
    const user: Promise<UserModel> = Promise.resolve<UserModel>(knex('users').where({ id: userId }).first()
    .then( user => user).catch( err => err))    
    return user
}

const findUserByUserId = (userId: number, res: Response) => { 
    knex('users').where({ id: userId }).first()
    .then( user => { res.status(200).json({ user: user }) }).catch( err => err)   
}

const getAllUsers = (res: Response) => knex.select().from('users').then(users => res.send(users))

const createUser = (bUser: User, res: Response) => {
    knex('users').select('email').where({email: bUser.email}).first()
    .then((user) => {
    user == undefined
        ? bc.hash(bUser.password, BCRYPT_SALT_ROUNDS)
        .then((hashedPassword: string) => 
        knex('users').insert({
            name: bUser.name,
            email: bUser.email,
            password: hashedPassword,
            role: bUser.role,
            social: bUser.social,
            application: bUser.application,
            active: bUser.active        
            }).then(() =>  res.status(200).json({ message: USER_CREATED })).catch(() => res.send(400).json({ message: INVALID_USER_SUPLIED }))
        )              
    : res.status(409).json({ message: EMAIL_IN_USE }) }).catch(err => err)
}

const removeUser = (userId: number, res: Response) => {
    knex('users').select('id').where({id: userId}).first().then((user) => 
        user == undefined ? res.status(400).json({ response: INVALID_USER_ID }) :
        knex('users').where({ id: userId }).del().then(() =>         
        res.status(204).json({ message: USER_DELETED })).catch(err => res.json({ response: err }))
 )
}

const update = (userId: number, bUser: User, res: Response) => {
    knex('users').select('id').where({id: userId}).first().then((user) => 
        user == undefined ? res.status(400).json({ response: INVALID_USER_ID }) :
            knex('users').select('email').where({email: bUser.email}).first()
            .then((user) => 
                user == undefined ?
                knex('users').where({ id: userId }).update({ 
                    name: bUser.name,
                    email: bUser.email,
                    role: bUser.role,
                    social: bUser.social,
                    application: bUser.application,        
                    active: bUser.active
                }).then(() =>  res.json({ response: USER_UPDATED })) 
                .catch( err => res.json({ response: err }))
                :res.status(409).json({ message: EMAIL_IN_USE })
            ).catch(err => res.status(400).json({ response:err }))
    )
}

const updatePassword = (userId: number, bUser: User, res: Response) => {
    console.log(userId + ", " + bUser.password)
    knex('users').where({ id: userId }).update({
        password: bc.hash(bUser.password, BCRYPT_SALT_ROUNDS)
    }).then(() => res.status(200).json({ response: PASSWORD_CHANGED }))
    .catch(err => res.json({ response: err }))
}
    
export { 
    checkIfUserHasApplicationAccess, 
    getUserRole, 
    checkIfUserIsValid, 
    validateUser, 
    checkIfUserexists, 
    update,
    createUser,
    removeUser, 
    verifyToken,
    getAllUsers,
    checkIfUserIsAuthorized,
    updatePassword,
    findUserByUserId
}