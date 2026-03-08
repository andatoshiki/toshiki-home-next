const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const posts = require('./assets/posts.json') // <-- Your posts data as JSON

const Inter = fs.readFileSync('./assets/Inter-Regular.ttf')
const InterBold = fs.readFileSync('./assets/Inter-Bold.ttf')

const outputDir = path.join(
  process.cwd(),
  '..',
  'public',
  'assets',
  'og',
  'blog'
)
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const uiByTheme = {
  light: {
    bg: '#fff',
    text: '#000',
    serverImage:
      'https://raw.githubusercontent.com/mateusfg7/mateusf.com/cfc774a3020ea9815694f129951ef3f286701b13/public/assets/server-status-bro-light.svg'
  },
  dark: {
    bg: '#000',
    text: 'rgb(250,250,250)',
    serverImage:
      'https://raw.githubusercontent.com/mateusfg7/mateusf.com/cfc774a3020ea9815694f129951ef3f286701b13/public/assets/server-status-bro-dark.svg'
  }
}

// --- Date formatting helper ---
function formatDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Twemoji SVG CDN links
const twemoji = {
  clock:
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f552.svg',
  calendar:
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4c5.svg',
  book: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4d6.svg'
}

function getTheme() {
  const hour = new Date().getHours()
  return hour > 6 && hour < 18 ? 'light' : 'dark'
}

async function generateImage(post) {
  // FIX: Use dynamic import for satori (ESM-only)
  const { default: satori } = await import('satori')

  const theme = getTheme()
  const codeStyle = {
    background: theme === 'light' ? '#f3f3f3' : '#222',
    color: theme === 'light' ? '#222' : '#f3f3f3',
    borderRadius: '8px',
    padding: '0.25em 0.75em',
    fontFamily: 'monospace',
    fontSize: '22px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5em'
  }

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          fontSize: '32px',
          backgroundColor: uiByTheme[theme].bg,
          color: uiByTheme[theme].text,
          position: 'relative',
          backgroundImage:
            'radial-gradient(circle at 1.5px 1.5px, white 3px, transparent 0)',
          // backgroundImage:
          //   'url(https://raw.toshiki.dev/andatoshiki/toshiki-home-nuxt3/master/src/static/assets/meta/images/post-background.png)',
          backgroundSize: '40px 40px'
        },
        // backgroundImage: `repeating-radial-gradient(
        //   circle at 0 0,
        //   ${theme === 'light' ? '#f3f3f3' : '#222'} 1.5px,
        //   transparent 0.5rem
        // )`
        children: [
          {
            type: 'div',
            props: {
              style: {
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '4rem',
                position: 'relative',
                zIndex: 1
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      fontSize: '64px',
                      fontWeight: 700
                    },
                    children: [
                      post.title
                      // {
                      //   type: 'span',
                      //   props: {
                      //     style: {
                      //       fontSize: '28px',
                      //       fontWeight: 400,
                      //       color: '#888',
                      //       marginLeft: '1rem',
                      //       letterSpacing: '0.02em',
                      //       position: 'relative',
                      //       top: '0.9em'
                      //     },
                      //     children: 'by Toshiki'
                      //   }
                      // }
                    ]
                  }
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      fontSize: '32px',
                      marginTop: '1rem'
                    },
                    children: post.description
                  }
                },
                {
                  type: 'div',
                  props: {
                    // style: {
                    //   display: 'flex',
                    //   justifyContent: 'space-between',
                    //   marginTop: '2rem',
                    //   fontSize: '24px'
                    // },
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center', // <-- Add this line!
                      marginTop: '2rem',
                      fontSize: '24px'
                      // ...other styles
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', gap: '2rem' },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: codeStyle,
                                children: [
                                  {
                                    type: 'img',
                                    props: {
                                      src: twemoji.calendar,
                                      alt: 'calendar',
                                      width: 24,
                                      height: 24,
                                      style: { verticalAlign: 'middle' }
                                    }
                                  },
                                  formatDate(post.date)
                                ]
                              }
                            },
                            {
                              type: 'span',
                              props: {
                                style: codeStyle,
                                children: [
                                  {
                                    type: 'img',
                                    props: {
                                      src: twemoji.book,
                                      alt: 'book',
                                      width: 24,
                                      height: 24,
                                      style: { verticalAlign: 'middle' }
                                    }
                                  },
                                  post.category
                                ]
                              }
                            },
                            {
                              type: 'span',
                              props: {
                                style: codeStyle,
                                children: [
                                  {
                                    type: 'img',
                                    props: {
                                      src: twemoji.clock,
                                      alt: 'clock',
                                      width: 24,
                                      height: 24,
                                      style: { verticalAlign: 'middle' }
                                    }
                                  },
                                  `${Math.ceil(post.metadata?.readingTime || 1)} min read`
                                ]
                              }
                            }
                          ]
                        }
                      },
                      // {
                      //   type: 'span',
                      //   props: {
                      //     style: { display: 'flex', fontWeight: 'bold' },
                      //     children: 'Anda Toshiki' // Replace with your actual domain
                      //   }
                      // }
                      {
                        type: 'svg',
                        props: {
                          viewBox: '-20 0 160 136',
                          width: 120,
                          height: 120,
                          style: { display: 'block' },
                          children: [
                            {
                              type: 'path',
                              props: {
                                d: 'M25 80.8543C28.6667 71.8543 25.6911 56.3012 10.4911 73.9012C-8.50895 95.9012 13.5 98.8543 23 82.3543C32.5 65.8543 33.5 68.8543 33 69.3543C32.5 69.8543 15 93.3543 18 102.354C20.4 109.554 26.8334 103.188 32.5 93.8543L61.5 50.5808C86.3334 17.4141 126.1 -35.2819 70.5 46.3181L40.5 106.561C31.6637 124.394 15.9929 153.581 38 111.581',
                                stroke: '#ffffff',
                                strokeWidth: 6.5,
                                fill: 'none',
                                strokeLinecap: 'round'
                              }
                            },
                            {
                              type: 'path',
                              props: {
                                d: 'M39 45L136.5 38.5',
                                stroke: '#ffffff',
                                strokeWidth: 6.5,
                                fill: 'none',
                                strokeLinecap: 'round'
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      width: 1000,
      height: 525,
      fonts: [
        { name: 'Inter', data: Inter, weight: 400, style: 'normal' },
        { name: 'Inter', data: InterBold, weight: 700, style: 'normal' }
      ]
    }
  )

  const jpeg = await sharp(Buffer.from(svg)).jpeg().toBuffer()
  fs.writeFileSync(path.join(outputDir, `${post.slug}.jpg`), jpeg)
  console.log(`Generated OG image for ${post.slug}`)
}

async function main() {
  for (const post of posts) {
    await generateImage(post)
  }
}

main()
