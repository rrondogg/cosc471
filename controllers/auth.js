const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Goldfish123',
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
        } else {
            database.query('UPDATE classes SET StudentsEnrolled = StudentsEnrolled - 1 WHERE CRN = ?', [crn], 
                (error,results) => {
                    if(error){
                        console.log(error);
                    }
                    return exports.displayCurrentSchedule(req, res);
                }
            )
        }
    });
}

function checkDuplicates(CRN, Student_ID, callback){
    database.query('SELECT * FROM enrollment WHERE Student_ID = ? AND CRN = ?',[Student_ID, CRN], (error,results) => {
        console.log("hey im in here checking for duplicates");
        if(error){
            console.log(error);
            callback(error,null);
        } else {
            if(results.length > 0){
                console.log("duplicate is true")
                callback(null,true);
            } else {
                console.log("duplicate is false")
                callback(null,false);
            }
        }
    })
}

exports.addClass = (req, res) => {
    console.log(req.body);
    const Student_ID = req.session.studentID;

    console.log(req.body.CRN);
    console.log("hey im adding a class!");

    // checking the duplicates first
    checkDuplicates(req.body.CRN, Student_ID, (error, isDuplicate) => {
        if (error) {
            console.log(error);
            return res.render('searchClasses', {
                messageFail: "Error occurred while checking duplicates"
            });
        }

        if (isDuplicate) {
            console.log("student already registered");
            return res.render('searchClasses', {
                messageFail: "Student already registered in class"
            });
        } else {
            // then do a query to get capacity 
            database.query('SELECT Capacity, StudentsEnrolled FROM classes WHERE CRN = ?', [req.body.CRN], (error, classInfo) => {
                if (error) {
                    console.log(error);
                    return res.render('searchClasses', {
                        messageFail: "Error occurred while fetching class information"
                    });
                }

                // quick check to see if class is close to capacity
                const capacity = classInfo[0].Capacity;
                const studentsEnrolled = classInfo[0].StudentsEnrolled;

                if (studentsEnrolled >= capacity) {
                    console.log("Class has reached its capacity");
                    return res.render('searchClasses', {
                        messageFail: "Class has reached its maximum capacity"
                    });
                } else {
                    // if not, do normal add
                    let randInt = Math.floor(Math.random() * 20000);
                    console.log(randInt);

                    database.query('INSERT INTO Enrollment SET ?', { Enrollment_ID: randInt, Student_ID: Student_ID, CRN: req.body.CRN },
                        (error, results) => {
                            if (error) {
                                console.log(error);
                                return res.render('searchClasses', {
                                    messageFail: "Error occurred while adding class"
                                });
                            } else {
                                // just updating the amount of students
                                database.query('UPDATE classes SET StudentsEnrolled = StudentsEnrolled + 1 WHERE CRN = ?', [req.body.CRN],
                                    (error, results) => {
                                        if (error) {
                                            console.log(error);
                                        }
                                        return res.render('searchClasses', {
                                            message: "Class added"
                                        });
                                    }
                                );
                            }
                        }
                    );
                }
            });
        }
    });
};



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
                    return res.render('startPage');
                } else {
                    return res.render('index', {
                        message: "Invalid password"
                    });
                }
            } )
           
        });
};

