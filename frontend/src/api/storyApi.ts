import apiClient from './client';

export interface Story {
  id: string;
  employee_id: string;
  title: string;
  content: Record<string, string>;
  status: string;
  created_at: string;
  updated_at: string;
  review_comment?: string;
  author?: {
    full_name?: string;
    email: string;
  };
}

export interface StoryCreate {
  title: string;
  content: Record<string, string>;
  status?: string;
}

export interface StoryUpdate {
  title?: string;
  content?: Record<string, string>;
  status?: string;
}

export const storyApi = {
  getPublishedStories: async () => {
    const response = await apiClient.get<Story[]>('/stories/published');
    return response.data;
  },

  getMyStories: async () => {
    const response = await apiClient.get<Story[]>('/stories/my-stories');
    return response.data;
  },

  getStoryById: async (id: string) => {
    const response = await apiClient.get<Story>(`/stories/${id}`);
    return response.data;
  },

  createStory: async (data: StoryCreate) => {
    const response = await apiClient.post<Story>('/stories/', data);
    return response.data;
  },

  updateStory: async (id: string, data: StoryUpdate) => {
    const response = await apiClient.put<Story>(`/stories/${id}`, data);
    return response.data;
  },

  submitStoryForReview: async (id: string) => {
    const response = await apiClient.post<Story>(`/stories/${id}/submit`);
    return response.data;
  },

  deleteStory: async (id: string) => {
    const response = await apiClient.delete(`/stories/${id}`);
    return response.data;
  }
};
