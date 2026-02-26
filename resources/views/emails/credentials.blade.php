<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Email Verified - Your Account Credentials</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        h1 {
            color: #2c3e50;
        }
        .credentials {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 3px;
            margin: 20px 0;
        }
        .user-id {
            font-weight: bold;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Email Verified Successfully! ✓</h1>
        
        <p>Thank you for verifying your email address.</p>
        
        <h2>Your Account Credentials</h2>
        
        <div class="credentials">
            <p><strong>User ID:</strong> <span class="user-id">{{ $userId }}</span></p>
        </div>
        
        <p>You can now log in to your account using your User ID.</p>
        
        <p>If you did not verify this email, please contact support immediately.</p>
        
        <p>
            Best regards,<br>
            {{ config('app.name') }}
        </p>
    </div>
</body>
</html>
