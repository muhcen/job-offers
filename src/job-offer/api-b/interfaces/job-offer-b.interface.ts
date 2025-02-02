export interface JobLocation {
  city: string;
  state: string;
  remote: boolean;
}

export interface Compensation {
  min: number;
  max: number;
  currency: string;
}

export interface Employer {
  companyName: string;
  website: string;
}

export interface Requirements {
  experience: number;
  technologies: string[];
}

export interface JobB {
  jobId: string;
  title: string;
  details: {
    location: string;
    remote: boolean;
    salaryRange: string;
  };
  company: {
    name: string;
    industry: string;
  };
  skills: string[];
  postedDate: string;
}

export interface JobOfferBDetails {
  jobsList: Record<
    string,
    {
      position: string;
      location: JobLocation;
      compensation: Compensation;
      employer: Employer;
      requirements: Requirements;
      datePosted: string;
    }
  >;
}

export interface JobOfferBResponse {
  data: {
    status: number;
    data: {
      jobsList: Record<
        string,
        {
          position: string;
          location: JobLocation;
          compensation: Compensation;
          employer: Employer;
          requirements: Requirements;
          datePosted: string;
        }
      >;
    };
  };
}
