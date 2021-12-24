"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doctores = exports.Hospitales = void 0;
const mongoose_1 = require("mongoose");
const HospitalSchema = new mongoose_1.Schema({
    cod_centro: {
        type: String,
        required: true,
        index: true,
        unique: true //constraint: unique index (to prevent database corruption through duplicate keys)        
    },
    nombre: {
        type: String,
        required: true, //to make it mandatory     
    },
    presupuesto: Number,
    num_camas: Number,
    fecha_inagurado: Date,
    helipuerto: Boolean
});
const DoctorSchema = new mongoose_1.Schema({
    num_colegiado: {
        type: String,
        required: true,
        index: true,
        unique: true //constraint: unique index (to prevent database corruption through duplicate keys)        
    },
    nombre: {
        type: String,
        required: true, //to make it mandatory     
    },
    hospital: {
        type: String,
        required: true, //to make it mandatory, since it is key because it links both collections    
    },
    pacientesDiarios: Number,
    horasTurno: Number,
    sueldo: Number,
    especialidad: String,
    fechaContratado: Date,
    vacunadoCovid: Boolean,
});
//Collection names must be in plural, and this is how they are exported
exports.Hospitales = (0, mongoose_1.model)('hospitales', HospitalSchema);
exports.Doctores = (0, mongoose_1.model)('doctores', DoctorSchema);
