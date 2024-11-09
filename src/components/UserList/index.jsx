import React, { useEffect , useState} from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from '../ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { socketService } from '@/lib/socket/socket'
import { Users, X } from "lucide-react"

export default function UserList({ currentUser, onStartPrivateChat, onClose }) {
    

  const [users,setUsers] = useState([]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-500'
      case 'busy': return 'bg-red-500'
      case 'away': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  useEffect(()=>{
   
    const handleGetListUser = (event) => {
        const data = event.detail
        setUsers(data)
    }

    const handleUserJoin = (event) => {
        const user = event.detail;
        setUsers((prevUsers) => [...prevUsers, user]);
    };

    const handleUserOnPart = (event) => {
        const user = event.detail;
        setUsers((prevUsers) => prevUsers.filter(preUser => preUser.nick !== user.nick));
    }

    if(!users?.length){
        socketService.getListUser();
    }


    socketService.addEventListener('onJoin', handleUserJoin);
    socketService.addEventListener('onPart', handleUserOnPart);
    socketService.addEventListener('onListUser', handleGetListUser);
    return () => {
        socketService.removeEventListener('onJoin', handleUserJoin);
        socketService.removeEventListener('onPart', handleUserOnPart);
        socketService.removeEventListener('onListUser', handleGetListUser);

    };

  },[users?.length])

  return (
    <div className="w-64 md:w-1/4 border-r flex-shrink-0 bg-white">
      <Card className="h-full">
        <CardContent className="p-2 h-full">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm md:text-base">Usuarios</h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="md:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100%-2rem)]">
            {users.map((user, index) => (
              <DropdownMenu key={index}>
                <DropdownMenuTrigger asChild>
                  <div className="mb-2 p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={user.avatar} alt={user.nick} />
                      <AvatarFallback>{user.nick.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="text-sm font-medium">{user.nick}</div>
                      <div className="text-xs text-gray-500 truncate">{user.personalMessage}</div>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${getStatusColor(user.status)}`} />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => onStartPrivateChat(user.nick)}>
                    Enviar mensaje privado
                  </DropdownMenuItem>
                  {/* Aquí puedes añadir más opciones */}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}