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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
export default function ChatApp() {
  const [showModal, setShowModal] = useState(true)
  const [showUserList, setShowUserList] = useState(false)
  const [activeMobileChat, setActiveMobileChat] = useState(null)

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

  const saveToLocalStorage = (key, value) => { if (typeof window !== 'undefined') { localStorage.setItem(key, value); }}
  const handleJoin = (nick) => {
    setUser(prev => ({ ...prev, nick }))
    socketService.joinRoom({...user,nick:nick})
    saveToLocalStorage(user,{...user,nick:nick});
    setShowModal(false)
  }

  const handleStartPrivateChat = (otherUser) => {
    const existingChat = privateChats.find(chat => chat.user === otherUser)
    if (!existingChat) {
      setPrivateChats(prev => [...prev, { user: otherUser, messages: [], avatar: `/avatar-${otherUser}.png` }])
    }
    if (windowWidth >= 768) {
      setActiveTab(otherUser)
    } else {
      setActiveMobileChat(otherUser)
    }
    setShowUserList(false)
  }
  const handleClosePrivateChat = (userToClose) => {
    setPrivateChats(prev => prev.filter(chat => chat.user !== userToClose))
    if (activeMobileChat === userToClose) {
      setActiveMobileChat(null)
    }
    if (activeTab === userToClose) {
      setActiveTab('main')
    }
  }
  
  const getFromLocalStorage = (key) => { if (typeof window !== 'undefined') { return localStorage.getItem(key); } };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser)
    saveToLocalStorage(updatedUser)
    // Aquí iría la lógica para actualizar el usuario en el servidor
  }

  useEffect(()=>{
    const SERVER_URL_CHAT = process.env.SERVER_URL_CHAT;
    
    socketService?.connect(SERVER_URL_CHAT || 'https://serverwebchat.onrender.com');

    const onReconnected = ()=>{
        if(!socketService.isConnected()){
          const user = getFromLocalStorage(user)
          console.log('valor de user ',user);
          socketService?.connect(SERVER_URL_CHAT || 'https://serverwebchat.onrender.com', user || null);
        }
        
    }


    const onRejected = (event) => {
        console.log(event)
        const msg = event.detail;
        alert(msg)
        setShowModal(true);
    };
    
    
    // Aquí iría la lógica para unirse al chat
    socketService.addEventListener('onRejected',onRejected);
    socketService.addEventListener('disconnect',onReconnected);

    return () => {
        socketService.removeEventListener('onRejected', onRejected);
    }
  },[])

  
  const renderMobilePrivateChats = () => (
    <div className="fixed left-[10%]  transform translate-x-1/2 bottom-4 flex flex-row-reverse items-end space-x-2 space-x-reverse md:hidden">
      {privateChats.map((chat) => (
        <div
          key={chat.user}
          className="group relative"
        >
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12 p-0 relative transition-transform group-hover:-translate-y-1"
            onClick={() => setActiveMobileChat(chat.user)}
            aria-label={`Chat privado con ${chat.user}`}
          >
            <Avatar className="h-full w-full">
              <AvatarImage src={chat.avatar} alt={chat.user} />
              <AvatarFallback>{chat.user[0]}</AvatarFallback>
            </Avatar>
            {chat.unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {chat.unreadCount}
              </span>
            )}
          </Button>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {chat.user}
          </div>
        </div>
      ))}
    </div>
  )

  const renderMobileActiveChatModal = () => {
    if (!activeMobileChat) return null
    const chat = privateChats.find(c => c.user === activeMobileChat)
    if (!chat) return null

    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col md:hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={chat.avatar} alt={chat.user} />
              <AvatarFallback>{chat.user[0]}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{chat.user}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setActiveMobileChat(null)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex-grow overflow-hidden">
          <ChatArea messages={chat.messages} onSendMessage={() => {}} isPrivate={true} to={chat.user} />
        </div>
      </div>
    )
  }
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
                {windowWidth >= 768 && privateChats.map((chat, index) => (
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
              className="fixed left-4 bottom-4 rounded-full md:hidden"
              onClick={() => setShowUserList(!showUserList)}
            >
             <Users className="h-6 w-6" />
            </Button>
            {renderMobilePrivateChats()}
          </div>
        </CardContent>
      </Card>
      {renderMobileActiveChatModal()}
    </div>
  )
}