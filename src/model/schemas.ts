import { Schema, model } from 'mongoose'

const HospitalSchema = new Schema({
    cod_centro: {
        type: String,
        required: true, //to make it mandatory
        index: true,
        unique: true  //constraint: unique index (to prevent database corruption through duplicate keys)        
    },
    nombre: {
        type: String,
        required: true, //to make it mandatory     
    },
    presupuesto: Number,
    num_camas: Number,
    fecha_inagurado: Date,
    helipuerto: Boolean
}
)


const DoctorSchema = new Schema({
    num_colegiado: {
        type: String,
        required: true, //to make it mandatory
        index: true,
        unique: true  //constraint: unique index (to prevent database corruption through duplicate keys)        
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
    sueldo:Number,
    especialidad: String,
    fechaContratado: Date,
    vacunadoCovid: Boolean,    
}
)
//Collection names must be in plural, and this is how they are exported
export const Hospitales = model('hospitales', HospitalSchema)
export const Doctores = model('doctores', DoctorSchema)
