import {Request, Response, Router } from 'express'
import { Hospitales, Doctores } from '../model/schemas'
import { db } from '../database/database'

class Rutas {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getHospitales = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Hospitales.aggregate([
                {
                    $lookup: {
                        from: 'doctores',
                        localField: 'cod_centro',
                        foreignField: 'hospital',
                        as: "médicos"
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getHospital = async (req:Request, res: Response) => {
        const { cod_centro } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const query = await Hospitales.aggregate([
                {
                    $match: {
                        cod_centro: cod_centro
                    }

                },{
                    $lookup: {
                        from: 'doctores',
                        localField: 'cod_centro',
                        foreignField: 'hospital',
                        as: "médicos"
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }
    //A hospital document will be received in the body with the fields stated here
    private postHospital = async (req: Request, res: Response) => {
        const { cod_centro, nombre, presupuesto, num_camas, fecha_inagurado, helipuerto} = req.body
        await db.conectarBD()
        const dSchema={
            cod_centro: cod_centro,
            nombre: nombre,
            presupuesto: presupuesto,
            num_camas: num_camas,
            fecha_inagurado: fecha_inagurado,
            helipuerto: helipuerto
        }
        const oSchema = new Hospitales(dSchema)
        await oSchema.save()
            .then( (doc: any) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }
    //A doctor document will be received in the body with the fields stated here
    private postDoctor = async (req: Request, res: Response) => {
        const { num_colegiado, nombre, hospital, pacientesDiarios, horasTurno, sueldo, especialidad,
            fechaContratado, vacunadoCovid } = req.body
        await db.conectarBD()
        const dSchema={
            num_colegiado: num_colegiado,
            nombre: nombre,
            hospital: hospital,
            pacientesDiarios: pacientesDiarios,
            horasTurno: horasTurno,
            sueldo: sueldo,
            especialidad: especialidad,
            fechaContratado: fechaContratado,
            vacunadoCovid: vacunadoCovid,
        }
        const oSchema = new Doctores(dSchema)        
        
        await oSchema.save()

            .then( (doc: any) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }
    

    private getDoctor = async (req:Request, res: Response) => {
        const {num_colegiado, hospital} = req.params
        await db.conectarBD()
        .then( async ()=> {
            const j = await Doctores.findOne({
                num_colegiado: num_colegiado,
                hospital: hospital
            })
            res.json(j)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }


    private updateDoctor = async (req: Request, res: Response) => {
        const {num_colegiado, hospital} = req.params
        const {pacientesDiarios, horasTurno, sueldo, especialidad,
            fechaContratado, vacunadoCovid} = req.body
        await db.conectarBD()
        await Doctores.findOneAndUpdate({
            num_colegiado: num_colegiado,
            hospital: hospital
        },{
            pacientesDiarios: pacientesDiarios,
            horasTurno: horasTurno,
            sueldo: sueldo,
            especialidad: especialidad,
            fechaContratado: fechaContratado,
            vacunadoCovid: vacunadoCovid          
        },{
            new: true, // to receive back the document after being updated
            runValidators:true // in order for the Schema validations to be executed
        }
        )
            .then( (doc: any) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }

    private updateHospital = async (req: Request, res: Response) => {
        const {cod_centro} =req.params
        const {presupuesto, num_camas, helipuerto} = req.body
        await db.conectarBD()
        await Hospitales.findOneAndUpdate({
            cod_centro: cod_centro
        },{
            presupuesto:presupuesto,
            num_camas:num_camas,
            helipuerto:helipuerto
        },{
            new:true, // to receive back the document after being updated
            runValidators:true // in order for the Schema validations to be executed
        }
        )
            .then( (doc: any) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }


    private deleteDoctor = async (req: Request, res: Response) => {
        const {num_colegiado, hospital} = req.params
        await db.conectarBD()
        await Doctores.findOneAndDelete(
                {
                    num_colegiado: num_colegiado, 
                    hospital: hospital 
                }
            )
            .then( (doc: any) => {
                    if (doc == null) {
                        res.send(`\nERROR. NO SE HA ENCONTRADO DICHO DOCTOR`)
                    }else {
                        res.send('\nSE HA BORRADO CORRECTAMENTE: '+ doc)
                    }
            })
            .catch( (err: any) => res.send('Error: '+ err)) 
        db.desconectarBD()
    }
   

    misRutas(){
        this._router.get('/verHospitales', this.getHospitales),
        this._router.get('/verHospital/:cod_centro', this.getHospital),
        this._router.post('/ponerHospital', this.postHospital), 
        this._router.post('/ponerDoctor', this.postDoctor),
        this._router.get('/verDoctor/:num_colegiado/:hospital', this.getDoctor),
        this._router.put('/modificarDoctor/:num_colegiado/:hospital', this.updateDoctor),
        this._router.put('/modificarHospital/:cod_centro', this.updateHospital),
        this._router.delete('/borrarDoctor/:num_colegiado/:hospital', this.deleteDoctor)
    }
}
const obj = new Rutas()
obj.misRutas()
export const rutas = obj.router