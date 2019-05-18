// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'root' ,
      database: 'users'      
    },
    migrations: {
      directory: 'C:\\Users\\nsourvanos\\Desktop\\Testing\\Typescript\\authentication-authorization-rest\\lib\\db\\migrations'   
    },
    seeds: {
      directory: 'C:\\Users\\nsourvanos\\Desktop\\Testing\\Typescript\\authentication-authorization-rest\\lib\\db\\seeds'
    }
  }
};
