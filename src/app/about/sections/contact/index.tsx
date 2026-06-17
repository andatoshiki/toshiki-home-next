'use client'

import { ArrowUpRight, At } from '@phosphor-icons/react'
import {
  ArchLinuxLogo,
  CodepenLogo,
  Envelope,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  RedditLogo,
  StackOverflowLogo,
  TwitterLogo
} from './icons'
import { MenuTooltip } from '~/components/ui/tooltip'

type Contact = {
  id: string
  user: string | (() => JSX.Element)
  title: () => JSX.Element
  link: () => JSX.Element
}

function EmailUserDisplay() {
  return (
    <span className="inline-flex items-center gap-0.5 text-neutral-500">
      <span>hello</span>
      <MenuTooltip
        label="The @ symbol is shown as an icon to reduce automated email harvesting by bots"
        side="top"
      >
        <span
          className="group inline-flex cursor-help align-middle"
          aria-label="at symbol hidden from bots"
        >
          <At
            size="1em"
            weight="bold"
            className="translate-y-px text-neutral-400 transition-colors duration-150 group-hover:text-brand-email dark:text-neutral-300 dark:group-hover:text-brand-email"
          />
        </span>
      </MenuTooltip>
      <span>toshiki.dev</span>
    </span>
  )
}

const contacts: Contact[] = [
  {
    id: 'email',
    user: () => <EmailUserDisplay />,
    title: () => (
      <div className="contact-line contact-line-title text-brand-email">
        <span className="rounded bg-brand-email/10 p-1 text-2xl">
          <Envelope />
        </span>
        <span>Email</span>
      </div>
    ),
    link: () => (
      <div className="contact-line">
        <a
          className="inline-flex items-end gap-px hover:underline"
          href="/blog/post/why-i-replace-the-at-symbol-in-my-email-address"
        >
          <span className="leading-none">Why @?</span>
          <ArrowUpRight size="1em" className="text-sm" />
        </a>
      </div>
    )
  },
  {
    id: 'github',
    user: 'andatoshiki',
    title: () => (
      <div className="contact-line contact-line-title text-brand-github">
        <span className="rounded bg-brand-github/10 p-1">
          <GithubLogo />
        </span>
        <span>Github</span>
      </div>
    ),
    link: () => (
      <div className="contact-line">
        <a
          className="inline-flex items-end gap-px hover:underline"
          href="https://github.com/andatoshiki/?ref=https://toshiki.dev"
          target="_blank"
          rel="external"
        >
          <span className="leading-none">Open profile</span>
          <ArrowUpRight size="1em" className="text-sm" />
        </a>
      </div>
    )
  },
  {
    id: 'linkedin',
    user: 'andatoshiki',
    title: () => (
      <div className="contact-line contact-line-title text-brand-linkedin">
        <span className="rounded bg-brand-linkedin/10 p-1 ">
          <LinkedinLogo />
        </span>
        <span>Linkedin</span>
      </div>
    ),
    link: () => (
      <div className="contact-line">
        <a
          className="inline-flex items-end gap-px hover:underline"
          href="https://www.linkedin.com/in/andatoshiki/?ref=https://toshiki.dev"
          target="_blank"
          rel="external"
        >
          <span className="leading-none">Open profile</span>
          <ArrowUpRight size="1em" className="text-sm" />
        </a>
      </div>
    )
  },
  {
    id: 'stackoverflow',
    user: 'andatoshiki',
    title: () => (
      <div className="contact-line contact-line-title text-brand-stack-overflow">
        <span className="rounded bg-brand-stack-overflow/10 p-1">
          <StackOverflowLogo />
        </span>
        <span>Stack Overflow</span>
      </div>
    ),
    link: () => (
      <div className="contact-line">
        <a
          className="inline-flex items-end gap-px hover:underline"
          href="https://stackoverflow.com/users/andatoshiki/?ref=https://toshiki.dev"
          target="_blank"
          rel="external"
        >
          <span className="leading-none">Open summary</span>
          <ArrowUpRight size="1em" className="text-sm" />
        </a>
      </div>
    )
  },
  {
    id: 'codepen',
    user: 'andatoshiki',
    title: () => (
      <div className="contact-line contact-line-title text-brand-codepen">
        <span className="rounded bg-brand-codepen/10 p-1">
          <CodepenLogo />
        </span>
        <span>Codepen</span>
      </div>
    ),
    link: () => (
      <div className="contact-line">
        <a
          className="inline-flex items-end gap-px hover:underline"
          href="https://codepen.io/andatoshiki/?ref=https://toshiki.dev"
          target="_blank"
          rel="external"
        >
          <span className="leading-none">View pens</span>
          <ArrowUpRight size="1em" className="text-sm" />
        </a>
      </div>
    )
  },
  {
    id: 'reddit',
    user: 'u/andatoshiki',
    title: () => (
      <div className="contact-line contact-line-title text-brand-reddit">
        <span className="rounded bg-brand-reddit/10 p-1">
          <RedditLogo />
        </span>
        <span>Reddit</span>
      </div>
    ),
    link: () => (
      <div className="contact-line">
        <a
          className="inline-flex items-end gap-px hover:underline"
          href="https://www.reddit.com/user/andatoshiki/?ref=https://toshiki.dev"
          target="_blank"
          rel="external"
        >
          <span className="leading-none">See comments</span>
          <ArrowUpRight size="1em" className="text-sm" />
        </a>
      </div>
    )
  },
  {
    id: 'twitter',
    user: '@andatoshiki',
    title: () => (
      <div className="contact-line contact-line-title text-brand-twitter">
        <span className="rounded bg-brand-twitter/10 p-1">
          <TwitterLogo />
        </span>
        <span>Twitter</span>
      </div>
    ),
    link: () => (
      <div className="contact-line">
        <a
          className="inline-flex items-end gap-px hover:underline"
          href="https://twitter.com/andatoshiki/?ref=https://toshiki.dev"
          target="_blank"
          rel="external"
        >
          <span className="leading-none">See tweets</span>
          <ArrowUpRight size="1em" className="text-sm" />
        </a>
      </div>
    )
  },
  {
    id: 'instagram',
    user: '@andatoshiki',
    title: () => (
      <div className="contact-line contact-line-title text-brand-instagram">
        <span className="rounded bg-brand-instagram/10 p-1">
          <InstagramLogo />
        </span>
        <span>Instagram</span>
      </div>
    ),
    link: () => (
      <div className="contact-line">
        <a
          className="inline-flex items-end gap-px hover:underline"
          href="https://www.instagram.com/andatoshiki/?ref=https://toshiki.dev"
          target="_blank"
          rel="external"
        >
          <span className="leading-none">Open profile</span>
          <ArrowUpRight size="1em" className="text-sm" />
        </a>
      </div>
    )
  },
  {
    id: 'arch',
    user: 'andatoshiki',
    title: () => (
      <div className="contact-line contact-line-title text-brand-arch">
        <span className="rounded bg-brand-arch/10 p-1">
          <ArchLinuxLogo />
        </span>
        <span>Arch (AUR)</span>
      </div>
    ),
    link: () => (
      <div className="contact-line">
        <a
          className="inline-flex items-end gap-px hover:underline"
          href="https://aur.archlinux.org/account/andatoshiki/?ref=https://toshiki.dev"
          target="_blank"
          rel="external"
        >
          <span className="leading-none">Open profile</span>
          <ArrowUpRight size="1em" className="text-sm" />
        </a>
      </div>
    )
  }
]

function renderUser(user: Contact['user']) {
  return typeof user === 'function' ? user() : user
}

export function Contact() {
  return (
    <div className="flex justify-between text-lg md:text-2xl">
      <div className="flex-1">{contacts.map(contact => contact.title())}</div>
      <div className="hidden flex-1 text-neutral-500 lg:block">
        {contacts.map(contact => (
          <div key={contact.id} className="contact-line">
            {renderUser(contact.user)}
          </div>
        ))}
      </div>
      <div>{contacts.map(contact => contact.link())}</div>
    </div>
  )
}
