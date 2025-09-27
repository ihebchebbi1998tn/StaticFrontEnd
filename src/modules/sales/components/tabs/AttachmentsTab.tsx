import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Image, File, Download, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Sale } from "../../types";
import { toast } from "sonner";

interface AttachmentsTabProps {
  sale: Sale;
}

// Mock attachments data - in real app this would come from API
const mockAttachments = [
  {
    id: "att-1",
    name: "Sale_Contract_Signed.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadedAt: new Date("2024-01-15T14:30:00"),
    uploadedBy: "John Smith",
    category: "contracts"
  },
  {
    id: "att-2",
    name: "Installation_Photos.jpg", 
    type: "image",
    size: "1.8 MB",
    uploadedAt: new Date("2024-01-16T09:20:00"),
    uploadedBy: "Sarah Johnson",
    category: "photos"
  },
  {
    id: "att-3",
    name: "Invoice_SALE-001.pdf",
    type: "pdf",
    size: "456 KB",
    uploadedAt: new Date("2024-01-16T16:45:00"),
    uploadedBy: "Mike Wilson",
    category: "invoices"
  },
  {
    id: "att-4",
    name: "Customer_Feedback.docx",
    type: "document",
    size: "234 KB",
    uploadedAt: new Date("2024-01-18T11:20:00"),
    uploadedBy: "Jane Doe",
    category: "feedback"
  }
];

export function AttachmentsTab({ sale }: AttachmentsTabProps) {
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contracts':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'photos':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'invoices':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'feedback':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDownload = (attachment: any) => {
    // In a real app, this would trigger actual file download
    toast.success(`Downloading ${attachment.name}...`);
  };

  const handleView = (attachment: any) => {
    // In a real app, this would open the file in a viewer
    toast.info(`Opening ${attachment.name}...`);
  };

  const handleDelete = (attachmentId: string) => {
    setAttachments(attachments.filter(att => att.id !== attachmentId));
    toast.success("Attachment deleted successfully");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newAttachment = {
          id: `att-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: file.type.includes('image') ? 'image' : 
                file.type.includes('pdf') ? 'pdf' : 'document',
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          uploadedAt: new Date(),
          uploadedBy: "Current User",
          category: "general"
        };
        setAttachments(prev => [newAttachment, ...prev]);
      });
      toast.success(`${files.length} file(s) uploaded successfully`);
    }
  };

  const groupedAttachments = attachments.reduce((groups, attachment) => {
    const category = attachment.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(attachment);
    return groups;
  }, {} as Record<string, typeof attachments>);

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Upload Attachments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-muted">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium">Upload files</p>
                <p className="text-sm text-muted-foreground">
                  Drag and drop files here, or click to browse
                </p>
              </div>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choose Files
                </label>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Attachments ({attachments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attachments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No attachments uploaded yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedAttachments).map(([category, categoryAttachments]) => (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-medium capitalize">{category}</h3>
                    <Badge variant="outline" className={getCategoryColor(category)}>
                      {categoryAttachments.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryAttachments.map((attachment) => (
                      <Card key={attachment.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              {getFileIcon(attachment.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate" title={attachment.name}>
                                {attachment.name}
                              </h4>
                              <div className="text-xs text-muted-foreground mt-1">
                                <div>{attachment.size}</div>
                                <div>by {attachment.uploadedBy}</div>
                                <div>{format(new Date(attachment.uploadedAt), 'MMM dd, yyyy')}</div>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`${getCategoryColor(attachment.category)} text-xs mt-2`}
                              >
                                {attachment.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mt-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(attachment)}
                              className="h-8 px-2"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(attachment)}
                              className="h-8 px-2"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(attachment.id)}
                              className="h-8 px-2 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}