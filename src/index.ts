import {
  IHTTPConnection,
  Protobuf,
  SettingsManager,
} from "@meshtastic/meshtasticjs";
import { App } from "@tinyhttp/app";
import { RegisterSubscribers } from "./events.js";


const app = new App();

SettingsManager.debugMode = Protobuf.LogRecord_Level.TRACE;
export const connection = new IHTTPConnection();
const deviceIP = "meshtastic.local";

RegisterSubscribers();
async function connect() {
  console.log("Connecting to", deviceIP);
  await connection.connect({
    address: deviceIP,
    tls: false,
    receiveBatchRequests: false,
    fetchInterval: 2000,
  });
  console.log("Connected");
}

connect()
