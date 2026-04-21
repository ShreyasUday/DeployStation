const net = require('net');
const originalListen = net.Server.prototype.listen;

// We "hijack" the listen function
net.Server.prototype.listen = function (...args) {
    // If the developer typed 'localhost' or '127.0.0.1', we swap it for '0.0.0.0'
    if (typeof args[1] === 'string' && (args[1] === 'localhost' || args[1] === '127.0.0.1' || args[1] === '::1')) {
        console.log(`[DeployStation] Hijacking ${args[1]} and forcing 0.0.0.0 binding...`);
        args[1] = '0.0.0.0';
    }
    return originalListen.apply(this, args);
};