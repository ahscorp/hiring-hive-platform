
<?php
// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Check if there's a file upload
if (!isset($_FILES['resume']) || $_FILES['resume']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded or upload error']);
    exit;
}

// Get job ID and create directory if it doesn't exist
$jobId = isset($_POST['jobId']) ? $_POST['jobId'] : 'default';
$uploadDir = 'uploads/resumes/' . $jobId . '/';

// Create directory if it doesn't exist
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Sanitize filename and create unique filename
$filename = basename($_FILES['resume']['name']);
$fileExt = pathinfo($filename, PATHINFO_EXTENSION);
$safeFilename = preg_replace('/[^a-zA-Z0-9_-]/', '_', $_POST['fullName']) . '_' . time() . '.' . $fileExt;
$targetPath = $uploadDir . $safeFilename;

// Move the file
if (move_uploaded_file($_FILES['resume']['tmp_name'], $targetPath)) {
    // Success response
    $resumeUrl = $targetPath;
    echo json_encode(['success' => true, 'resume_url' => $resumeUrl]);
} else {
    // Error response
    http_response_code(500);
    echo json_encode(['error' => 'Failed to move uploaded file']);
}
?>
