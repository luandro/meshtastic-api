import got from 'got';

import { Protobuf } from '@meshtastic/meshtasticjs';

import { connection } from './index.js';
import { prisma } from './prisma.js';

interface Packet {
  psk: string;
  data: Uint8Array;
}

export const handlePacket = (
  // peerId: string,
  packet: Packet
) => {
  const meshPacket = Protobuf.FromRadio.fromBinary(packet.data);

  if (!meshPacket) {
    console.log("failed");

    // console.log(`Failed to parse packet from ${peerId}`);
    return;
  }

  console.log(meshPacket);

  //if all "checks" pass forward the packet on to the network
  connection.sendRaw(packet.data);
};

export const dispatchPacket = async (
  // peerId: string,
  packet: Protobuf.MeshPacket
) => {
  // const peer = await prisma.peer.findUnique({
  //   where: {
  //     id: peerId,
  //   },
  // });

  // if (!peer) {
  //   console.log(`Peer ${peerId} not found`);
  //   return;
  // }

  // forward to all peers for now

  const peers = await prisma.peer.findMany();

  for (const peer of peers) {
    const toSend: Packet = {
      psk: peer.psk,
      data: Protobuf.ToRadio.toBinary({
        payloadVariant: {
          oneofKind: "packet",
          packet,
        },
      }),
    };

    await got.post(`https://${peer.ip}/ingest`, {
      json: toSend,
    });
  }
};
