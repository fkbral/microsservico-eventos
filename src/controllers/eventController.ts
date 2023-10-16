import { Response, Request, NextFunction } from "express";
import Professional from "../models/Professional";
import { createDbConnection } from "../db/dbConfig";
import { Database } from "sqlite3";
import logger from "../services/logger";


let db: Database = createDbConnection();

const professionalsRoot = (req: Request, res: Response, next: NextFunction) => {
    // logger.fatal("fatal");
    // logger.error("error");
    // logger.warn("warn");
    // logger.info("info");
    // logger.debug("debug");
    // logger.trace("trace");
    //res.sendStatus(201);

    res.send("Página Inicial professionals");
}

const professionalsList = (req: Request, res: Response) => {


    let professionalsList: Professional[] = [];

    let sql = `SELECT * FROM professionals`;

    db.all(sql, [], (error: Error, rows: Professional[]) => {
        if (error) {
            logger.error(error.message);
            res.send(error.message);
        }
        rows.forEach((row: Professional) => { professionalsList.push(row) });
        logger.info(req);
        res.send(professionalsList);
    }
    );
}

const professionalsListByYearAndRoom = (req: Request, res: Response) => {
    logger.info(req);
    let professionalsList: Professional[] = [];
    let year = req.query.year;
    let room = req.query.room?.toString().toUpperCase();

    let sql = `SELECT * FROM professionals WHERE year="${year}" AND room="${room}"`;

    db.all(sql, [], (error: Error, rows: Professional[]) => {
        if (error) {
            res.send(error.message);
        }
        if (rows.length > 0) {
            rows.forEach((row: Professional) => { professionalsList.push(row) });
            res.send(professionalsList);
        } else {
            res.send("Os parâmetros apresentados não rertonaram resultado.");
        }

    })
}


const professionalDetailsByQuery = (req: Request, res: Response) => {
    logger.info(req);
    let id = req.query.id;
    let sql = `SELECT * FROM professionals WHERE id="${id}"`;

    db.all(sql, [], (error: Error, rows: Professional[]) => {
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

const professionalDetailsByParams = (req: Request, res: Response) => {
    logger.info(req);
    let id = req.params.id;
    let sql = `SELECT * FROM professionals WHERE id="${id}"`;

    db.all(sql, [], (error: Error, rows: Professional[]) => {
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

// const addProfessional = (req: Request, res: Response) => {
//     logger.info(req);

//     let token = req.headers.authorization;

//     if (token == "Bearer 12345") {
//         let Professional: Professional = req.body;
//         let roomToUppercase: string = Professional.room.toUpperCase();

//         let sql = `INSERT INTO professionals(name, shift, year, room) VALUES ("${Professional.name}", "${Professional.shift}", "${Professional.year}", "${roomToUppercase}")`;

//         if (Professional.name && Professional.shift && Professional.year && Professional.room) {
//             db.run(sql,
//                 (error: Error) => {
//                     if (error) {
//                         res.end(error.message);
//                     }
//                     res.send(`Professional ${Professional.name} Added`);
//                 })
//         } else {
//             res.send("Erro na criação do estudante. Verifique se todos os campos foram preenchidos");
//         }
//     } else {
//         res.sendStatus(403);
//     }



// }

// const updateProfessional = (req: Request, res: Response) => {
//     logger.info(req);
//     let Professional: Professional = req.body;
//     let roomToUppercase = Professional.room.toUpperCase();
//     let sql = `UPDATE professionals SET name="${Professional.name}", 
//                                    shift="${Professional.shift}", 
//                                    year="${Professional.year}",
//                                    room="${roomToUppercase}"
//                                    WHERE id="${Professional.id}"
//                                    `;


//     db.all(sql, [], (error: Error) => {
//         if (error) {
//             res.send(error.message);
//         }
//         res.send("Professional Updated");
//     });
// }

const updateProfessionalBySpecificField = (req: Request, res: Response) => {
    logger.info(req);
    let Professional: Professional = req.body;
    let sql = `UPDATE professionals SET name="${Professional.name}"
                                   WHERE id="${Professional.id}"
    `
    db.all(sql, [], (error: Error) => {
        if (error) {
            res.send(error.message);
        }
        res.send("Professional Updated");
    })
}

const deleteProfessionalByQuery = (req: Request, res: Response) => {
    logger.info(req);
    let id = req.query.id;
    let sql = `DELETE from professionals WHERE id="${id}"`;

    db.all(sql, [], (error: Error) => {
        if (error) {
            res.send(error.message);
        }
        res.send("Professional Deleted");
    })
}

const deleteProfessionalByParams = (req: Request, res: Response) => {
    logger.info(req);
    let id = req.params.id;
    let sql = `DELETE from professionals WHERE id="${id}"`;

    db.all(sql, [], (error: Error) => {
        if (error) {
            res.send(error.message);
        }
        res.send("Professional Deleted");
    })
}



export {
    professionalsRoot,
    professionalsList,
    professionalsListByYearAndRoom,
    professionalDetailsByQuery,
    professionalDetailsByParams,
    // addProfessional,
    // updateProfessional,
    updateProfessionalBySpecificField,
    deleteProfessionalByQuery,
    deleteProfessionalByParams
};