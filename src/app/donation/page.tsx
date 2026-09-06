import { MDXContent } from '~/components/mdx-content'
import { Title } from '~/components/title'
import { donation } from '#content'

export default function DonationPage() {
  return (
    <div className="content-container m-auto space-y-12 overflow-hidden">
      <Title text="Donation" />
      <div className="about-rendered-mdx my-5 flex flex-col gap-3 text-xl md:text-left">
        <MDXContent code={donation.content} />
      </div>
    </div>
  )
}
