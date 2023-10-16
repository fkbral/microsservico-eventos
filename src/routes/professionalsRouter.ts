import { Router } from "express";
import {
    professionalsRoot,
    professionalsList,
    professionalsListByYearAndRoom,
    professionalDetailsByQuery,
    professionalDetailsByParams,
    // addprofessional,
    // updateprofessional,
    deleteProfessionalByQuery,
    deleteProfessionalByParams,
    updateProfessionalBySpecificField
} from "../controllers/professionalsController";


const professionalsRouter = Router();

professionalsRouter.get("/", professionalsRoot);

professionalsRouter.get("/professionalsList", professionalsList);

professionalsRouter.get("/professionalsListByYearAndRoom", professionalsListByYearAndRoom);

professionalsRouter.get("/professionalDetails/", professionalDetailsByQuery);

professionalsRouter.get("/professionalDetails/:id", professionalDetailsByParams);

// professionalsRouter.post("/addprofessional", addprofessional);

// professionalsRouter.put("/updateprofessional", updateprofessional);

professionalsRouter.patch("/updateprofessionalBySpecificField", updateProfessionalBySpecificField);

professionalsRouter.delete("/deleteprofessional", deleteProfessionalByQuery);

professionalsRouter.delete("/deleteprofessional/:id", deleteProfessionalByParams);



export default professionalsRouter;