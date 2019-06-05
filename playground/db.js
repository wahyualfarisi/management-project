const mysql = require('mysql');
const util = require('util');
const pool  = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'management_project'
});

// pool.getConnection((err, connection) => {
//     if(err){
//         if(err.code === 'PROTOCOL_CONNECTION_LOST'){
//             console.log('Database connection wa lost')
//         }
//         if(err.code === 'ER_CON_COUNT_ERROR'){
//             console.log('Database has to many connections')
//         }
//         if(err.code === 'ECONNREFUSED'){
//             console.log('Database connection was refused ')
//         }
//     }
//     if(connection) connection.release();
//     return
// })

pool.query = util.promisify(pool.query);



module.exports = pool;