import { TextDecoder } from "util";

import { Protobuf } from "@meshtastic/meshtasticjs";
import { connection } from "./index.js";
import { postMessage } from "./ssb";


export const RegisterSubscribers = () => {
  connection.onTextPacket.subscribe(async (packet) => {
    const nodeNum = connection?.myNodeInfo?.myNodeNum;
    if (nodeNum !== packet.packet.from) {
      try {
        const content = {
          type: "post",
          text: packet.data,
          loraTo:
            packet.packet.to === 0xffffffff ? -1 : packet.packet.to.toFixed(2),
          loraPacketId: packet.packet.id.toFixed(2),
          loraFrom: packet.packet.from.toFixed(2),
          loraChannel: packet.packet.channel,
          loraRxSnr: packet.packet.rxSnr,
        };
        await postMessage(content);
      } catch (err) {
        console.log("Error sending message", err);
      }
    } else console.log('From node')
  });

  connection.onPrivatePacket.subscribe(async (packet) => {
    const msg = new TextDecoder().decode(packet.data);
    // if (new RegExp()) {

    // }

    console.log("msg");
  });

  connection.onUserPacket.subscribe(async (packet) => {
  });
};
