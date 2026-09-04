import apiClient from './client';
import { Story } from './storyApi';

export interface StoryReview {
  status: 'approved' | 'rejected';
  review_comment?: string;
}

export const hrApi = {
  getPendingStories: async () => {
    const response = await apiClient.get<Story[]>('/hr/stories/pending');
    return response.data;
  },

  reviewStory: async (storyId: string, review: StoryReview) => {
    const response = await apiClient.post<Story>(`/hr/stories/${storyId}/review`, review);
    return response.data;
  }
};
