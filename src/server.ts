import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import { rutas } from './rutas/rutas'

class Server {
    private app: express.Application
    constructor(){
        this.app = express()
        this.config()
        this.rutas()
    }
    private async config(){

        this.app.set('port', process.env.PORT || 3000)  // getting ready for an Heroku upload

        this.app.use(express.json()) // needed for our server to understand the json format from client
        this.app.use(cors()) // to prevent the CORS error from happening
        this.app.use(morgan('dev'))  // to ensure that the URLs called are shown
	
	
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
            next();
        });

    }

    private rutas(){
        this.app.use('/', rutas)
    }
    start(){
        this.app.listen(this.app.get('port'), 
        () => {
            console.log(`Server on port: ${this.app.get('port')}`)
        })
    }
}

const server = new Server()
server.start()
