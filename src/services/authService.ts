// NocoDB configuration
const NOCODB_CONFIG = {
  host: 'https://nocodb.bbtqj1.easypanel.host/',
  baseId: 'pzezd6u18bjbe4r',
  tableId: 'm1pjssubll7aqlh',
  apiToken: 'ugotnKik_E0FBXkZsdwdARlwWvNTqQg7R2Kirriy',
  emailFieldId: 'cv9q51c8djt9uw9',
  passwordFieldId: 'cpcsmtdxachjpg9',
  userTypeFieldId: 'cie59mvkmj051c0' // Added the correct field ID for UserType
};

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: any;
}

// Simplified direct authentication function
export const loginWithNocoDB = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('Attempting login with credentials:', { email: credentials.email, passwordProvided: !!credentials.password });
    
    // Use the simplest possible API endpoint format
    // First, try to get all users to verify connection and understand response format
    const listUrl = `${NOCODB_CONFIG.host}api/v1/db/data/noco/${NOCODB_CONFIG.baseId}/${NOCODB_CONFIG.tableId}`;
    
    console.log('Fetching users list to verify connection:', listUrl);
    
    const listResponse = await fetch(listUrl, {
      method: 'GET',
      headers: {
        'xc-token': NOCODB_CONFIG.apiToken,
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(15000)
    });
    
    if (!listResponse.ok) {
      console.error('Failed to fetch users list:', listResponse.status, await listResponse.text());
      return {
        success: false,
        message: 'Could not connect to authentication service. Please try again later.'
      };
    }
    
    const listData = await listResponse.json();
    console.log('Users list response structure:', 
      Object.keys(listData),
      'Total records:', Array.isArray(listData.list) ? listData.list.length : 'unknown format'
    );
    
    // Extract users from the response
    let users = [];
    if (Array.isArray(listData)) {
      users = listData;
    } else if (listData.list && Array.isArray(listData.list)) {
      users = listData.list;
    } else if (listData.data && Array.isArray(listData.data)) {
      users = listData.data;
    } else {
      console.error('Unexpected users list format:', listData);
      return {
        success: false,
        message: 'Authentication error: Unexpected data format'
      };
    }
    
    // Log the first user structure to understand field mapping
    if (users.length > 0) {
      console.log('Sample user data structure:', 
        Object.keys(users[0]),
        'Email field exists:', NOCODB_CONFIG.emailFieldId in users[0] || 'email' in users[0],
        'Password field exists:', NOCODB_CONFIG.passwordFieldId in users[0] || 'password' in users[0],
        'UserType field exists:', NOCODB_CONFIG.userTypeFieldId in users[0] || 'UserType' in users[0]
      );
    } else {
      console.log('No users found in the database');
      return {
        success: false,
        message: 'Authentication error: No users found in database'
      };
    }
    
    // Manual search for the user with matching email
    const user = users.find(u => {
      // Try different ways to access the email field
      const userEmail = u[NOCODB_CONFIG.emailFieldId] || u.email || u.Email || null;
      return userEmail && userEmail.toLowerCase() === credentials.email.toLowerCase();
    });
    
    if (!user) {
      console.log('No user found with email:', credentials.email);
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
    
    console.log('Found user with matching email');
    console.log('User data fields:', Object.keys(user));
    
    // Try different ways to access the password field
    const storedPassword = user[NOCODB_CONFIG.passwordFieldId] || user.password || user.Password;
    
    if (storedPassword === undefined) {
      console.error('Password field not found in user data. Available fields:', Object.keys(user));
      return {
        success: false,
        message: 'Authentication error: Password field not found'
      };
    }
    
    // Simple string comparison of passwords
    if (storedPassword === credentials.password) {
      console.log('Password match successful');
      
      // Check if user has refund status
      const hasRefund = user.refund === true || user.refund === 'yes' || user.Refund === true || user.Refund === 'yes';
      
      if (hasRefund) {
        console.log('User has refund status, access denied');
        return {
          success: false,
          message: 'Your account access has been revoked. Please contact support for assistance.'
        };
      }
      
      // Extract user type with specific field ID and fallbacks
      const userTypeValue = user[NOCODB_CONFIG.userTypeFieldId] || user.UserType || user.userType || user.user_type || user.User_Type || user.type || user.Type || 'user';
      
      // Log the user type for debugging
      console.log('User type detected:', userTypeValue, 'from field:', NOCODB_CONFIG.userTypeFieldId);
      
      // Store authentication state with normalized data
      const normalizedUserData = {
        ...user,
        // Ensure these fields exist with normalized values
        userType: userTypeValue,
        UserType: userTypeValue, // Add both variations to ensure it's found
        [NOCODB_CONFIG.userTypeFieldId]: userTypeValue, // Also store with the field ID
        lifetime: user.lifetime === true || user.lifetime === 'yes' || user.Lifetime === true || user.Lifetime === 'yes',
        refund: hasRefund
      };
      
      console.log('Storing normalized user data:', normalizedUserData);
      
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(normalizedUserData));
      
      return {
        success: true,
        message: 'Login successful',
        user: normalizedUserData
      };
    } else {
      console.log('Password mismatch');
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      return {
        success: false,
        message: 'Connection to authentication service timed out. Please try again later.'
      };
    }
    
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    };
  }
};

// Direct API test function
export const testNocoDBConnection = async (): Promise<{success: boolean, message: string, details?: any}> => {
  try {
    // Test direct data access - simplest possible approach
    const testUrl = `${NOCODB_CONFIG.host}api/v1/db/data/noco/${NOCODB_CONFIG.baseId}/${NOCODB_CONFIG.tableId}/count`;
    console.log('Testing direct data access at:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'xc-token': NOCODB_CONFIG.apiToken,
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      return {
        success: false,
        message: `NocoDB connection failed: ${response.status}`,
        details: await response.text()
      };
    }
    
    const data = await response.json();
    
    // Try to fetch one record to verify field structure
    const sampleUrl = `${NOCODB_CONFIG.host}api/v1/db/data/noco/${NOCODB_CONFIG.baseId}/${NOCODB_CONFIG.tableId}?limit=1`;
    console.log('Fetching sample record at:', sampleUrl);
    
    const sampleResponse = await fetch(sampleUrl, {
      method: 'GET',
      headers: {
        'xc-token': NOCODB_CONFIG.apiToken,
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!sampleResponse.ok) {
      return {
        success: true,
        message: 'Connection successful but could not fetch sample record',
        details: {
          count: data,
          sampleError: await sampleResponse.text()
        }
      };
    }
    
    const sampleData = await sampleResponse.json();
    let fieldInfo = 'No records found';
    
    // Extract field information from sample record
    if (sampleData.list && sampleData.list.length > 0) {
      const record = sampleData.list[0];
      fieldInfo = `Fields: ${Object.keys(record).join(', ')}`;
    }
    
    return {
      success: true,
      message: `Connection successful. Total records: ${data.count}. ${fieldInfo}`,
      details: {
        count: data,
        sample: sampleData
      }
    };
  } catch (error) {
    console.error('Connection test error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error during connection test',
      details: error
    };
  }
};

export const logout = (): void => {
  // Clear authentication data
  localStorage.removeItem('userLoggedIn');
  sessionStorage.removeItem('userLoggedIn');
  localStorage.removeItem('userData');
};

// Function to check if current user is admin
export const isAdmin = (): boolean => {
  try {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      console.log('isAdmin: No user data found in localStorage');
      return false;
    }
    
    const user = JSON.parse(userData);
    
    // Check for userType with the specific field ID first, then fallbacks
    const userType = 
      user[NOCODB_CONFIG.userTypeFieldId] ||
      user.UserType || // Exact field name as specified
      user.userType || 
      user.user_type || 
      user.User_Type || 
      user.type ||
      user.Type ||
      '';
    
    // Log for debugging
    console.log('isAdmin: Checking admin status:', { 
      userType, 
      fieldId: NOCODB_CONFIG.userTypeFieldId,
      hasFieldId: NOCODB_CONFIG.userTypeFieldId in user,
      hasUserType: 'UserType' in user,
      isAdmin: typeof userType === 'string' && userType.toLowerCase() === 'admin',
      userData: JSON.stringify(user)
    });
    
    return typeof userType === 'string' && userType.toLowerCase() === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Function to check if user has lifetime access
export const hasLifetimeAccess = (): boolean => {
  try {
    const userData = localStorage.getItem('userData');
    if (!userData) return false;
    
    const user = JSON.parse(userData);
    return user.lifetime === true || user.Lifetime === true || 
           user.lifetime === 'yes' || user.Lifetime === 'yes';
  } catch (error) {
    console.error('Error checking lifetime status:', error);
    return false;
  }
};

// Function to get current user data
export const getCurrentUser = (): any => {
  try {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
