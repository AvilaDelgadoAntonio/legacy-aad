"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rutas = void 0;
const express_1 = require("express");
const schemas_1 = require("../model/schemas");
const database_1 = require("../database/database");
class Rutas {
    constructor() {
        this.getHospitales = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Hospitales.aggregate([
                    {
                        $lookup: {
                            from: 'doctores',
                            localField: 'cod_centro',
                            foreignField: 'hospital',
                            as: "médicos"
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getHospital = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { cod_centro } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Hospitales.aggregate([
                    {
                        $match: {
                            cod_centro: cod_centro
                        }
                    }, {
                        $lookup: {
                            from: 'doctores',
                            localField: 'cod_centro',
                            foreignField: 'hospital',
                            as: "médicos"
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        //A hospital document will be received in the body with the fields stated here
        this.postHospital = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { cod_centro, nombre, presupuesto, num_camas, fecha_inagurado, helipuerto } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                cod_centro: cod_centro,
                nombre: nombre,
                presupuesto: presupuesto,
                num_camas: num_camas,
                fecha_inagurado: fecha_inagurado,
                helipuerto: helipuerto
            };
            const oSchema = new schemas_1.Hospitales(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        //A doctor document will be received in the body with the fields stated here
        this.postDoctor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { num_colegiado, nombre, hospital, pacientesDiarios, horasTurno, sueldo, especialidad, fechaContratado, vacunadoCovid } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                num_colegiado: num_colegiado,
                nombre: nombre,
                hospital: hospital,
                pacientesDiarios: pacientesDiarios,
                horasTurno: horasTurno,
                sueldo: sueldo,
                especialidad: especialidad,
                fechaContratado: fechaContratado,
                vacunadoCovid: vacunadoCovid,
            };
            const oSchema = new schemas_1.Doctores(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.getDoctor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { num_colegiado, hospital } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const j = yield schemas_1.Doctores.findOne({
                    num_colegiado: num_colegiado,
                    hospital: hospital
                });
                res.json(j);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.updateDoctor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { num_colegiado, hospital } = req.params;
            const { pacientesDiarios, horasTurno, sueldo, especialidad, fechaContratado, vacunadoCovid } = req.body;
            yield database_1.db.conectarBD();
            yield schemas_1.Doctores.findOneAndUpdate({
                num_colegiado: num_colegiado,
                hospital: hospital
            }, {
                pacientesDiarios: pacientesDiarios,
                horasTurno: horasTurno,
                sueldo: sueldo,
                especialidad: especialidad,
                fechaContratado: fechaContratado,
                vacunadoCovid: vacunadoCovid
            }, {
                new: true,
                runValidators: true // in order for the Schema validations to be executed
            })
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.updateHospital = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { cod_centro } = req.params;
            const { presupuesto, num_camas, helipuerto } = req.body;
            yield database_1.db.conectarBD();
            yield schemas_1.Hospitales.findOneAndUpdate({
                cod_centro: cod_centro
            }, {
                presupuesto: presupuesto,
                num_camas: num_camas,
                helipuerto: helipuerto
            }, {
                new: true,
                runValidators: true // in order for the Schema validations to be executed
            })
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.deleteDoctor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { num_colegiado, hospital } = req.params;
            yield database_1.db.conectarBD();
            yield schemas_1.Doctores.findOneAndDelete({
                num_colegiado: num_colegiado,
                hospital: hospital
            })
                .then((doc) => {
                if (doc == null) {
                    res.send(`\nERROR. NO SE HA ENCONTRADO DICHO DOCTOR`);
                }
                else {
                    res.send('\nSE HA BORRADO CORRECTAMENTE: ' + doc);
                }
            })
                .catch((err) => res.send('Error: ' + err));
            database_1.db.desconectarBD();
        });
        this._router = (0, express_1.Router)();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/verHospitales', this.getHospitales),
            this._router.get('/verHospital/:cod_centro', this.getHospital),
            this._router.post('/ponerHospital', this.postHospital),
            this._router.post('/ponerDoctor', this.postDoctor),
            this._router.get('/verDoctor/:num_colegiado/:hospital', this.getDoctor),
            this._router.put('/modificarDoctor/:num_colegiado/:hospital', this.updateDoctor),
            this._router.put('/modificarHospital/:cod_centro', this.updateHospital),
            this._router.delete('/borrarDoctor/:num_colegiado/:hospital', this.deleteDoctor);
    }
}
const obj = new Rutas();
obj.misRutas();
exports.rutas = obj.router;
