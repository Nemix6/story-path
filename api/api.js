
// Base URL for the Storypath RESTful API
// const API_BASE_URL = ;

// JWT token for authorization, replace with your actual token from My Grades in Blackboard
const JWT_TOKEN = ;

// Username, used for row-level security to retrieve your records
const USERNAME = ;

/**
 * Helper function to handle API requests.
 * It sets the Authorization token and optionally includes the request body.
 * 
 * @param {string} endpoint - The API endpoint to call.
 * @param {string} [method='GET'] - The HTTP method to use (GET, POST, PATCH).
 * @param {object} [body=null] - The request body to send, typically for POST or PATCH.
 * @returns {Promise<object>} - The JSON response from the API.
 * @throws Will throw an error if the HTTP response is not OK.
 */
async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method, // Set the HTTP method (GET, POST, PATCH)
    headers: {
      'Content-Type': 'application/json', // Indicate that we are sending JSON data
      'Authorization': `Bearer ${JWT_TOKEN}` // Include the JWT token for authentication
    },
  };

  // If the method is POST or PATCH, we want the response to include the full representation
  if (method === 'POST' || method === 'PATCH') {
    options.headers['Prefer'] = 'return=representation';
  }

  // If a body is provided, add it to the request and include the username
  if (body) {
    options.body = JSON.stringify({ ...body, username: USERNAME });
  }

  // Make the API request and check if the response is OK
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }
  
  // Return the response as a JSON object
  return response.json();
}

/**
 * Function to insert a new project into the database.
 * 
 * @param {object} project - The project data to insert.
 * @returns {Promise<object>} - The created project object returned by the API.
 */
export async function createProject(project) {
  return apiRequest('/project', 'POST', project);
}

/**
 * Function to list all projects associated with the current user.
 * 
 * @returns {Promise<Array>} - An array of project objects.
 */
// export async function getProjects() {
//   return apiRequest('/project');
// }

// export async function updateProject(id, project) {
//   return apiRequest(`/project?id=eq.${id}`, 'PATCH', project);
// }

// export async function deleteProject(id) {
//   return apiRequest(`/project?id=eq.${id}`, 'DELETE');
// }

export async function getPublishedProjects() {
  return apiRequest('/project?is_published=eq.true');
}

export async function getProjectParticipantCount(id) {
  const response = await apiRequest(`/project_participant_counts?project_id=eq.${id}`);
  return response[0];
}


/**
 * Function to get a single project by its ID.
 * The url is slightly different from usual RESTFul ...
 * See the operators section https://docs.postgrest.org/en/v12/references/api/tables_views.html
 * @param {string} id - The ID of the project to retrieve.
 * @returns {Promise<object>} - The project object matching the ID.
 */
export async function getProject(id) {
  const response = await apiRequest(`/project?id=eq.${id}`);
  // Initially, the response is an array with a single object.
  return response[0];
}


export async function createLocation(location) {
  return apiRequest('/location', 'POST', location);
}

export async function getLocations(id) {
  return apiRequest(`/location?project_id=eq.${id}`);
}


export async function getLocation(id) {
  const response = await apiRequest(`/location?id=eq.${id}`);
  return response[0];
}

export async function updateLocation(id, location) {
  return apiRequest(`/location?id=eq.${id}`, 'PATCH', location);
}

export async function deleteLocation(id) {
  // filter results of the location table by id
  return apiRequest(`/location?id=eq.${id}`, 'DELETE');
}

export async function addTracking(tracking) {
  return apiRequest('/tracking', 'POST', tracking);
}

export async function getTrackings(project_id, participant_username) {
  return apiRequest(`/tracking?project_id=eq.${project_id}&participant_username=eq.${participant_username}`);
}
/**
 * Main function to demonstrate API usage.
 * 
 * Creates a new project, lists all projects, and retrieves a single project by ID.
 */
async function main() {
  try {
    // Create a new project with specific details
    const newProject = {
      title: 'My first Tour',
      description: 'Description ....',
      instructions: 'Follow these instructions',
      initial_clue: 'First clue',
      homescreen_display: 'Display initial clue',
      is_published: true, // The project is not published initially
      participant_scoring: 'Not Scored' // Scoring method for participants
    };
    const createdProject = await createProject(newProject);
    console.log('Created Project:', createdProject);

    // Retrieve and list all projects associated with the current user
    const allProjects = await getProjects();
    console.log('All Projects:', allProjects);

    // If there are projects, retrieve the first one by its ID
    if (allProjects.length > 0) {
      const singleProject = await getProject(allProjects[0].id);
      console.log('Single Project:', singleProject);
    }

    // Further functionality for other endpoints like /location can be added here...

  } catch (error) {
    const response = await error.json();
    console.error('API Error:', response.message);
    
  }
}

  async function yea() {
    const newLocation = {
      location_name: 'Mater Hill Station',
      location_trigger: 'Description ....',
      location_position: '(-23.44523339338441, 153.08915426132132)',
      score_points: 4,
      clue: 'First clue',
      location_content: 'Display initial clue',
      project_id: 8698
    };

    const createdLocation = await createLocation(newLocation);
    console.log('Created Location:', createdLocation);
  }

async function ayee() {
  const newParticipant = {
    project_id: 8698,
    participant_count: 1,
  };


  const createdParticipant = await addParticipant(newParticipant);
  console.log('Created Participant:', createdParticipant);
  const getParticipant = await getProjectParticipantCount(8698);
  console.log('Participant:', getParticipant);
}

// ayee();
// main();
// Execute the main function
// main();
// yea();
