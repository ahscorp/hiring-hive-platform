
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

    // Handle potential JSON parsing errors (might get HTML error pages)
    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error('Failed to parse response:', await response.text());
      return { success: false, error: 'Invalid server response' };
    }

    // Check for errors from server
    if (!response.ok || data.error) {
      console.error('Upload error:', data.error || 'Unknown error');
      return { success: false, error: data.error || 'Failed to upload file' };
    }

    // Return success with the file URL
    return { success: true, resume_url: data.resume_url };
  } catch (error) {
    console.error('Resume upload error:', error);
    return { success: false, error: 'Network or server error occurred' };
  }
};
