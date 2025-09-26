import { GitCommandRequest, GitCommandResponse, IRepositoryState } from '@/types/git';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const gitEngine = {
  async executeGitCommand(command: string): Promise<GitCommandResponse> {
    try {
      const response = await axios.post<GitCommandResponse>(
        `${API_BASE_URL}/git/execute`,
        { command } as GitCommandRequest
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.statusText || error.message);
    }
  },

  async getRepositoryState(): Promise<IRepositoryState> {
    try {
      const response = await axios.get<IRepositoryState>(`${API_BASE_URL}/git/state`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.statusText || error.message);
    }
  },
};
