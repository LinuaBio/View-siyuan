const { Terminal } = require("node-pty");

const term = new Terminal();

// term.onData((data) => console.log(data));
term.write("ls -la\r");