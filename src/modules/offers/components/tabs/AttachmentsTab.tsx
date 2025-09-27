import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Image, File, Download, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Offer } from "../../types";
import { toast } from "sonner";

interface AttachmentsTabProps {
  offer: Offer;
}

// Mock attachments data - in real app this would come from API
const mockAttachments = [
  {
    id: "att-1",
    name: "Solar_Panel_Specifications.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadedAt: new Date("2024-01-15T14:30:00"),
    uploadedBy: "John Smith",
    category: "technical"
  },
  {
    id: "att-2",
    name: "Installation_Site_Photo.jpg", 
    type: "image",
    size: "1.8 MB",
    uploadedAt: new Date("2024-01-16T09:20:00"),
    uploadedBy: "Sarah Johnson",
    category: "photos"
  },
  {
    id: "att-3",
    name: "Customer_Requirements.docx",
    type: "document",
    size: "456 KB",
    uploadedAt: new Date("2024-01-16T16:45:00"),
    uploadedBy: "Mike Wilson",
    category: "requirements"
  }
];

export function AttachmentsTab({ offer }: AttachmentsTabProps) {
  const { t } = useTranslation();
  const [attachments, setAttachments] = useState(mockAttachments);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'image':
        return <Image className="h-8 w-8 text-green-500" />;
      case 'document':
        return <File className="h-8 w-8 text-blue-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      technical: 'bg-blue-100 text-blue-800 border-blue-200',
      photos: 'bg-green-100 text-green-800 border-green-200',
      requirements: 'bg-purple-100 text-purple-800 border-purple-200',
      contracts: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    
    return (
      <Badge className={`text-xs border ${variants[category as keyof typeof variants] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {category}
      </Badge>
    );
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
    toast.success("Attachment deleted");
  };

  const handleUpload = () => {
    // In real app, this would open file upload dialog
    toast.info("File upload functionality will be implemented here");
  };

  const totalSize = attachments.reduce((total, att) => {
    const sizeInMB = parseFloat(att.size.replace(/[^\d.]/g, ''));
    return total + (att.size.includes('KB') ? sizeInMB / 1024 : sizeInMB);
  }, 0);

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <File className="h-5 w-5" />
            Attachments ({attachments.length})
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Size</p>
              <p className="text-sm font-semibold">{totalSize.toFixed(1)} MB</p>
            </div>
            <Button onClick={handleUpload} className="gap-2">
              <Plus className="h-4 w-4" />
              Upload File
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {attachments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="h-12 w-12 mx-auto mb-4 opacity-50">
              <File className="h-12 w-12" />
            </div>
            <p>No attachments uploaded yet</p>
            <p className="text-sm">Upload documents, images, or other files related to this offer</p>
          </div>
        ) : (
          <div className="space-y-4">
            {attachments.map((attachment) => (
              <Card key={attachment.id} className="hover:shadow-md transition-all duration-200 group">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getFileIcon(attachment.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground truncate">
                          {attachment.name}
                        </h4>
                        {getCategoryBadge(attachment.category)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{attachment.size}</span>
                        <span>•</span>
                        <span>Uploaded by {attachment.uploadedBy}</span>
                        <span>•</span>
                        <span>{format(attachment.uploadedAt, 'MMM d, yyyy HH:mm')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteAttachment(attachment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {attachments.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="text-muted-foreground">Documents</p>
                <p className="font-semibold">{attachments.filter(att => att.type === 'pdf' || att.type === 'document').length}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Images</p>
                <p className="font-semibold">{attachments.filter(att => att.type === 'image').length}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Total Files</p>
                <p className="font-semibold">{attachments.length}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}