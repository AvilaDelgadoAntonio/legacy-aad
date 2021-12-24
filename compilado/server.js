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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const rutas_1 = require("./rutas/rutas");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.rutas();
    }
    config() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.set('port', process.env.PORT || 3000); // getting ready for an Heroku upload
            this.app.use(express_1.default.json()); // needed for our server to understand the json format from client
            this.app.use((0, cors_1.default)()); // to prevent the CORS error from happening
            this.app.use((0, morgan_1.default)('dev')); // to ensure that the URLs called are shown
            this.app.use((req, res, next) => {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
                res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
                res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
                next();
            });
        });
    }
    rutas() {
        this.app.use('/', rutas_1.rutas);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log(`Server on port: ${this.app.get('port')}`);
        });
    }
}
const server = new Server();
server.start();
