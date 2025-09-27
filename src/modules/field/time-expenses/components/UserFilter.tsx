import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronsUpDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User as UserType } from '../types';

interface UserFilterProps {
  users: UserType[];
  selectedUsers: string[];
  onUsersChange: (userIds: string[]) => void;
  className?: string;
}

export function UserFilter({ 
  users, 
  selectedUsers, 
  onUsersChange, 
  className 
}: UserFilterProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  const toggleUser = (userId: string) => {
    const newSelection = selectedUsers.includes(userId)
      ? selectedUsers.filter(id => id !== userId)
      : [...selectedUsers, userId];
    onUsersChange(newSelection);
  };

  const selectAll = () => {
    onUsersChange(users.map(user => user.id));
  };

  const clearAll = () => {
    onUsersChange([]);
  };

  const getSelectedUsersText = () => {
    if (selectedUsers.length === 0) {
      return t('time-expenses:filters.select_users');
    }
    if (selectedUsers.length === users.length) {
      return t('time-expenses:filters.all_users');
    }
    if (selectedUsers.length === 1) {
      const user = users.find(u => u.id === selectedUsers[0]);
      return user?.name || '';
    }
    return `${selectedUsers.length} selected`;
  };

  return (
    <div className={className}>
      <label className="text-sm font-medium text-foreground mb-2 block">
        {t('time-expenses:filters.users')}
      </label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{getSelectedUsersText()}</span>
            </div>
            <div className="flex items-center gap-2">
              {selectedUsers.length > 0 && selectedUsers.length < users.length && (
                <Badge variant="secondary" className="text-xs">
                  {selectedUsers.length}
                </Badge>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder={t('common:search')} 
              className="h-9" 
            />
            <CommandEmpty>
              {t('common:not_found')}
            </CommandEmpty>
            
            <CommandGroup>
              {/* Select All / Clear All */}
              <div className="flex gap-2 p-2 border-b">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAll}
                  className="text-xs h-7 flex-1"
                >
                  {t('common:all')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-xs h-7 flex-1"
                >
                  {t('common:clear')}
                </Button>
              </div>
              
              {/* User List */}
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.name}
                  onSelect={() => toggleUser(user.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.role} • ${user.hourlyRate}/h
                      </p>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedUsers.includes(user.id) 
                        ? "opacity-100" 
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}