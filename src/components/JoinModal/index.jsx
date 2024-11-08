import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"


export default function JoinModal({ onJoin }) {
  const [nick, setNick] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (nick.trim()) {
      onJoin(nick.trim())
    }
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">Ingresa tu nick</h2>
            <Input
              type="text"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              placeholder="Tu nick"
              className="mb-4"
            />
            <Button type="submit" className="w-full">Unirse al chat</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}