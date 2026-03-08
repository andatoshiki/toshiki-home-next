import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import colors from 'tailwindcss/colors'

const config: Config = {
  content: ['./src/**/*.tsx'],
  darkMode: 'class',

  theme: {
    extend: {
      /* =========================
         TRANSFORMS
      ========================= */
      skew: {
        '20': '20deg'
      },
      scale: {
        flip: '-1'
      },

      /* =========================
         FONTS
      ========================= */
      fontFamily: {
        sans: 'var(--font-inter)',
        serif: 'var(--font-crimson-text)',
        handwrite: 'var(--font-caveat)',
        mono: [
          'Maple Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace'
        ]
      },

      /* =========================
         COLORS
      ========================= */
      colors: {
        neutral: {
          '1000': 'rgb(6 6 6)'
        },

        brand: {
          email: 'hsl(var(--email-color))',
          github: 'hsl(var(--github-color))',
          codepen: 'hsl(var(--codepen-color))',
          linkedin: 'hsl(var(--linkedin-color))',
          'stack-overflow': 'hsl(var(--stack-overflow-color))',
          reddit: 'hsl(var(--reddit-color))',
          twitter: 'hsl(var(--twitter-color))',
          instagram: 'hsl(var(--instagram-color))',
          arch: 'hsl(var(--arch-color))'
        },

        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))'
        }
      },

      /* =========================
         BORDER RADIUS
      ========================= */
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },

      /* =========================
         ANIMATIONS
      ========================= */
      animation: {
        cursor: 'cursor .6s linear infinite alternate',
        typing: 'typing 1.8s ease-in .8s both',

        slideDown: 'slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        slideUp: 'slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)',

        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',

        shine: 'shine 4s linear forwards',

        'custom-fade-down': 'custom-fade-down 200ms linear',
        'slide-left': 'slide-left 70ms linear',
        'slide-right': 'slide-right 70ms linear',

        'marquee-left': 'marquee-left var(--duration, 30s) linear infinite',
        'marquee-up': 'marquee-up var(--duration, 30s) linear infinite',

        'background-fade': 'background-fade 20s linear infinite',

        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        ripple: 'ripple 1.5s ease-out infinite'
      },

      /* =========================
         KEYFRAMES (MERGED)
      ========================= */
      keyframes: {
        ...defaultTheme.keyframes,

        typing: {
          from: { width: '1ch' },
          to: { width: '22.7rem' }
        },

        cursor: {
          '0%, 40%': { opacity: '1' },
          '60%, 100%': { opacity: '0' }
        },

        slideDown: {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },

        slideUp: {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },

        overlayShow: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },

        contentShow: {
          from: {
            opacity: '0',
            transform: 'translate(-50%, -48%) scale(0.96)'
          },
          to: {
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1)'
          }
        },

        shine: {
          '20%, 100%': {
            transform: 'translateX(300%) skewX(-20deg)'
          }
        },

        'custom-fade-down': {
          from: { opacity: '0', transform: 'translateY(-1rem)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },

        'slide-left': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' }
        },

        'slide-right': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(100%)' }
        },

        'marquee-left': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' }
        },

        'marquee-up': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' }
        },

        'background-fade': {
          '0%': { backgroundColor: colors.blue[600] },
          '25%': { backgroundColor: colors.yellow[600] },
          '50%': { backgroundColor: colors.green[600] },
          '75%': { backgroundColor: colors.red[600] },
          '100%': { backgroundColor: colors.blue[600] }
        },

        ping: {
          from: { transform: 'scale(1)' },
          to: { transform: 'scale(3)', opacity: '0' }
        },

        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '70%': { transform: 'scale(2.5)', opacity: '0' },
          '100%': { transform: 'scale(2.5)', opacity: '0' }
        }
      }
    }
  },

  plugins: [
    require('tailwindcss-animated'),
    require('tailwindcss-animate'),
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('tailwind-scrollbar')({
      nocompatible: true,
      preferredStrategy: 'pseudoelements'
    })
  ]
}

export default config
