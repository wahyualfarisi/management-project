const db = require('./db');

const getOwner = async function(){
    try {
        const result = await db.query('SELECT * FROM t_owner');
        console.log(result);
    } catch (err) {
        console.log(err)
    }
}

getOwner();

