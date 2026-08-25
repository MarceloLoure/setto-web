import { withPigment } from '@pigment-css/nextjs-plugin';
import { settoTheme } from './src/theme/theme';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@fullcalendar/common',
    '@fullcalendar/core',
    '@fullcalendar/daygrid',
    '@fullcalendar/interaction',
    '@fullcalendar/react',
    '@fullcalendar/timegrid',
  ],
};

export default withPigment(nextConfig, {
  theme: settoTheme,
});