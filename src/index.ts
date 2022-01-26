import {
  ISerialConnection,
  IHTTPConnection,
  Protobuf,
  SettingsManager,
} from "@meshtastic/meshtasticjs";
import { App } from "@tinyhttp/app";
import { RegisterSubscribers } from "./events.js";


const app = new App();

SettingsManager.debugMode = Protobuf.LogRecord_Level.TRACE;
export const connection = new IHTTPConnection();
export const serialConnection = new ISerialConnection();
const deviceIP = "meshtastic.local";

RegisterSubscribers();
async function connect() {
  // const ports = await serialConnection.getPorts()
  // console.log("🚀 ~ file: index.ts ~ line 22 ~ connect ~ ports", ports)
  // TODO: Check if serial or wifi
  const httpParams = {
    address: deviceIP,
    tls: false,
    receiveBatchRequests: false,
    fetchInterval: 2000,
  }
  // const serialParams = {
  //   baudRate: 18282,
  //   port: ports[0]
  // }
  // TODO: run wifi connection if no serial
  console.log("Connecting to", deviceIP);
  await connection.connect(httpParams);
  // await serialConnection.connect(serialParams);
  console.log("Connected");
}

connect()
