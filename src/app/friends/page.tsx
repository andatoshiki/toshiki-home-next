import { Title } from '~/components/title'
import { FriendGrid } from './_components/grid'

const friends = [
  {
    title: "Toshki's Notebook",
    description:
      'Eternal & digital knowledge base for content creation and notes management.',
    imgSrc: 'https://note.toshiki.dev/logos/logo.svg',
    imgAlt: "Toshki's Notebook logo",
    siteUrl: 'https://note.toshiki.dev'
  },
  {
    title: 'listder',
    description: '一只很变态的萝莉控，喜欢打音游',
    imgSrc: 'https://blog.listder.xyz/pic/listder.jpg',
    imgAlt: "listder's profile picture",
    siteUrl: 'https://blog.listder.xyz/'
  },
  {
    title: "KUN's moe blog!",
    description: "KUN's moe blog, KUN IS THE CUTEST!",
    imgSrc: 'https://soft.moe/avatar.webp',
    imgAlt: "KUN's moe blog logo",
    siteUrl: 'https://soft.moe'
  },
  {
    title: "Funeral Rain's Blog",
    description: 'The blog for Toya, kawaii but "arrogant" little girl !',
    imgSrc:
      'https://r2.toshiki.dev/image/toshiki-home-nuxt/fe7b01d1a1c07ed4f6010344d5ff6030.png',
    imgAlt: "Funeral Rain's Blog logo",
    siteUrl: 'https://toya.moe'
  },
  {
    title: 'Summit’s Blog',
    description: 'So who’s Summit?',
    imgSrc:
      'https://static.gridea.dev/cb5d8721-b666-40c6-ac0e-8c57868016d6/TQRtVrfVz.jpeg',
    imgAlt: 'Summit’s Blog logo',
    siteUrl: 'https://csmoe.top/'
  },
  {
    title: "Xiaohuo's Blog",
    description: '这里是小火，请多关照',
    imgSrc: 'https://www.xiaohuo.icu/wp-content/uploads/2024/04/773679.jpg',
    imgAlt: "Xiaohuo's Blog logo",
    siteUrl: 'https://www.xiaohuo.icu/'
  }
  // add more friend links upon request at issues via pr
]

export default function FriendsPage() {
  return (
    <div className="content-vertical-spaces content-container m-auto space-y-8">
      <Title
        text="Friends"
        description="A list of friends and their awesome sites. Status is checked live."
      />
      <FriendGrid friends={friends} />
    </div>
  )
}
