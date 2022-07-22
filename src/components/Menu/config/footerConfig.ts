import { FooterLinkType } from '@goosebumps/uikit'
import { ContextApi } from 'contexts/Localization/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
  {
    label: t('About'),
    items: [
      {
        label: t('Contact'),
        href: 'https://docs.goosebumps.finance/contact-us',
      },
      {
        label: t('Brand'),
        href: 'https://docs.goosebumps.finance/brand',
      },
      {
        label: t('Blog'),
        href: 'https://medium.com/goosebumps',
      },
      {
        label: t('Community'),
        href: 'https://docs.goosebumps.finance/contact-us/telegram',
      },
      {
        label: t('CAKE token'),
        href: 'https://docs.goosebumps.finance/tokenomics/cake',
      },
      {
        label: '—',
      },
      {
        label: t('Online Store'),
        href: 'https://goosebumps.creator-spring.com/',
        isHighlighted: true,
      },
    ],
  },
  {
    label: t('Help'),
    items: [
      {
        label: t('Customer Support'),
        href: 'https://docs.goosebumps.finance/contact-us/customer-support',
      },
      {
        label: t('Troubleshooting'),
        href: 'https://docs.goosebumps.finance/help/troubleshooting',
      },
      {
        label: t('Guides'),
        href: 'https://docs.goosebumps.finance/get-started',
      },
    ],
  },
  {
    label: t('Developers'),
    items: [
      {
        label: 'Github',
        href: 'https://github.com/goosebumps',
      },
      {
        label: t('Documentation'),
        href: 'https://docs.goosebumps.finance',
      },
      {
        label: t('Bug Bounty'),
        href: 'https://docs.goosebumps.finance/code/bug-bounty',
      },
      {
        label: t('Audits'),
        href: 'https://docs.goosebumps.finance/help/faq#is-goosebumps-safe-has-goosebumps-been-audited',
      },
      {
        label: t('Careers'),
        href: 'https://docs.goosebumps.finance/hiring/become-a-chef',
      },
    ],
  },
]
