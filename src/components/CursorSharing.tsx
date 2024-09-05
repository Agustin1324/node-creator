import React, { useEffect, useState } from 'react'

const CursorSharing: React.FC = () => {
  const [peers, setPeers] = useState([])

  useEffect(() => {
    // Initialize WebRTC connection here
    // Update peers state when connections are established or lost
  }, [])

  return (
    <div>
      {peers.map((peer) => (
        <div
          key={peer.id}
          style={{
            position: 'absolute',
            left: peer.x,
            top: peer.y,
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: 'red',
          }}
        />
      ))}
    </div>
  )
}

export default CursorSharing