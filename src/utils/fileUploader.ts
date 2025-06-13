
/**
 * Helper function to upload resume files to the server using the existing upload.php script
 */
export const uploadResume = async (
  file: File,
  jobId: string,
  fullName: string
): Promise<{ success: boolean; resume_url?: string; error?: string }> => {
  try {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobId', jobId);
    formData.append('fullName', fullName);

    const baseUrl = window.location.origin;
    const uploadUrl = `${baseUrl}/upload.php`;

    console.log('Uploading to:', uploadUrl);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    const responseText = await response.text();
    console.log('Upload response status:', response.status);
    console.log('Upload response text:', responseText);
    
    if (!response.ok) {
      console.error('Upload failed with status:', response.status);
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

    console.log('Upload successful, resume URL:', data.resume_url);
    return { success: true, resume_url: data.resume_url };
    
  } catch (error) {
    console.error('Resume upload error:', error);
    return { success: false, error: 'Network or server error occurred' };
  }
};
