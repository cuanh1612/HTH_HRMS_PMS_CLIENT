
const withTM = require("next-transpile-modules")([
    "@fullcalendar/common",
    "@babel/preset-react",
    "@fullcalendar/common",
    "@fullcalendar/daygrid",
    "@fullcalendar/interaction",
    "@fullcalendar/react",
    "@fullcalendar/timegrid",
    "@fullcalendar/list",
]);

const withPWA = require('next-pwa')

module.exports = withTM({
    // your custom config goes here
    PluginArray: [withPWA({
        pwa: {
            dest: "public",
            register: true,
            skipWaiting: true
        }
    })]
});