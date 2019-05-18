import { Request, Response, NextFunction } from "express"
import * as jwt from "jsonwebtoken"
import { knex } from "../config/db/database-configuration";
import { SUPER_USER, ADMIN_ROLE, BASIC_USER, EXPIRATION_TIME, USER_DOES_NOT_EXIST } from "../config/constants/conf";
import { UNAUTHORIZED} from "../config/constants/conf";
import * as bc from 'bcrypt'
import UserModel from "../models/UserModel"
import { validateUser, update, createUser, removeUser, getUserRole, getAllUsers, updatePassword, findUserByUserId } from "../common/validations/auth-validations";
import {  PASSWORDS_DO_NOT_MATCH } from "../config/constants/conf";
import User from "../models/User";
import { envConfig } from "../config/env-configuration";

//get users list
const getUsers = (req: Request, res: Response, next: NextFunction) => {   
  try{
    jwt.verify(req.body.token, envConfig.secret, (err: any) => {
        
        let user: User = jwt.verify(req.body.token, envConfig.secret) as User
        getUserRole(user) == SUPER_USER ? getAllUsers(res)
        : 
        user.role == ADMIN_ROLE || user.role == BASIC_USER ?
          validateUser(user, user.application)
            ? err 
              ? res.json({ message: err.message }) 
              : getAllUsers(res)
            
          : res.status(401).json({ message: UNAUTHORIZED })
        : res.status(401).json({ message: UNAUTHORIZED })
    })
  }catch(err) { next() }
}
//find user by id
const findUserById = (req: Request, res: Response, next: NextFunction) => {
  try{
    jwt.verify(req.body.token, envConfig.secret, (err: any) => {
        let user: User = jwt.verify(req.body.token, envConfig.secret) as User        
        getUserRole(user) == SUPER_USER ? findUserByUserId(req.params.id, res)
        :
        user.role == ADMIN_ROLE || user.role == BASIC_USER ?
          validateUser(user, user.application)
          ?  err 
              ? res.json({ message: err.message })
              : findUserByUserId(req.params.id, res)
          : res.status(401).json({ message: UNAUTHORIZED })
        : res.status(401).json({ message: UNAUTHORIZED })
    })
  }catch(err) { next() }
}
//create user
const addUser = (req: Request, res: Response, next: NextFunction) => {
  try{
    jwt.verify(req.body.token, envConfig.secret, (err: any) => { 
        let user: User = jwt.verify(req.body.token, envConfig.secret) as User
        getUserRole(user) == SUPER_USER ? createUser(req.body as User, res) :
        user.role == ADMIN_ROLE ?
          validateUser(user, user.application)
            ? err ? res.json({ message: err.message })
            : createUser(req.body as User, res)      
          : res.status(401).json({ message: UNAUTHORIZED })
        : res.status(401).json({ message: UNAUTHORIZED })
    })
  }catch(err) { next() }
}
//update user
const updateUser = (req: Request, res: Response, next: NextFunction) => {
  try{
    jwt.verify(req.body.token, envConfig.secret, (err: any) => { 
        let user: User = jwt.verify(req.body.token, envConfig.secret) as User
        getUserRole(user) == SUPER_USER ? update(req.params.id, req.body as User, res) :
          user.role == ADMIN_ROLE ?
          validateUser(user, user.application)
            ? err ? res.json({ message: err.message })
              : update(req.params.id, req.body as User, res)           
          : res.status(401).json({ message: UNAUTHORIZED })
        : res.status(401).json({ message: UNAUTHORIZED })
    })
  }catch(err) { next() }
}
//delete user
const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  try{
    jwt.verify(req.body.token, envConfig.secret, (err: any) => {
        let user: User = jwt.verify(req.body.token, envConfig.secret) as User
        getUserRole(user) == SUPER_USER ? removeUser(req.params.id, res) :
          user.role ==  ADMIN_ROLE ?
          validateUser(user, user.application)
            ? err ? res.json({ message: err.message })
            : removeUser(req.params.id, res)       
          : res.status(401).json({ message: UNAUTHORIZED })
        : res.status(401).json({ message: UNAUTHORIZED })
    })
  }catch(err) { next() }
}

const passwordUpdate = (req: Request, res: Response, next: NextFunction) => {
    try{
      jwt.verify(req.body.token, envConfig.secret, (err: any) => { 
          let user: User = jwt.verify(req.body.token, envConfig.secret) as User
          getUserRole(user) == SUPER_USER ? updatePassword(req.params.id, req.body as User, res) :
            user.role == ADMIN_ROLE ?
            validateUser(user, user.application)
              ? err ? res.json({ message: err.message })
                : updatePassword(req.params.id, req.body as User, res)           
            : res.status(401).json({ message: UNAUTHORIZED })
          : res.status(401).json({ message: UNAUTHORIZED })
      })
    }catch(err) { next() }
}

const login = (req: Request, res: Response) => {
    let userObj: UserModel
    knex('users').where({ email: req.body.email }).first().then(user => {
        userObj = user
        return bc.compare(req.body.password, user.password)
    }).then(passMatch => {
        if(!passMatch) res.status(403).json({ message: PASSWORDS_DO_NOT_MATCH })

        jwt.sign(userObj, envConfig.secret, { expiresIn: EXPIRATION_TIME }, (err: any, token: string) =>
        err 
            ? res.json({ mesage: err.message })
            : res.json({ token: token })
        )        
    }).catch(err => res.status(400).json({ message: USER_DOES_NOT_EXIST }))     
}

export { getUsers, addUser, findUserById, updateUser, deleteUser, login, passwordUpdate }