# Admin Dashboard

## Overview

The Admin Dashboard provides administrators with a comprehensive view of all student wellness alerts and notifications across the system. This centralized monitoring interface allows administrators to track, acknowledge, and resolve student wellness concerns efficiently.

## Features

### 1. **Real-time Statistics**

- **Total Alerts**: Overall count of all alerts in the system
- **Open Alerts**: Alerts that haven't been acknowledged yet
- **Acknowledged**: Alerts that have been reviewed but not resolved
- **Resolved**: Alerts that have been fully addressed
- **Critical Severity**: Count of critical-level alerts
- **High Severity**: Count of high-level alerts

### 2. **Alert Filtering**

- Filter by **Status**: ALL, OPEN, ACK (Acknowledged), RESOLVED
- Filter by **Severity**: ALL, CRITICAL, HIGH, MEDIUM, LOW
- Real-time count of filtered results

### 3. **Alert Management**

Each alert displays:

- **Student Information**: Name, Student ID, Email
- **Alert Details**: Alert ID, Risk Score, Severity Level
- **Trigger Condition**: The specific condition that triggered the alert
- **Timestamps**: When triggered, acknowledged, and resolved
- **Status Badge**: Visual indicator of current alert status
- **Action Buttons**:
  - **Acknowledge**: Mark alert as reviewed (for OPEN alerts)
  - **Resolve**: Mark alert as resolved (for ACK alerts)

### 4. **Color-Coded Severity**

- **CRITICAL** (Red): Risk score ≥ 0.9
- **HIGH** (Orange): Risk score ≥ 0.75
- **MEDIUM** (Yellow): Risk score ≥ 0.5
- **LOW** (Green): Risk score < 0.5

## How to Access

### For Administrators:

1. **Create Admin Account** (First Time):

   - Navigate to `http://localhost:3001/admin/signup`
   - Enter your name, email, and password
   - Click "Create Admin Account"

2. **Login**:

   - Navigate to `http://localhost:3001/admin/login`
   - Enter your admin email and password
   - You'll be redirected to the admin dashboard

3. **Alternative Access**:
   - From the main student login page (`http://localhost:3001`), click "Admin Login" button in the top-right corner

## Using the Dashboard

### Viewing Alerts

1. **Dashboard Overview**: Upon login, you'll see statistics cards showing alert counts
2. **Alert List**: Scroll down to see the full list of student alerts
3. **Filtering**: Use the filter dropdowns to narrow down alerts by status or severity

### Managing Alerts

#### Acknowledge an Alert (Status: OPEN → ACK)

1. Find an alert with status "OPEN"
2. Click the yellow "Acknowledge" button
3. The alert status will update to "ACK" and show when it was acknowledged

#### Resolve an Alert (Status: ACK → RESOLVED)

1. Find an alert with status "ACK"
2. Click the green "Resolve" button
3. The alert status will update to "RESOLVED" and show when it was resolved

### Refreshing Data

- Click the 🔄 **Refresh** button in the top-right to reload the latest alerts
- The dashboard automatically fetches data when you first load the page

## Alert Workflow

```
OPEN (New Alert)
  ↓
  [Admin Clicks "Acknowledge"]
  ↓
ACK (Acknowledged)
  ↓
  [Admin Clicks "Resolve"]
  ↓
RESOLVED (Completed)
```

## API Endpoints Used

The admin dashboard communicates with the following backend endpoints:

- **GET** `/api/alerts` - Fetch all alerts
- **GET** `/api/students` - Fetch all student information
- **PATCH** `/api/alerts/{alert_id}` - Update alert status

## Technical Details

### Alert Severity Calculation

Alerts are generated based on a risk score calculated from:

- **Stress Level** (40% weight): Normalized 0-1 from reported stress (0-10)
- **Sleep Hours** (35% weight): Normalized based on deviation from 8 hours
- **Mood** (25% weight): Sad=1.0, Neutral=0.5, Happy=0.0

**Risk Score Formula:**

```
risk_score = 0.4 × stress_norm + 0.35 × sleep_norm + 0.25 × mood_norm
```

### Trigger Conditions

Alerts are triggered when any of these conditions are met:

1. Risk score ≥ 0.75
2. Stress level ≥ 8 AND sleep hours < 5
3. Mood = "sad" AND sleep hours < 6

## Troubleshooting

### No Alerts Showing

- **Check Backend Connection**: Ensure the FastAPI backend is running on port 8001
- **Verify Student Reports**: Students need to submit self-reports that meet trigger conditions
- **Check Filters**: Make sure filters aren't hiding alerts (set both to "ALL")

### Cannot Update Alert Status

- **Backend Error**: Check the backend terminal for error messages
- **Network Issue**: Verify the backend is accessible at `http://localhost:8001`
- **Refresh Page**: Try refreshing the browser and attempting again

### Student Names Not Showing

- **Database Issue**: Ensure students exist in the database
- **API Error**: Check browser console (F12) for API errors
- **Backend Endpoint**: Verify `/api/students` endpoint is working

## Future Enhancements

Potential features for future versions:

- Email/SMS notifications for critical alerts
- Student communication interface
- Alert history and analytics
- Export alerts to CSV/PDF
- Search functionality for specific students
- Bulk alert operations
- Real-time WebSocket updates
- Student wellness trends and insights
- Integration with counseling services

## Security Notes

⚠️ **Important**: This is a development version. For production:

- Implement proper admin authentication with role-based access control (RBAC)
- Add session management and token validation
- Implement HTTPS/SSL encryption
- Add audit logging for all admin actions
- Implement rate limiting and CSRF protection
- Add two-factor authentication (2FA) for admin accounts
