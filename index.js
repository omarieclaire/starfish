const express = require('express');
const path = require('path');
const osc = require("osc");
const WebSocket = require("ws");
const DynRescale = require("./dynRescale.module");

console.log("starting");

/*
let input1Scale = new DynRescale();
let input2Scale = new DynRescale();
let input3Scale = new DynRescale();
let input4Scale = new DynRescale();

let inputScalers = {"/data/830/norm0": input1Scale, "/data/1027/norm0" : input2Scale, "/data/791/norm0": input3Scale, "/data/929/norm0": input4Scale};
*/
let inputScalers = {};
// Express server setup
const app = express();
const port = 3000;

// UDP/OSC setup
const MULTICAST_ADDRESS = "239.0.0.1";
const UDP_PORT = 9090;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Express server
app.listen(port, () => {
    console.log(`Web server running at http://localhost:${port}`);
});

// Set up UDP port for OSC
const udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: UDP_PORT,
    metadata: true
});

// Set up WebSocket server
const wss = new WebSocket.Server({ port: 8081 });
console.log("WebSocket server running at ws://localhost:8081");

// UDP port handlers
udpPort.on("ready", () => {
    udpPort.socket.setMulticastTTL(128);
    udpPort.socket.addMembership(MULTICAST_ADDRESS);
    console.log("Listening for multicast OSC on", MULTICAST_ADDRESS + ":" + UDP_PORT);
});

udpPort.on("message", (oscMsg) => {
    let address = oscMsg.address;
    console.log("address ", address);
    let value = oscMsg.args[0].value;
    if(!inputScalers[address]){
        inputScalers[address] = new DynRescale();
    }
    let scaledVal = inputScalers[address].scale(value, 0,1);
    oscMsg.args[0].scaledValue = scaledVal;
    console.log(scaledVal, inputScalers[address].min, inputScalers[address].max)
//    console.log(oscMsg);
    const msg = JSON.stringify(oscMsg);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    });
});

// Open UDP port
udpPort.open();


