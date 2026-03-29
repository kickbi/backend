import { setServers } from "dns";
setServers(["8.8.8.8", "8.8.4.4"]);

import "dotenv/config";
import "./src/server";
