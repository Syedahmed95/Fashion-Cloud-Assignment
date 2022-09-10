import app from "../app"
import http from "http"
import pino from "pino"

const createServer = http.createServer(app)

const port = process.env.PORT || 3000

createServer.listen(port, () => {
    pino().info(`Server is listening to ${port}`)
})