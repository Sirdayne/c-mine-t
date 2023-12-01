import theme from './base.tailwind';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,js,vue}', './.nuxt/**/*.{ts,js,vue}'],
  theme: {
    screens: {
      xxs: '400px',
      xs: '480px',
      tablet: '550px',
      sm: '768px',
      md: '992px',
      lg: '1232px',
      xl: '1440px',
    },
    extend: {
      ...theme,
      rotate: {
        270: '270deg',
      },
      height: {
        inherit: 'inherit',
        headerDesktop: '156px',
      },
      backgroundImage: {
        'top-bottom-darken-gradient':
          'linear-gradient(180deg, rgba(0, 0, 0, 0.6) 4.22%, rgba(0, 0, 0, 0) 16.88%), linear-gradient(0deg, rgba(0, 0, 0, 0.6) 11.48%, rgba(0, 0, 0, 0) 45.9%)',
      },
      spacing: {
        ...theme.spacing,
        128: '32rem',
      },
    },
  },
};
