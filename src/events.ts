// import { TextDecoder } from "util";
// import { Protobuf } from "@meshtastic/meshtasticjs";
import { connection } from "./index.js";
import { postMessage } from "./ssb";
// import { parse } from "path/posix";

export const RegisterSubscribers = () => {
  // Receive rawByte messages
  connection.onMeshPacket.subscribe(async (packet) => {
    const payload = packet?.payloadVariant?.decoded?.payload
    console.log("MESH PACKET", payload.toString());
    /* TODO: Decode and do something with mesh packet */
    // const jsonString = Buffer.from(dataAsU8Array).toString('utf8')
  });
  connection.onTextPacket.subscribe(async (packet) => {
    // If not own node's packet
    const nodeNum = connection?.myNodeInfo?.myNodeNum;
    if (nodeNum !== packet.packet.from) {
      /* TODO: Re-assemble SSB message */
      /*
      Store parts locally
      Wait for closing packet
      Reassemble ssb message
        key = hash(content + signature)
        author = getFullId
        root = getFullRootKey
      Add message
      const { signature } = packet.packet.text
      */
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
    } else console.log("From node");
  });

  /* TODO: Private packet */
  // connection.onPrivatePacket.subscribe(async (packet) => {
  //   const msg = new TextDecoder().decode(packet.data);
  //   if (new RegExp()) {

  //   }

  //   console.log("msg");
  // });
  /* TODO: User packet */
  // connection.onUserPacket.subscribe(async (packet) => {});
};
