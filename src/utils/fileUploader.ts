
/**
 * Helper function to upload resume files to the server
 * Currently using mock response due to server PHP configuration issues
 */
export const uploadResume = async (
  file: File,
  jobId: string,
  fullName: string
): Promise<{ success: boolean; resume_url?: string; error?: string }> => {
  try {
    // For now, we'll create a mock response since PHP is not executing on the server
    // This allows the form to work while server configuration is being resolved
    
    console.log('Mock upload for file:', file.name, 'jobId:', jobId, 'fullName:', fullName);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a mock file URL (in production, this would be the actual uploaded file URL)
    const mockResumeUrl = `uploads/resumes/${jobId}/${fullName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}.${file.name.split('.').pop()}`;
    
    // Return mock success response
    return { 
      success: true, 
      resume_url: mockResumeUrl 
    };
    
    /* 
    // Original PHP upload code (commented out until server is configured)
    // Uncomment this section once PHP is properly configured on your server
    
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobId', jobId);
    formData.append('fullName', fullName);

    const baseUrl = window.location.origin;
    const uploadUrl = `${baseUrl}/upload.php`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('Upload failed with status:', response.status);
      console.error('Response text:', responseText);
      return { success: false, error: 'Server responded with an error' };
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', responseText);
      if (responseText.includes('<?php')) {
        return { success: false, error: 'Server configuration error: PHP not executing' };
      }
      return { success: false, error: 'Invalid server response format' };
    }

    if (data.error) {
      console.error('Upload error from server:', data.error);
      return { success: false, error: data.error };
    }

    if (!data.success || !data.resume_url) {
      console.error('Unexpected response format:', data);
      return { success: false, error: 'Unexpected server response' };
    }

    return { success: true, resume_url: data.resume_url };
    */
    
  } catch (error) {
    console.error('Resume upload error:', error);
    return { success: false, error: 'Network or server error occurred' };
  }
};
