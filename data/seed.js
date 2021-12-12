const tickets = require('./tickets');
const connection = require('../config/mongoConnection');
const { ObjectId } = require('bson');
const projects = require('./projects');
const users = require('./users');

async function main(){
    //create developers
    try {
        let Developer1 = await users.signup({username:'developer1',password:'password1'});
        var newDeveloper1 = await users.getByUsername('developer1');
    } catch (e) {
        console.log(e);
    }

    try {
        let Developer2 = await users.signup({username:'developer2',password:'password2'});
        var newDeveloper2 = await users.getByUsername('developer2');
    } catch (e) {
        console.log(e);
    }

    try {
        let Developer3 = await users.signup({username:'developer3',password:'password3'})
        var newDeveloper3 = await users.getByUsername('developer3');
    } catch (e) {
        console.log(e);
    }

    //create admins
    try {
        const newAdmin = await users.adminPsCreator('bigboss@42069');
        let userBody = {
            username: "Admin",
            password: "password",
            adminAccess: null,
        }
        
        
        for (let i =1; i<=2; i++){
            userBody.username= (userBody.username+i).toString();
            userBody.adminAccess = "bigboss@42069"
            await users.signup(userBody);
        }

        var admin1 = await users.getByUsername('admin1');
        var admin2 = await users.getByUsername('admin12');

    } catch (e) {
        console.log(e)
    }


    //create projects
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

    //create tickets
    try{
        var firstticket = await tickets.create('This is a ticket', 'Test ticket 1', 3, newDeveloper1._id.toString(), firstproject._id, 'Functional errors');
        const addToProject = await projects.addTickets(firstproject._id,firstticket._id);
        const user = await users.addcreatedTicket(newDeveloper1._id, firstticket._id);
    }catch(e){
        console.log(e);
    }


    try{
        var secondticket = await tickets.create('This is another ticket', 'Test ticket 2', 1, newDeveloper2._id.toString(), secondproject._id, 'Usability defects');
        const addToProject = await projects.addTickets(secondproject._id,secondticket._id);
        const user = await users.addcreatedTicket(newDeveloper2._id, secondticket._id);
    }catch(e){
        console.log(e);
    }

    try{
        var thirdticket = await tickets.create('This is a ticket too', 'Test ticket 3', 2, newDeveloper3._id.toString(), thirdproject._id, 'Syntax errors');
        const addToProject = await projects.addTickets(thirdproject._id,thirdticket._id);
        const user = await users.addcreatedTicket(newDeveloper3._id, thirdticket._id);
    }catch(e){
        console.log(e);
    }

    try{
        var fourthTicket = await tickets.create('new ticket 4', 'Test ticket 4', 2, admin1._id.toString(), thirdproject._id, 'Syntax errors');
        const addToProject = await projects.addTickets(thirdproject._id,fourthTicket._id);
        const user = await users.addcreatedTicket(admin1._id, fourthTicket._id);
    }catch(e){
        console.log(e);
    }

    try{
        var fifthTicket = await tickets.create('new ticket 5', 'Test ticket 5', 1, admin2._id.toString(), thirdproject._id, 'Syntax errors');
        const addToProject = await projects.addTickets(thirdproject._id,fifthTicket._id);
        const user = await users.addcreatedTicket(admin2._id, fifthTicket._id);
    }catch(e){
        console.log(e);
    }

    const db = await connection.connectToDb();
    await connection.closeConnection();
    
}

main().catch((error) => {
    console.log(error);
  });