// Mock Comments Service - Static data only
export interface BackendTaskCommentResponse {
  id: number;
  projectTaskId?: number;
  dailyTaskId?: number;
  taskTitle: string;
  content: string;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskCommentRequest {
  projectTaskId?: number;
  dailyTaskId?: number;
  content: string;
  authorId: number;
  authorName: string;
}

export interface UpdateTaskCommentRequest {
  content: string;
}

export interface CommentSearchRequest {
  searchTerm?: string;
  projectTaskId?: number;
  dailyTaskId?: number;
  authorId?: number;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
}

// Mock data storage
let mockComments: BackendTaskCommentResponse[] = [];

export class TaskCommentsService {
  static async getTaskComments(projectTaskId?: number, dailyTaskId?: number): Promise<BackendTaskCommentResponse[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockComments.filter(comment => 
      (projectTaskId && comment.projectTaskId === projectTaskId) ||
      (dailyTaskId && comment.dailyTaskId === dailyTaskId)
    );
  }

  static async getTaskCommentById(id: number): Promise<BackendTaskCommentResponse> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const comment = mockComments.find(c => c.id === id);
    if (!comment) throw new Error('Comment not found');
    return comment;
  }

  static async createTaskComment(data: CreateTaskCommentRequest): Promise<BackendTaskCommentResponse> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newComment: BackendTaskCommentResponse = {
      id: Math.max(...mockComments.map(c => c.id), 0) + 1,
      ...data,
      taskTitle: "Sample Task",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockComments.push(newComment);
    return newComment;
  }

  static async updateTaskComment(id: number, data: UpdateTaskCommentRequest): Promise<BackendTaskCommentResponse> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const commentIndex = mockComments.findIndex(c => c.id === id);
    if (commentIndex === -1) throw new Error('Comment not found');
    
    const updatedComment = {
      ...mockComments[commentIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };
    mockComments[commentIndex] = updatedComment;
    return updatedComment;
  }

  static async deleteTaskComment(id: number): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const commentIndex = mockComments.findIndex(c => c.id === id);
    if (commentIndex === -1) return false;
    mockComments.splice(commentIndex, 1);
    return true;
  }

  static async searchComments(searchRequest: CommentSearchRequest) {
    await new Promise(resolve => setTimeout(resolve, 400));
    let results = [...mockComments];
    
    if (searchRequest.searchTerm) {
      results = results.filter(comment => 
        comment.content.toLowerCase().includes(searchRequest.searchTerm!.toLowerCase())
      );
    }
    
    if (searchRequest.authorId) {
      results = results.filter(comment => comment.authorId === searchRequest.authorId);
    }
    
    if (searchRequest.projectTaskId) {
      results = results.filter(comment => comment.projectTaskId === searchRequest.projectTaskId);
    }
    
    if (searchRequest.dailyTaskId) {
      results = results.filter(comment => comment.dailyTaskId === searchRequest.dailyTaskId);
    }
    
    return {
      success: true,
      data: results,
      totalCount: results.length
    };
  }

  static async getCommentsByAuthor(authorId: number, pageNumber: number = 1, pageSize: number = 10): Promise<BackendTaskCommentResponse[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockComments.filter(comment => comment.authorId === authorId);
  }

  static async getRecentComments(projectTaskId?: number, dailyTaskId?: number, count: number = 10): Promise<BackendTaskCommentResponse[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    let results = mockComments.filter(comment => 
      (projectTaskId && comment.projectTaskId === projectTaskId) ||
      (dailyTaskId && comment.dailyTaskId === dailyTaskId)
    );
    
    return results
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, count);
  }

  static async checkCommentExists(id: number): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockComments.some(comment => comment.id === id);
  }
}