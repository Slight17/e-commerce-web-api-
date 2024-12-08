import app from "./src/app.js";
import config from "./src/configs/db.config.js";

const server = app.listen( config.app.port, () => {
    console.log(`Server is running on port ${config.app.port}`);
});

process.on(`SIGINT`, () => {
    server.close(() => {
        console.log("Server closed gracefully");
        process.exit(0);
    });
})
