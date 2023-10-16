import { Response, Request, NextFunction } from "express";
import Student from "../models/Student";
import { createDbConnection } from "../db/dbConfig";
import { Database } from "sqlite3";
import logger from "../services/logger";


let db: Database = createDbConnection();

const studentsRoot = (req: Request, res: Response, next: NextFunction) => {
    // logger.fatal("fatal");
    // logger.error("error");
    // logger.warn("warn");
    // logger.info("info");
    // logger.debug("debug");
    // logger.trace("trace");
    res.sendStatus(201);

    // res.send("Página Inicial Students");
}

const studentsList = (req: Request, res: Response) => {


    let studentsList: Student[] = [];

    let sql = `SELECT * FROM students`;

    db.all(sql, [], (error: Error, rows: Student[]) => {
        if (error) {
            logger.error(error.message);
            res.send(error.message);
        }
        rows.forEach((row: Student) => { studentsList.push(row) });
        logger.info(req);
        res.send(studentsList);
    }
    );
}

const studentsListByYearAndRoom = (req: Request, res: Response) => {
    logger.info(req);
    let studentsList: Student[] = [];
    let year = req.query.year;
    let room = req.query.room?.toString().toUpperCase();

    let sql = `SELECT * FROM students WHERE year="${year}" AND room="${room}"`;

    db.all(sql, [], (error: Error, rows: Student[]) => {
        if (error) {
            res.send(error.message);
        }
        if (rows.length > 0) {
            rows.forEach((row: Student) => { studentsList.push(row) });
            res.send(studentsList);
        } else {
            res.send("Os parâmetros apresentados não rertonaram resultado.");
        }

    })
}


const studentDetailsByQuery = (req: Request, res: Response) => {
    logger.info(req);
    let id = req.query.id;
    let sql = `SELECT * FROM students WHERE id="${id}"`;

    db.all(sql, [], (error: Error, rows: Student[]) => {
        if (error) {
            res.send(error.message);
        }
        if (rows.length > 0) {
            res.send(rows[0]);
        } else {
            res.send("Estudante não existe");
        }

    }
    );
}

const studentDetailsByParams = (req: Request, res: Response) => {
    logger.info(req);
    let id = req.params.id;
    let sql = `SELECT * FROM students WHERE id="${id}"`;

    db.all(sql, [], (error: Error, rows: Student[]) => {
        if (error) {
            res.send(error.message);
        }
        if (rows.length > 0) {
            res.send(rows[0]);
        } else {
            res.send("Estudante não existe");
        }

    }
    );
}

const addStudent = (req: Request, res: Response) => {
    logger.info(req);

    let token = req.headers.authorization;

    if (token == "Bearer 12345") {
        let student: Student = req.body;
        let roomToUppercase: string = student.room.toUpperCase();

        let sql = `INSERT INTO students(name, shift, year, room) VALUES ("${student.name}", "${student.shift}", "${student.year}", "${roomToUppercase}")`;

        if (student.name && student.shift && student.year && student.room) {
            db.run(sql,
                (error: Error) => {
                    if (error) {
                        res.end(error.message);
                    }
                    res.send(`Student ${student.name} Added`);
                })
        } else {
            res.send("Erro na criação do estudante. Verifique se todos os campos foram preenchidos");
        }
    } else {
        res.sendStatus(403);
    }



}

const updateStudent = (req: Request, res: Response) => {
    logger.info(req);
    let student: Student = req.body;
    let roomToUppercase = student.room.toUpperCase();
    let sql = `UPDATE students SET name="${student.name}", 
                                   shift="${student.shift}", 
                                   year="${student.year}",
                                   room="${roomToUppercase}"
                                   WHERE id="${student.id}"
                                   `;


    db.all(sql, [], (error: Error) => {
        if (error) {
            res.send(error.message);
        }
        res.send("Student Updated");
    });
}

const updateStudentBySpecificField = (req: Request, res: Response) => {
    logger.info(req);
    let student: Student = req.body;
    let sql = `UPDATE students SET name="${student.name}"
                                   WHERE id="${student.id}"
    `
    db.all(sql, [], (error: Error) => {
        if (error) {
            res.send(error.message);
        }
        res.send("Student Updated");
    })
}

const deleteStudentByQuery = (req: Request, res: Response) => {
    logger.info(req);
    let id = req.query.id;
    let sql = `DELETE from students WHERE id="${id}"`;

    db.all(sql, [], (error: Error) => {
        if (error) {
            res.send(error.message);
        }
        res.send("Student Deleted");
    })
}

const deleteStudentByParams = (req: Request, res: Response) => {
    logger.info(req);
    let id = req.params.id;
    let sql = `DELETE from students WHERE id="${id}"`;

    db.all(sql, [], (error: Error) => {
        if (error) {
            res.send(error.message);
        }
        res.send("Student Deleted");
    })
}



export {
    studentsRoot,
    studentsList,
    studentsListByYearAndRoom,
    studentDetailsByQuery,
    studentDetailsByParams,
    addStudent,
    updateStudent,
    updateStudentBySpecificField,
    deleteStudentByQuery,
    deleteStudentByParams
};