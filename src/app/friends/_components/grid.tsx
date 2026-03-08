import React from 'react'
import { FriendCard, FriendCardProps } from '~/components/ui/friend-card'

interface FriendGridProps {
  friends: FriendCardProps[]
  className?: string
}

export function FriendGrid({ friends, className }: FriendGridProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 ${className || ''}`}
    >
      {friends.map(friend => (
        <FriendCard key={friend.title + friend.siteUrl} {...friend} />
      ))}
    </div>
  )
}
