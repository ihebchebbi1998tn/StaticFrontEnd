import { ArrowLeft, Building2, Star, Edit, Trash2, Mail, Phone, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export function ContactDetailHeader({
  contact,
  onBack,
  getInitials,
  getStatusColor
}: {
  contact: any;
  onBack: () => void;
  getInitials: (name: string) => string;
  getStatusColor: (status: string) => string;
}) {
  return <div className="border-b border-border bg-gradient-subtle backdrop-blur-sm sticky top-0 z-20 shadow-soft">
      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-sm border border-border/50">
              <DropdownMenuItem className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Contact
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Mail className="h-4 w-4" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Phone className="h-4 w-4" />
                Call Contact
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-destructive">
                <Trash2 className="h-4 w-4" />
                Delete Contact
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 shadow-medium border-2 border-background">
              <AvatarFallback className="text-lg bg-gradient-primary text-primary-foreground">
                {contact.type === 'company' ? <Building2 className="h-8 w-8" /> : getInitials(contact.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2 mb-1">
                {contact.name}
                {contact.favorite && <Star className="h-4 w-4 text-warning fill-warning flex-shrink-0" />}
              </h1>
              <p className="text-sm text-muted-foreground mb-2 truncate">
                {contact.position} at {contact.company}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getStatusColor(contact.status)}>{contact.status}</Badge>
                <Badge variant="outline" className="text-xs">{contact.type}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between p-6 lg:p-8">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 hover:bg-background/80">
              <ArrowLeft className="h-4 w-4" />
              Back to Contacts
            </Button>
            <div className="h-8 w-px bg-border/50" />
            <div className="flex items-center gap-6">
              
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
                  {contact.name}
                  {contact.favorite && <Star className="h-6 w-6 text-warning fill-warning" />}
                </h1>
                <p className="text-lg text-muted-foreground mb-3">
                  {contact.position} at {contact.company}
                </p>
                <div className="flex items-center gap-3">
                  <Badge className={`${getStatusColor(contact.status)} px-3 py-1`}>{contact.status}</Badge>
                  <Badge variant="outline" className="px-3 py-1">{contact.type}</Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2 hover:bg-background/80 border-border/50">
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button variant="outline" size="sm" className="gap-2 hover:bg-background/80 border-border/50">
              <Phone className="h-4 w-4" />
              Call
            </Button>
            <Button variant="outline" size="sm" className="gap-2 hover:bg-background/80 border-border/50">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-border/50">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>;
}