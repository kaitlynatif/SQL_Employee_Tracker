const inquirer = require("inquirer");
const mysql = require("mysql2");

// Connect to database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employee_tracker_db",
});

// Start connection
connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database!");
    // start the application
    start();
});

// Function to start the SQL Employee Tracker
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add Department",
                "Add Role",
                "Add Employee",
                "View Departments",
                "View Roles",
                "View Employees",
                "Update Employee Role",
                "Exit",
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case "Add Department":
                    addDepartment();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "View Departments":
                    viewDepartments();
                    break;

                case "View Roles":
                    viewRoles();
                    break;

                case "View Employees":
                    viewEmployees();
                    break;

                case "Update Employee Role":
                    updateEmployeeRole();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}

// Function to add a department
function addDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "What is the name of the department?",
        })
        .then((answer) => {
            connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: answer.department,
                },
                (err) => {
                    if (err) throw err;
                    console.log("Department added successfully!");
                    start();
                    console.log(answer.department);
                }
            );
        });
}

// Function to add a role
function addRole() {
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "What is the title of the role?",
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary of the role?",
            },
            {
                name: "department_id",
                type: "input",
                message: "What is the department id of the role?",
            },
        ])
        .then((answer) => {
            connection.query(
                "INSERT INTO roles SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department_id,
                },
                (err) => {
                    if (err) throw err;
                    console.log("Role added successfully!");
                    start();
                }
            );
        });
}

// Function to add an employee
function addEmployee() {
    inquirer
        .prompt([
            {
                name: "first_name",
                type: "input",
                message: "What is the first name of the employee?",
            },
            {
                name: "last_name",
                type: "input",
                message: "What is the last name of the employee?",
            },
            {
                name: "role_id",
                type: "input",
                message: "What is the role id of the employee?",
            },
            {
                name: "manager_id",
                type: "input",
                message: "What is the manager id of the employee?",
            },
        ])
        .then((answer) => {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.role_id,
                    manager_id: answer.manager_id,
                },
                (err) => {
                    if (err) throw err;
                    console.log("Employee added successfully!");
                    start();
                }
            );
        });
}

// Function to view departments
function viewDepartments() {
    connection.query("SELECT * FROM departments", (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Function to view roles
function viewRoles() {
    connection.query("SELECT * FROM roles", (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Function to view employees
function viewEmployees() {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Function to update an employee's role
function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the id of the employee?",
            },
            {
                name: "role_id",
                type: "input",
                message: "What is the new role id of the employee?",
            },
        ])
        .then((answer) => {
            connection.query(
                "UPDATE employee SET ? WHERE ?",
                [
                    {
                        role_id: answer.role_id,
                    },
                    {
                        id: answer.id,
                    },
                ],
                (err) => {
                    if (err) throw err;
                    console.log("Employee role updated successfully!");
                    start();
                }
            );
        });
}

// Close connection to database
process.on("exit", () => {
    connection.end();
});