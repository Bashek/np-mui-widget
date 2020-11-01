import { ApiService } from './ApiService';
import { createConfig } from '../createConfig';

describe('ApiService', () => {
  let apiService;
  const config = createConfig();
  const errorHandler = () => {};


  beforeEach(() => {
    apiService = new ApiService(config, errorHandler);
  })

  it('')
});
