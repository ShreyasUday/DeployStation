const net = require('net');
const originalListen = net.Server.prototype.listen;

// This monkey-patch works for both CJS and ESM because 'net' is a built-in module
net.Server.prototype.listen = function (...args) {
    // If the developer typed 'localhost' or '127.0.0.1', we swap it for '0.0.0.0'
    // This handles both app.listen(3000, 'localhost') and app.listen(3000, '127.0.0.1')
    if (typeof args[1] === 'string' && (args[1] === 'localhost' || args[1] === '127.0.0.1' || args[1] === '::1')) {
        console.log(`[DeployStation] Auto-patching ${args[1]} -> 0.0.0.0`);
        args[1] = '0.0.0.0';
    }
    return originalListen.apply(this, args);
};
