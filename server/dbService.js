const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

let instance = null;

// Creating Connection to Database
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
})

connection.connect((err) => {
    if(err)
        console.log(err.message);
})

// Class to handle all DB queries
class DbService{
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }

    // Function to get all data from DB
    async getAllData(){
        try{
            const resp = await new Promise((resolve,reject) => {
                const query = "SELECT * FROM participants;";

                connection.query(query, (err,results) => {
                    if(err) reject(new Error(err.message))
                    resolve(results);
                })
            })

            return resp
        }catch(err){
            console.log(err);
        }
    }

    // Function to insert data into DB
    async insertNewData(startTime,endTime,name){
        try{
            const insertId = await new Promise((resolve,reject) => {
                const query = "INSERT INTO participants (name,start_time,end_time) VALUES (?,?,?);";

                connection.query(query,[name,startTime,endTime],(err,results) => {
                    if(err) reject(new Error(err.message))
                    resolve(results.insertId);
                })
            })

            return {
                    id:insertId,
                    name:name,
                    start_time:startTime,
                    end_time:endTime,
                };
        }catch(err){
            console.log(err);
        }
    }

    // Function to delete a row from DB
    async deleteRowById(id){
        id = parseInt(id,10);
        try{
            const resp = await new Promise((resolve,reject) => {
                const query = "DELETE from participants where id = ?;";

                connection.query(query,[id],(err,results) => {
                    if(err) reject(new Error(err.message))
                    resolve(results.affectedRows);
                })
            })

            return resp === 1 ? true : false;
        }catch(err){
            console.log(err);
            return false;
        }
    }

    // Function to update a row from DB
    async updateDateById(id,startTime,endTime){
        id = parseInt(id,10);
        try{
            const resp = await new Promise((resolve,reject) => {
                const query = "UPDATE participants SET start_time = ?, end_time = ? WHERE id = ?;";

                connection.query(query,[startTime,endTime,id],(err,results) => {
                    if(err) reject(new Error(err.message))
                    resolve(results.affectedRows);
                })
            })

            return resp === 1 ? true : false;
        }catch(err){
            console.log(err);
            return false;
        }
    }
}

module.exports = DbService;