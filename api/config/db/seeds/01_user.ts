import * as Knex from "knex";

exports.seed = async (knex: Knex): Promise<any> => 
    // Deletes ALL existing entries
    await knex("users").del()
        .then(function () {
            // Inserts seed entries
            return knex("users").insert([
                { name: "Nick Sourvanos", email: 'nikos@gmail.com', password: 'root', role: 'su', application: 'rest-api-app', active: true },
                { name: "Peter Pan", email: 'peter@gmail.com', password: 'peter', role: 'admin',  application: 'rest-api-app', active: true },
                { name: "Takis Takas", email: 'takis@gmail.com', password: 'takis', role: 'user',  application: 'rest-api-app', active: true }
            ])
        })

