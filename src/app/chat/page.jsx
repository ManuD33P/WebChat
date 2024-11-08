'use client'
import React, { useState, useEffect} from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import UserList from '@/components/UserList'
import ChatArea from '@/components/ChatArea'
import ConfigTab from '@/components/ConfigTab'
import JoinModal from '@/components/JoinModal'
import { socketService } from '@/lib/socket/socket'
import useWindowWidth from '@/hooks/useWindowWidth'
import { Users, X } from "lucide-react"
import { Label } from '@/components/ui/label'
export default function ChatApp() {
  const [showModal, setShowModal] = useState(true)
  const [showUserList, setShowUserList] = useState(false)
  const [user, setUser] = useState({
    nick: '',
    avatar: '/default-avatar.png',
    personalMessage: '',
    status: 'available'
  })
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('main')
  const [privateChats, setPrivateChats] = useState([])
  const windowWidth = useWindowWidth();

  const handleJoin = (nick) => {
    setUser(prev => ({ ...prev, nick }))
    socketService.joinRoom({...user,nick:nick})
    setShowModal(false)
  }

  const handleStartPrivateChat = (otherUser) => {
    const existingChat = privateChats.find(chat => chat.user === otherUser)
    if (!existingChat) {
      setPrivateChats(prev => [...prev, { user: otherUser, messages: [] }])
    }
    setActiveTab(otherUser)
  }

  const handleClosePrivateChat = (userToClose) => {
    setPrivateChats(prev => prev.filter(chat => chat.user !== userToClose))
    setActiveTab('main')
  }

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser)
    // Aquí iría la lógica para actualizar el usuario en el servidor
  }

  useEffect(()=>{
    socketService?.connect('http://localhost:3000');
    const onRejected = (event) => {
        console.log(event)
        const msg = event.detail;
        alert(msg)
        setShowModal(true);
    };
    // Aquí iría la lógica para unirse al chat
    socketService.addEventListener('onRejected',onRejected)
    return () => {
        socketService.removeEventListener('onRejected', onRejected);
    }
  },[])


return (
    <div className="h-screen bg-gray-100 flex flex-col p-4">
      {showModal && <JoinModal onJoin={handleJoin} />}

      <Card className="flex-grow overflow-hidden">
        <CardContent className="p-0 h-full flex">
          {(showUserList || windowWidth >= 768) && (
            <UserList 
              users={users} 
              currentUser={user} 
              onStartPrivateChat={handleStartPrivateChat} 
              onClose={() => setShowUserList(false)}
            />
          )}
          <div className="flex-grow flex flex-col relative">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="main">Chat Principal</TabsTrigger>
                {privateChats.map((chat, index) => (
                  <TabsTrigger key={index} value={chat.user} className="flex items-center">
                    {chat.user}
                    <Label
                      variant="ghost"
                      size="sm"
                      className="ml-2 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClosePrivateChat(chat.user)
                      }}
                    >
                    <X className="h-4 w-4" />
                    </Label>
                  </TabsTrigger>
                ))}
                <TabsTrigger value="config">Configuración</TabsTrigger>
              </TabsList>
              <TabsContent value="main" className="flex-grow flex flex-col">
                <ChatArea messages={[]} onSendMessage={() => {}} user={user} />
              </TabsContent>
              {privateChats.map((chat, index) => (
                <TabsContent key={index} value={chat.user} className="flex-grow flex flex-col">
                  <ChatArea messages={chat.messages} onSendMessage={() => {}} isPrivate={true} user={chat.user} />
                </TabsContent>
              ))}
              <TabsContent value="config" className="flex-grow">
                <ConfigTab user={user} onUpdateUser={handleUpdateUser} />
              </TabsContent>
            </Tabs>
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-4 right-4 rounded-full md:hidden"
              onClick={() => setShowUserList(!showUserList)}
            >
              <Users className="h-6 w-6" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}