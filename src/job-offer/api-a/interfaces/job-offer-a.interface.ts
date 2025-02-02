export interface JobOfferDetails {
  location: string;
  type: string;
  salaryRange: string;
}

export interface Company {
  name: string;
  industry: string;
}

export interface JobA {
  jobId: string;
  title: string;
  details: JobOfferDetails;
  company: Company;
  skills: string[];
  postedDate: string;
}

export interface JobOfferADetails {
  metadata: {
    requestId: string;
    timestamp: string;
  };
  jobs: JobA[];
}

export interface JobOfferAResponse {
  status: number;
  data: {
    metadata: {
      requestId: string;
      timestamp: string;
    };
    jobs: JobA[];
  };
}
