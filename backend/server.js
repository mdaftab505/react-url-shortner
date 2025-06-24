import {Pool} from 'pg'
import 'dotenv/config'


// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'admin',
//   port: 5432, // default PostgreSQL port
// });

 


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // required for some hosted DBs like Heroku
  }
});


export default pool

