import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { socketService } from '@/lib/socket/socket'

export default function ChatArea({ isPrivate = false, to = null, user}) {
  const [message, setMessage] = useState('')
  const [messages,setMessages] = useState([]);
  const handleSend = () => {
    if (message.trim()) {
        if(!isPrivate){
            socketService.sendMessage(message);
        }
      setMessage('')
    }
  }
  const handleKeyDown = (e) => { if (e.key === 'Enter') { handleSend(); } };

  useEffect(()=>{
      const handleReceivedMessage = (event)=> {
        const data = event.detail;
        setMessages((prevMessages) => [...prevMessages,data])
      }
    if(!isPrivate){
          socketService.addEventListener('Public_Message',handleReceivedMessage);
          socketService.addEventListener('Public_Message_Event',handleReceivedMessage);
    } else {
    }

    return ()=> {
        if(!isPrivate){
           socketService.removeEventListener('Public_Message',handleReceivedMessage)
           socketService.removeEventListener('Public_Message_Event',handleReceivedMessage)
        } else {

        }
      }
  },[])
  return (
    <>
      <ScrollArea className="flex-grow p-4 h-[calc(100vh-200px)]">
        {messages.map((data, index) => {
       return data.type === 'chat' ? (
          <div key={index} className={` text-sm mb-2 p-2 rounded ${data.user.nick === user.nick ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <span className="font-bold text-sm">{data.user.nick}: </span>
            {data.message}
          </div>
        ) :  (
            <div key={index} className="mb-2 p-2 rounded bg-blue-100 text-base text-center flex items-center justify-center">
            <span className="font-bold text-base">{data.message}</span>
        </div>
        )

    }
        )}
      </ScrollArea>
      <div className="p-4 bg-white border-t">
        <div className="flex">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            className="flex-grow mr-2"
          />
          <Button onClick={handleSend}>Enviar</Button>
        </div>
      </div>
    </>
  )
}