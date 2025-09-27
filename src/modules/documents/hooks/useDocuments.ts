import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Document, DocumentFilters, DocumentStats } from '../types';
import { DocumentsService } from '../services/documents.service';

export const useDocuments = (filters?: DocumentFilters) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [documentsData, statsData] = await Promise.all([
        DocumentsService.getDocuments(filters),
        DocumentsService.getDocumentStats()
      ]);
      setDocuments(documentsData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const deleteDocument = useCallback(async (id: string) => {
    try {
      await DocumentsService.deleteDocument(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      toast.success('Document deleted successfully');
      
      // Refresh stats
      const newStats = await DocumentsService.getDocumentStats();
      setStats(newStats);
    } catch (err) {
      toast.error('Failed to delete document');
      throw err;
    }
  }, []);

  const addComment = useCallback(async (documentId: string, comment: string) => {
    try {
      const newComment = await DocumentsService.addComment(documentId, comment);
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, comments: [...doc.comments, newComment] }
            : doc
        )
      );
      toast.success('Comment added successfully');
      return newComment;
    } catch (err) {
      toast.error('Failed to add comment');
      throw err;
    }
  }, []);

  const createShareLink = useCallback(async (
    documentId: string, 
    type: 'internal' | 'external', 
    accessLevel: 'view' | 'download',
    expiresAt?: Date,
    maxAccess?: number
  ) => {
    try {
      const shareLink = await DocumentsService.createShareLink(documentId, type, accessLevel, expiresAt, maxAccess);
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, shareLinks: [...doc.shareLinks, shareLink] }
            : doc
        )
      );
      toast.success('Share link created successfully');
      return shareLink;
    } catch (err) {
      toast.error('Failed to create share link');
      throw err;
    }
  }, []);

  const toggleShareLink = useCallback(async (linkId: string) => {
    try {
      const updatedLink = await DocumentsService.toggleShareLink(linkId);
      setDocuments(prev => 
        prev.map(doc => ({
          ...doc,
          shareLinks: doc.shareLinks.map(link => 
            link.id === linkId ? updatedLink : link
          )
        }))
      );
      toast.success(`Share link ${updatedLink.isActive ? 'activated' : 'deactivated'}`);
      return updatedLink;
    } catch (err) {
      toast.error('Failed to toggle share link');
      throw err;
    }
  }, []);

  return {
    documents,
    stats,
    loading,
    error,
    refetch: fetchDocuments,
    deleteDocument,
    addComment,
    createShareLink,
    toggleShareLink
  };
};