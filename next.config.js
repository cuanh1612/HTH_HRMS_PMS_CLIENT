
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

module.exports =withPWA({
    reactStrictMote: true,
        pwa: {
            dest: "public",
            register: true,
            skipWaiting: true,

        },
        ...withTM(),
        async rewrites() {
            return [
              {
                source: '/api/:path*',
                destination: 'https://huprom-hrms-pms-server.vercel.app/:path*',
              },
            ]
          },
    })
