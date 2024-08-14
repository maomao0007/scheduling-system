# Scheduling System

## Introduction

This web-based scheduling system provides a comprehensive platform for both administrators and users to efficiently manage schedules. The system is designed with a default configuration of three shifts per day, accommodating one user per shift, with a total capacity for five users and one administrator.

## Key Features

### For Administrators

- **Schedule Management**: 
  - View schedules in list or calendar mode
  - Edit and delete schedules directly from the list interface
  - Create, edit, and delete schedules directly from the calendar interface
  - Manage new shifts and review user leave requests

- **User Management**:
  - Modify user access rights
  - Grant administrative privileges to users

### For Users

- **Personal Schedule Management**:
  - View personal schedules
  - Submit leave requests
  - Track leave request status

- **Profile Customization**:
  - Upload and manage personal avatar

- **Notification System**:
  - Access a dashboard for the latest updates
  - Receive notifications for schedule changes and leave request status updates

## System Configuration

- Default setup: 3 shifts per day
- Capacity: 5 users + 1 administrator
- 1 user assigned per shift

## Technical Highlights

- Dual view modes for schedules (list and calendar)
- Intuitive date-based schedule management in calendar mode
- Comprehensive CRUD operations for schedule management
- Integrated leave request system
- User-specific notification system
- Flexible user role management

---

## Environment Setup
This project requires the following software to be installed:
- Node.js v18.15.0
- MySQL v8

## How to Use
1. Clone the repository:
   ```shell
   git clone https://github.com/maomao0007/scheduling-system.git
   ```

2. Navigate to the project directory:
   ```shell
   cd scheduling-system
   ```

3. Install dependencies:
   ```shell
   npm install
   ```

4. Set up the MySQL database to match the configuration in `config/config.json`.

5. Create database:
   ```shell
   CREATE DATABASE scheduling_system;
   ```

6. Create tables:
   ```shell
   npx sequelize db:migrate
   ```

7. Set seed data:
   ```shell
   npx sequelize-cli db:seed:all
   ```

8. Set environment variables (Skip this step for Mac/Linux):
   ```shell
   export NODE_ENV=development
   ```

9. Start the application:
   ```shell
   npm run dev
   ```

10. The server should now be running at `http://localhost:3000`.

11. To stop the server, use `Ctrl + C`.

## Login Credentials

1. Admin Account:
   - Username: root@example.com
   - Password: 123

2. User Accounts:
   - user1@example.com (Password: 123)
   - user2@example.com (Password: 123)
   - user3@example.com (Password: 123)
   - user4@example.com (Password: 123)
   - user5@example.com (Password: 123)

## Development Tools

"@fullcalendar/interaction": "^6.1.15",
"bcryptjs": "^2.4.3",
"connect-flash": "^0.1.1",
"date-fns": "^3.6.0",
"dayjs": "^1.11.12",
"dotenv": "^16.4.5",
"eslint": "^9.7.0",
"express": "^4.19.2",
"express-handlebars": "^7.1.3",
"express-session": "^1.18.0",
"faker": "^6.6.6",
"fullcalendar": "^6.1.15",
"handlebars-helper": "^0.0.12",
"jsonwebtoken": "^9.0.2",
"method-override": "^3.0.0",
"multer": "^1.4.5-lts.1",
"mysql2": "^3.10.3",
"nodemon": "^3.1.0",
"passport": "^0.7.0",
"passport-jwt": "^4.0.1",
"passport-local": "^1.0.0",
"sequelize": "^6.37.3",
"sequelize-cli": "^6.6.2"

## Screenshot
