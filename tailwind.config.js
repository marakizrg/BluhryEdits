/* Tailwind CDN theme configuration.
   Loaded right after the Tailwind CDN script so utilities pick up these tokens. */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        // Cinema-screen dark palette
        ink:    '#0A0B0D', // deep off-black page background
        slate900: '#101216',
        slate800: '#16191F',
        slate700: '#1F232B',
        // Electric "racing" accent
        acid:   '#ADFF2F', // neon lime
        acidDim:'#8FD41C',
      },
      fontFamily: {
        display: ['Montserrat', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(173,255,47,0.45)' },
          '50%':     { boxShadow: '0 0 0 12px rgba(173,255,47,0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-glow': 'pulse-glow 2.4s ease-out infinite',
      },
    },
  },
};
