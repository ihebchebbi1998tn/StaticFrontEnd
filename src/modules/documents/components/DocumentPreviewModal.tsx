import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, 
  Share2, 
  MessageSquare, 
  Send,
  Calendar,
  User,
  FileText,
  Link,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import { Document } from '../types';
import { DocumentsService } from '../services/documents.service';
import { useDocuments } from '../hooks/useDocuments';

interface DocumentPreviewModalProps {
  document: Document;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentPreviewModal({ document, isOpen, onClose }: DocumentPreviewModalProps) {
  const { t } = useTranslation();
  const [newComment, setNewComment] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);
  const { addComment, createShareLink, toggleShareLink } = useDocuments();

  const canPreview = DocumentsService.canPreview(document);
  const previewUrl = DocumentsService.getPreviewUrl(document);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addComment(document.id, newComment);
      setNewComment('');
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleCreateShareLink = async (type: 'internal' | 'external', accessLevel: 'view' | 'download') => {
    try {
      await createShareLink(document.id, type, accessLevel);
      setShowShareOptions(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleToggleShareLink = async (linkId: string) => {
    try {
      await toggleShareLink(linkId);
    } catch (error) {
      // Error handled in hook
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatDateTime = (date: Date | string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document.originalName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* Preview Section */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{t('documents.preview')}</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {t('documents.download')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowShareOptions(!showShareOptions)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {t('documents.share')}
                </Button>
              </div>
            </div>

            <div className="flex-1 border rounded-lg overflow-hidden bg-muted/30">
              {canPreview && previewUrl ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-full"
                  title={document.originalName}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('documents.previewNotAvailable')}</h3>
                  <p className="text-muted-foreground mb-4">{t('documents.previewNotSupported')}</p>
                  <p className="text-sm text-muted-foreground">{t('documents.downloadToView')}</p>
                  <Button className="mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    {t('documents.download')}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Info & Actions Section */}
          <div className="flex flex-col gap-4 overflow-y-auto">
            {/* File Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t('documents.fileInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t('documents.fileName')}</span>
                  <p className="text-sm">{document.fileName}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t('documents.fileSize')}</span>
                  <p className="text-sm">{DocumentsService.formatFileSize(document.fileSize)}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t('documents.module')}</span>
                  <div className="mt-1">
                    <Badge className="text-xs">
                      {t(`documents.${document.moduleType}`)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t('documents.associatedRecord')}</span>
                  <p className="text-sm">{document.moduleName}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t('documents.uploadedBy')}</span>
                  <p className="text-sm flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {document.uploadedByName}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t('documents.uploadDate')}</span>
                  <p className="text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(document.uploadedAt)}
                  </p>
                </div>

                {document.description && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">{t('documents.description')}</span>
                    <p className="text-sm">{document.description}</p>
                  </div>
                )}

                {document.tags.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">{t('documents.tags')}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {document.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Share Links */}
            {document.shareLinks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    {t('documents.shareLinks')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {document.shareLinks.map((shareLink) => (
                    <div key={shareLink.id} className="p-2 border rounded">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={shareLink.isActive ? 'default' : 'secondary'}>
                            {shareLink.isActive ? t('documents.linkActive') : t('documents.linkInactive')}
                          </Badge>
                          <Badge variant="outline">{shareLink.type}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleShareLink(shareLink.id)}
                        >
                          {shareLink.isActive ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('documents.accessCount')}: {shareLink.accessCount}
                        {shareLink.maxAccess && ` / ${shareLink.maxAccess}`}
                      </p>
                      {shareLink.expiresAt && (
                        <p className="text-xs text-muted-foreground">
                          {t('documents.expiresAt')}: {formatDate(shareLink.expiresAt)}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Share Options */}
            {showShareOptions && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t('documents.createShareLink')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleCreateShareLink('internal', 'view')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Internal View Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleCreateShareLink('external', 'view')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    External View Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleCreateShareLink('external', 'download')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    External Download Link
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {t('documents.comments')} ({document.comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {document.comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {t('documents.noComments')}
                  </p>
                ) : (
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {document.comments.map((comment) => (
                      <div key={comment.id} className="p-2 border rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{comment.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <Textarea
                    placeholder={t('documents.commentPlaceholder')}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  <Button 
                    size="sm" 
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {t('documents.postComment')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}