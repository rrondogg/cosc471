const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'registrationsystem'
})

//if you dont understand whats going on just ask me or study asynchronous callback functions on your own
exports.register = (req, res) => {
    console.log(req.body);

    const {name, email, password, passwordConfirm,
    major, gender, phonenumber, gradundergrad} = req.body;

    database.query('SELECT email FROM Students WHERE Email = ?', [email], 
        async (error, results) => {
            if(error) {
                console.log(error);
            } 
            if( password !== passwordConfirm){
                return res.render('register', {
                    message: 'Passwords do not match'
                });
            }

            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);
            let randInt = Math.floor(Math.random() * 10000);

            database.query('INSERT INTO Students SET ?', {Student_ID: randInt, Name: name, GraduateOrUndergraduate: gradundergrad, PhoneNumber: phonenumber,
                Gender: gender, Major: major, Email: email, password_hash: hashedPassword}, (error, results) => {
                    if(error) {
                        console.log(error)
                    } else {
                        return res.render('register', {
                            message: 'User registered'
                        });
                    }
                })

        });
    
};

exports.searchClasses = (req, res) => {
    console.log(req.body);
    console.log("hey im in search!!")

    const searchText = req.body.searchClass; // Assuming searchText contains the text to search for

    let query = 'SELECT * FROM Classes';
    let queryParams = [];

    // Check if searchText is provided, then modify the query accordingly
    if (searchText) {
        query += ' WHERE ClassName LIKE ?';
        queryParams.push(`%${searchText}%`);
    }


    database.query(query, queryParams, (error, results) => {
        if (error) {
            console.log(error);
        }
        
        return res.render('searchClasses', {
            data: results
        });
    });
};

exports.deleteClass = (req, res) => {
    const studentID = req.session.studentID; // the actual student ID
    const crn = req.body.CRNDelete; 
    
    console.log(studentID);
    console.log(crn);
    const sql = 'DELETE FROM enrollment WHERE Student_ID = ? AND CRN = ?';
    
    database.query(sql, [studentID, crn], (error, results) => {
        if (error) {
            console.error('Error deleting enrollment:', error);
            // Handle the error
        } else {
            return res.render('mainMenu',{
                message: "Class deleted"
            })
            // Handle successful deletion
        }
    });
    
    

}


exports.addClass = (req, res) => {
    console.log(req.body);
    const Student_ID = req.session.studentID;

    console.log(req.body.CRN);
    console.log("hey im adding a class!");

    let randInt = Math.floor(Math.random() * 20000);
    console.log(randInt);

    database.query('INSERT INTO Enrollment SET ?', {Enrollment_ID: randInt, Student_ID: Student_ID, CRN: req.body.CRN},
        (error, results) => {
            if (error){
                console.log(error);
            } else {
                return res.render('searchClasses', {
                    message: "Class added"
                });
            }
        }
    )
}

exports.displayCurrentSchedule = (req, res) => {
    console.log(req.body);

    const Student_ID = req.session.studentID;

    database.query('SELECT c.CourseNumber, c.ClassName, c.MeetingTimes, c.BuildingAndRoomNo, e.CRN, p.Name FROM classes c JOIN enrollment e ON c.CRN = e.CRN JOIN teaches t ON c.CRN = t.CRN JOIN professors p ON t.Professor_ID = p.EmployeeID WHERE e.student_id = ?',
        [Student_ID], (error, results) =>{
            if(error){
                console.log(error)
            } else {
                return res.render('mainMenu', {
                    data:results
                });
            }
        }
    )
}

exports.verify = (req, res) => {
    console.log(req.body);

    const{loginEmail, loginPassword} = req.body;

    database.query('SELECT *  FROM Students WHERE Email = ?',[loginEmail],
        (error, results) => {
            if(error){
                console.log(error);          
            }

            let hashedPasswordFromDB = results[0].password_hash;
            console.log(hashedPasswordFromDB);
            bcrypt.compare(loginPassword, hashedPasswordFromDB, (err, data) =>{
                if(err) throw err;

                if(data) {
                    req.session.studentID = results[0].Student_ID; // Store Student_ID in session
                    return res.render('mainMenu');
                } else {
                    return res.render('index', {
                        message: "Invalid password"
                    });
                }
            } )
           
        });
};

