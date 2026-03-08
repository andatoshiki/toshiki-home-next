'use client'

import { useEffect } from 'react'
import { ClipboardText, Check } from '@phosphor-icons/react/dist/ssr'
import { renderToString } from 'react-dom/server'

export function VitePressStyledCopyCode() {
  useEffect(() => {
    // Helper function to render Phosphor icons to HTML strings
    const getIconHTML = (IconComponent: any, size = 20) => {
      return renderToString(<IconComponent size={size} />)
    }
    // Add CSS styles to head
    const styleId = 'vitepress-copy-code-styles'
    if (document.getElementById(styleId)) return

    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      .code-block-wrapper {
        position: relative !important;
      }

      .vp-copy {
        position: absolute !important;
        top: 8px !important;
        right: 8px !important;
        z-index: 10 !important;
        width: 42px !important;
        height: 42px !important;
        border: 1px solid #d1d9e0 !important;
        border-radius: 8px !important;
        background: #f6f8fa !important;
        cursor: pointer !important;
        opacity: 0 !important;
        transition: all 0.25s ease !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 !important;
      }

      .dark .vp-copy {
        background: #161b22 !important;
        border: 1px solid #30363d !important;
      }

      .vp-copy:hover {
        background: #ffffff !important;
        border-color: #c9d1d9 !important;
      }

      .dark .vp-copy:hover {
        background: #21262d !important;
        border-color: #444c56 !important;
      }

      .code-block-wrapper:hover .vp-copy {
        opacity: 1 !important;
      }

      .vp-copy svg {
        width: 20px !important;
        height: 20px !important;
        fill: #656d76 !important;
      }

      .dark .vp-copy svg {
        fill: #8b949e !important;
      }

      .vp-copy:hover svg {
        fill: #24292f !important;
      }

      .dark .vp-copy:hover svg {
        fill: #f0f6fc !important;
      }

      .vp-copy.copied svg {
        fill: #1a7f37 !important;
      }

      .dark .vp-copy.copied svg {
        fill: #3fb950 !important;
      }

      /* Inline code container to prevent cutoff on line breaks */
      code:not(pre code) {
        display: inline !important;
        line-height: 1.4 !important;
        padding: 2px 4px !important;
        vertical-align: baseline !important;
        word-break: break-word !important;
        box-decoration-break: clone !important;
        -webkit-box-decoration-break: clone !important;
      }

      @media (max-width: 768px) {
        .vp-copy {
          opacity: 1 !important;
        }
      }

      @media (max-width: 767px) {
        .vp-copy {
          top: 8px !important;
          right: 8px !important; /* Default positioning for nested blocks */
        }

        /* Only apply negative margin for full-width blocks (direct children) */
        .content-container .post-content > .code-block-wrapper .vp-copy,
        .content-container .post-content > div > .code-block-wrapper .vp-copy,
        .content-container .post-content > p + .code-block-wrapper .vp-copy,
        .content-container .post-content > h1 + .code-block-wrapper .vp-copy,
        .content-container .post-content > h2 + .code-block-wrapper .vp-copy,
        .content-container .post-content > h3 + .code-block-wrapper .vp-copy,
        .content-container .post-content > h4 + .code-block-wrapper .vp-copy,
        .content-container .post-content > h5 + .code-block-wrapper .vp-copy,
        .content-container .post-content > h6 + .code-block-wrapper .vp-copy {
          right: -0.5rem !important; /* Match the container padding for full-width blocks */
        }
      }
    `
    document.head.appendChild(style)

    const addCopyButtons = () => {
      const preElements = document.querySelectorAll(
        'pre:not([data-copy-added])'
      )

      preElements.forEach(pre => {
        // Wrap pre in a container if not already wrapped
        if (!pre.parentElement?.classList.contains('code-block-wrapper')) {
          const wrapper = document.createElement('div')
          wrapper.className = 'code-block-wrapper'
          pre.parentNode?.insertBefore(wrapper, pre)
          wrapper.appendChild(pre)
        }

        // Create copy button
        const button = document.createElement('button')
        button.className = 'vp-copy'
        button.title = 'Copy Code'

        // Create Phosphor ClipboardText icon
        const copyIcon = document.createElement('div')
        copyIcon.innerHTML = getIconHTML(ClipboardText)
        button.appendChild(copyIcon.firstElementChild!)

        button.onclick = async () => {
          const code = pre.querySelector('code')
          if (code) {
            const text = code.textContent || ''
            try {
              await navigator.clipboard.writeText(text)

              // Show success state with Phosphor Check icon
              button.innerHTML = getIconHTML(Check)
              button.classList.add('copied')

              setTimeout(() => {
                // Reset to ClipboardText icon
                button.innerHTML = getIconHTML(ClipboardText)
                button.classList.remove('copied')
              }, 2000)
            } catch (err) {
              console.error('Failed to copy:', err)
            }
          }
        }

        const wrapper = pre.closest('.code-block-wrapper')
        if (wrapper) {
          wrapper.appendChild(button)
        }

        pre.setAttribute('data-copy-added', 'true')
      })
    }

    // Initial add
    setTimeout(addCopyButtons, 100)

    // Watch for new content
    const observer = new MutationObserver(() => {
      setTimeout(addCopyButtons, 100)
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}
