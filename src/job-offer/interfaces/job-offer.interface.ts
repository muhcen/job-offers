export interface IJob {
  jobId: string;
  title: string;
  type: string;
  name: string;
  industry: string;
  skills: string[];
  postedDate: Date;
  minSalary: number;
  maxSalary: number;
  city: string;
  state: string;
  currency: string;
  website?: string;
}

export interface ApiResponse {
  status: number;
  data: any;
}

export interface JobOfferApiService {
  fetchAndTransformJobOffers(
    apiUrl: string,
    transformFunc: Function,
  ): Promise<IJob[]>;
}
