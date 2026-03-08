import rehypeShiki from '@shikijs/rehype'

export const rehypeShikiPlugin = [
  rehypeShiki,
  {
    themes: {
      light: 'one-dark-pro',
      dark: 'one-dark-pro'
    },
    langs: [
      'typescript',
      'javascript',
      'python',
      'bash',
      'json',
      'markdown',
      'css',
      'html',
      'jsx',
      'tsx',
      'yaml',
      'toml',
      'sql',
      'rust',
      'go',
      'java',
      'php',
      'c',
      'cpp'
    ]
  }
]

export default rehypeShikiPlugin
