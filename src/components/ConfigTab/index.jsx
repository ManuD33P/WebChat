import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { socketService } from '@/lib/socket/socket'
export default function ConfigTab({ user, onUpdateUser }) {
  const [tempUser, setTempUser] = useState(user)
  const [avatarFile, setAvatarFile] = useState(null)

  const handleChange = (e) => {
    if (e.target.name === 'avatar') {
      setAvatarFile(e.target.files[0])
      setTempUser({ ...tempUser, avatar: URL.createObjectURL(e.target.files[0]) })
    } else {
      setTempUser({ ...tempUser, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdateUser(tempUser)
    socketService.updateUser(tempUser)
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="avatar">Avatar</Label>
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={tempUser.avatar} alt={tempUser.nick} />
            <AvatarFallback>{tempUser.nick.charAt(0)}</AvatarFallback>
          </Avatar>
          <Input id="avatar" name="avatar" type="file" onChange={handleChange} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="nick">Nick</Label>
        <Input id="nick" name="nick" value={tempUser.nick} onChange={handleChange} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="personalMessage">Mensaje personal</Label>
        <Input id="personalMessage" name="personalMessage" value={tempUser.personalMessage} onChange={handleChange} />
      </div>
      
      <div className="space-y-2">
        <Label>Estado</Label>
        <RadioGroup name="status" value={tempUser.status} onValueChange={(value) => setTempUser({ ...tempUser, status: value })}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="available" id="available" />
            <Label htmlFor="available">Disponible</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="busy" id="busy" />
            <Label htmlFor="busy">Ocupado</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="away" id="away" />
            <Label htmlFor="away">Ausente</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Button type="submit">Guardar cambios</Button>
    </form>
  )
}