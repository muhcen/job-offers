# Project Name

## Setup Instructions

1. **Create the Environment File**:

   - Copy the contents of `env.example` to create your own environment file.
   - First, create the `env.development` file based on the example.

2. **Running the Project**:

   - Once the environment file is set up, use the following command to start the project:
     ```bash
     sudo docker-compose up
     ```

3. **Running Tests**:

   - For testing, Docker is also used. Run the following command to start the test environment:
     ```bash
     sudo docker-compose -f docker-compose-test.yml up
     ```

4. **Testing the API**:
   - After running the project, you can test the main API through Swagger at the following address:
     ```
     http://localhost:3000/api#/Job/JobController_getJobOffers
     ```
