
/**
 * Helper function to upload resume files to the server
 */
export const uploadResume = async (
  file: File,
  jobId: string,
  fullName: string
): Promise<{ success: boolean; resume_url?: string; error?: string }> => {
  try {
    // Create form data for the file upload
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobId', jobId);
    formData.append('fullName', fullName);

    // Get the base URL (for both development and production)
    const baseUrl = window.location.origin;
    const uploadUrl = `${baseUrl}/upload.php`;

    // Make request to PHP upload handler
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    // Get response text first
    const responseText = await response.text();
    
    // Check if response is OK
    if (!response.ok) {
      console.error('Upload failed with status:', response.status);
      console.error('Response text:', responseText);
      return { success: false, error: 'Server responded with an error' };
    }

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', responseText);
      // If the response is HTML (PHP source code), it means the PHP file is not being executed
      if (responseText.includes('<?php')) {
        return { success: false, error: 'Server configuration error: PHP not executing' };
      }
      return { success: false, error: 'Invalid server response format' };
    }

    // Check for errors from server
    if (data.error) {
      console.error('Upload error from server:', data.error);
      return { success: false, error: data.error };
    }

    // Check if we got the expected success response
    if (!data.success || !data.resume_url) {
      console.error('Unexpected response format:', data);
      return { success: false, error: 'Unexpected server response' };
    }

    // Return success with the file URL
    return { success: true, resume_url: data.resume_url };
  } catch (error) {
    console.error('Resume upload error:', error);
    return { success: false, error: 'Network or server error occurred' };
  }
};
