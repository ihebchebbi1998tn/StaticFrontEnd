import { Document, DocumentFilters, DocumentStats, DocumentUploadData, DocumentComment, DocumentShareLink } from '../types';

// Mock data for development
let mockDocuments: Document[] = [];

// Initialize with mock data
const initializeMockData = () => {
  if (mockDocuments.length === 0) {
    mockDocuments = [
      {
        id: 'DOC-001',
        fileName: 'contract-signed.pdf',
        originalName: 'Sales Contract - Acme Corp.pdf',
        fileType: 'pdf',
        fileSize: 2048576, // 2MB
        filePath: '/uploads/sales/contract-signed.pdf',
        mimeType: 'application/pdf',
        moduleType: 'sales',
        moduleId: 'SALE-001',
        moduleName: 'Acme Corp Deal',
        uploadedBy: 'user-1',
        uploadedByName: 'John Sales',
        uploadedAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        description: 'Signed sales contract with Acme Corporation',
        tags: ['contract', 'signed', 'legal'],
        isPublic: false,
        category: 'crm',
        comments: [
          {
            id: 'comment-1',
            documentId: 'DOC-001',
            userId: 'user-2',
            userName: 'Jane Manager',
            comment: 'Contract has been reviewed and approved',
            createdAt: new Date('2024-01-16')
          }
        ],
        shareLinks: []
      },
      {
        id: 'DOC-002',
        fileName: 'quote-design.pdf',
        originalName: 'Quote OFFER-002 - Design Services.pdf',
        fileType: 'pdf',
        fileSize: 1536000, // 1.5MB
        filePath: '/uploads/offers/quote-design.pdf',
        mimeType: 'application/pdf',
        moduleType: 'offers',
        moduleId: 'OFFER-002',
        moduleName: 'Monthly Consulting Services',
        uploadedBy: 'user-3',
        uploadedByName: 'Mike Designer',
        uploadedAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        description: 'Design services quote for client consultation',
        tags: ['quote', 'design', 'consulting'],
        isPublic: true,
        category: 'crm',
        comments: [],
        shareLinks: [
          {
            id: 'share-1',
            documentId: 'DOC-002',
            linkId: 'abc123def456',
            type: 'external',
            accessLevel: 'view',
            expiresAt: new Date('2024-02-10'),
            createdBy: 'user-3',
            createdByName: 'Mike Designer',
            createdAt: new Date('2024-01-10'),
            isActive: true,
            accessCount: 5,
            maxAccess: 50
          }
        ]
      },
      {
        id: 'DOC-003',
        fileName: 'site-inspection.jpg',
        originalName: 'Site Inspection Photo 1.jpg',
        fileType: 'jpg',
        fileSize: 3145728, // 3MB
        filePath: '/uploads/field/site-inspection.jpg',
        mimeType: 'image/jpeg',
        moduleType: 'field',
        moduleId: 'FIELD-001',
        moduleName: 'Site Inspection - Downtown Project',
        uploadedBy: 'user-4',
        uploadedByName: 'Alex Technician',
        uploadedAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
        description: 'Site inspection photo showing current conditions',
        tags: ['inspection', 'photo', 'field'],
        isPublic: false,
        category: 'field',
        comments: [
          {
            id: 'comment-2',
            documentId: 'DOC-003',
            userId: 'user-1',
            userName: 'John Sales',
            comment: 'Great photo quality, very clear documentation',
            createdAt: new Date('2024-01-21')
          }
        ],
        shareLinks: []
      },
      {
        id: 'DOC-004',
        fileName: 'contact-id.png',
        originalName: 'Business Card - Jane Smith.png',
        fileType: 'png',
        fileSize: 512000, // 500KB
        filePath: '/uploads/contacts/contact-id.png',
        mimeType: 'image/png',
        moduleType: 'contacts',
        moduleId: 'CONT-002',
        moduleName: 'Jane Smith - Tech Startup',
        uploadedBy: 'user-2',
        uploadedByName: 'Jane Manager',
        uploadedAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18'),
        description: 'Scanned business card for contact information',
        tags: ['business-card', 'contact', 'scan'],
        isPublic: false,
        category: 'crm',
        comments: [],
        shareLinks: []
      },
      {
        id: 'DOC-005',
        fileName: 'service-report.pdf',
        originalName: 'Monthly Service Report - January 2024.pdf',
        fileType: 'pdf',
        fileSize: 4194304, // 4MB
        filePath: '/uploads/services/service-report.pdf',
        mimeType: 'application/pdf',
        moduleType: 'services',
        moduleId: 'SRV-001',
        moduleName: 'Monthly Maintenance Service',
        uploadedBy: 'user-5',
        uploadedByName: 'Sarah Technician',
        uploadedAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
        description: 'Comprehensive service report for January 2024',
        tags: ['report', 'service', 'monthly'],
        isPublic: false,
        category: 'crm',
        comments: [
          {
            id: 'comment-3',
            documentId: 'DOC-005',
            userId: 'user-2',
            userName: 'Jane Manager',
            comment: 'Excellent detailed report, all requirements met',
            createdAt: new Date('2024-02-02')
          }
        ],
        shareLinks: []
      }
    ];
  }
};

export class DocumentsService {
  static async getDocuments(filters?: DocumentFilters): Promise<Document[]> {
    initializeMockData();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let filteredDocuments = [...mockDocuments];
    
    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredDocuments = filteredDocuments.filter(doc => 
          doc.fileName.toLowerCase().includes(searchLower) ||
          doc.originalName.toLowerCase().includes(searchLower) ||
          doc.description?.toLowerCase().includes(searchLower) ||
          doc.moduleName?.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.moduleType) {
        filteredDocuments = filteredDocuments.filter(doc => doc.moduleType === filters.moduleType);
      }
      
      if (filters.fileType) {
        filteredDocuments = filteredDocuments.filter(doc => doc.fileType === filters.fileType);
      }
      
      if (filters.category) {
        filteredDocuments = filteredDocuments.filter(doc => doc.category === filters.category);
      }
      
      if (filters.uploadedBy) {
        filteredDocuments = filteredDocuments.filter(doc => doc.uploadedBy === filters.uploadedBy);
      }
      
      if (filters.tags && filters.tags.length > 0) {
        filteredDocuments = filteredDocuments.filter(doc => 
          filters.tags!.some(tag => doc.tags.includes(tag))
        );
      }
      
      if (filters.dateFrom) {
        filteredDocuments = filteredDocuments.filter(doc => 
          new Date(doc.uploadedAt) >= filters.dateFrom!
        );
      }
      
      if (filters.dateTo) {
        filteredDocuments = filteredDocuments.filter(doc => 
          new Date(doc.uploadedAt) <= filters.dateTo!
        );
      }
    }
    
    return filteredDocuments.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  static async getDocumentById(id: string): Promise<Document | null> {
    initializeMockData();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return mockDocuments.find(doc => doc.id === id) || null;
  }

  static async getDocumentStats(): Promise<DocumentStats> {
    initializeMockData();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const totalFiles = mockDocuments.length;
    const totalSize = mockDocuments.reduce((sum, doc) => sum + doc.fileSize, 0);
    const crmFiles = mockDocuments.filter(doc => doc.category === 'crm').length;
    const fieldFiles = mockDocuments.filter(doc => doc.category === 'field').length;
    
    const byModule = {
      contacts: mockDocuments.filter(doc => doc.moduleType === 'contacts').length,
      sales: mockDocuments.filter(doc => doc.moduleType === 'sales').length,
      offers: mockDocuments.filter(doc => doc.moduleType === 'offers').length,
      services: mockDocuments.filter(doc => doc.moduleType === 'services').length,
      projects: mockDocuments.filter(doc => doc.moduleType === 'projects').length,
      field: mockDocuments.filter(doc => doc.moduleType === 'field').length,
    };
    
    const recentActivity = mockDocuments.filter(doc => {
      const daysSinceUpload = (Date.now() - new Date(doc.uploadedAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceUpload <= 7;
    }).length;
    
    return {
      totalFiles,
      totalSize,
      crmFiles,
      fieldFiles,
      byModule,
      recentActivity
    };
  }

  static async uploadDocuments(data: DocumentUploadData): Promise<Document[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const uploadedDocs: Document[] = data.files.map((file, index) => {
      const doc: Document = {
        id: `DOC-${String(mockDocuments.length + index + 1).padStart(3, '0')}`,
        fileName: file.name.replace(/[^a-zA-Z0-9.-]/g, '_'),
        originalName: file.name,
        fileType: file.name.split('.').pop()?.toLowerCase() || 'unknown',
        fileSize: file.size,
        filePath: `/uploads/${data.moduleType}/${file.name}`,
        mimeType: file.type,
        moduleType: data.moduleType as any,
        moduleId: data.moduleId,
        moduleName: data.moduleName,
        uploadedBy: 'current-user',
        uploadedByName: 'Current User',
        uploadedAt: new Date(),
        updatedAt: new Date(),
        description: data.description,
        tags: data.tags || [],
        isPublic: data.isPublic || false,
        category: data.category,
        comments: [],
        shareLinks: []
      };
      
      mockDocuments.push(doc);
      return doc;
    });
    
    return uploadedDocs;
  }

  static async deleteDocument(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = mockDocuments.findIndex(doc => doc.id === id);
    if (index === -1) {
      throw new Error('Document not found');
    }
    
    mockDocuments.splice(index, 1);
  }

  static async addComment(documentId: string, comment: string): Promise<DocumentComment> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const document = mockDocuments.find(doc => doc.id === documentId);
    if (!document) {
      throw new Error('Document not found');
    }
    
    const newComment: DocumentComment = {
      id: `comment-${Date.now()}`,
      documentId,
      userId: 'current-user',
      userName: 'Current User',
      comment,
      createdAt: new Date()
    };
    
    document.comments.push(newComment);
    document.updatedAt = new Date();
    
    return newComment;
  }

  static async createShareLink(documentId: string, type: 'internal' | 'external', accessLevel: 'view' | 'download', expiresAt?: Date, maxAccess?: number): Promise<DocumentShareLink> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const document = mockDocuments.find(doc => doc.id === documentId);
    if (!document) {
      throw new Error('Document not found');
    }
    
    const shareLink: DocumentShareLink = {
      id: `share-${Date.now()}`,
      documentId,
      linkId: Math.random().toString(36).substring(2, 15),
      type,
      accessLevel,
      expiresAt,
      createdBy: 'current-user',
      createdByName: 'Current User',
      createdAt: new Date(),
      isActive: true,
      accessCount: 0,
      maxAccess
    };
    
    document.shareLinks.push(shareLink);
    document.updatedAt = new Date();
    
    return shareLink;
  }

  static async toggleShareLink(linkId: string): Promise<DocumentShareLink> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    for (const document of mockDocuments) {
      const shareLink = document.shareLinks.find(link => link.id === linkId);
      if (shareLink) {
        shareLink.isActive = !shareLink.isActive;
        document.updatedAt = new Date();
        return shareLink;
      }
    }
    
    throw new Error('Share link not found');
  }

  static getPreviewUrl(document: Document): string | null {
    // For demo purposes, return a mock preview URL for supported file types
    if (document.fileType === 'pdf') {
      return `/api/documents/${document.id}/preview`;
    }
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(document.fileType)) {
      return `/api/documents/${document.id}/preview`;
    }
    
    return null;
  }

  static canPreview(document: Document): boolean {
    const supportedTypes = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'txt', 'csv'];
    return supportedTypes.includes(document.fileType);
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}