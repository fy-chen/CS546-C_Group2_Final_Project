const tickets = require('./tickets');
const connection = require('../config/mongoConnection');
const { ObjectId } = require('bson');
const projects = require('./projects');
const users = require('./users');

async function main(){

    try{
        var firstproject = await projects.create('This is a project', 'Test project 1', 1);
    }catch(e){
        console.log(e);
    }

    try{
        var secondproject = await projects.create('This is another project', 'Test project 2', 1);
    }catch(e){
        console.log(e);
    }

    try{
        var thirdproject = await projects.create('This is the third project', 'Test project 3', 1);
    }catch(e){
        console.log(e);
    }

    try{
        let creator = new ObjectId();
        creator = creator.toString();

        var firstticket = await tickets.create('This is a ticket', 'Test ticket 1', 3, creator, firstproject._id, 'Functional errors');
    }catch(e){
        console.log(e);
    }


    try{
        let creator = new ObjectId();
        creator = creator.toString();
        var secondticket = await tickets.create('This is another ticket', 'Test ticket 2', 1, creator, secondproject._id, 'Usability defects');
        console.log(secondticket);
    }catch(e){
        console.log(e);
    }

    try{
        let creator = new ObjectId();
        creator = creator.toString();
        var thirdticket = await tickets.create('This is a ticket too', 'Test ticket 3', 2, creator, thirdproject._id, 'Syntax errors');
    }catch(e){
        console.log(e);
    }

    try {
        const newDeveloper1 = await users.signup({username:'developer1',password:'password1'})
    } catch (e) {
        console.log(e);
    }
    const db = await connection.connectToDb();
    await connection.closeConnection();
    
}

main().catch((error) => {
    console.log(error);
  });