# Scheduling System

## Introduction

This web-based scheduling system provides a comprehensive platform for both administrators and users to efficiently manage schedules. The system is designed with a default configuration of three shifts per day, accommodating one user per shift, with a total capacity for six users and one administrator.

## Key Features

### For Administrators

- **Schedule Management**: 
  - View schedules in list or calendar mode
  - Edit and delete schedules directly from the list interface
  - Create, edit and delete schedules directly from the calendar interface
  - Manage new shifts and review user leave requests
  - Review and approve shift exchange requests

- **User Management**:
  - Modify user access rights
  - Grant administrative privileges to users

### For Users

- **Personal Schedule Management**:
  - View personal schedules
  - Submit leave requests
  - Track leave request status
  - Submit shift exchange requests

- **Profile Customization**:
  - Upload and manage personal avatar

- **Notification System**:
  - Access a dashboard for the latest updates
  - Receive notifications for schedule changes, leave request status updates and shift exchange request updates

## System Configuration

- Default setup: 3 shifts per day
- Capacity: 6 users + 1 administrator
- 1 user assigned per shift

## Technical Highlights

- Dual view modes for schedules (list and calendar)
- Intuitive date-based schedule management in calendar mode
- Comprehensive CRUD operations for schedule management
- Integrated leave request system
- User-specific notification system
- Flexible user role management
- Shift exchange request and approval system
- Redis caching for getProfile functionality, optimizing performance for frequent profile access

---

## Environment Setup
This project requires the following software to be installed:
- Node.js v18.15.0
- MySQL v8
- Redis v7.2.5

## How to Use
1. Clone the repository:
   ```shell
   git clone https://github.com/maomao0007/scheduling-system.git
   ```

2. Navigate to the project directory:
   ```shell
   cd scheduling-system
   ```
3. Set environment variables: 
   
   Setup steps:
   - Duplicate the env.example file in the project root directory.
   - Rename the duplicated file to .env.
   - Open the .env file and replace the placeholder values with your actual configuration.

   Ensure your .env file contains the following variables:
   ```shell
   DATABASE_URL=mysql://root:your_secure_password@localhost:3306/scheduling_system
   SESSION_SECRET=your_session_secret
   ```
4. Setup:
  
      - Install dependencies:
        ```shell
        npm install
        ```
      - Create database:
        ```shell
        CREATE DATABASE scheduling_system;
        ```
      - Create tables:
        ```shell
        npx sequelize db:migrate
        ```
      - Set seed data:
        ```shell
        npx sequelize-cli db:seed:all
        ```
      - Start the application:
        ```shell
        npm run dev
        ```

5. The server should now be running at `http://localhost:3000`.

6. To stop the server:
   - For local setup: Use `Ctrl + C` in the terminal.
     
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
   - user6@example.com (Password: 123)

## Development Tools
- "@fullcalendar/interaction": "^6.1.15"
- "bcryptjs": "^2.4.3"
- "connect-flash": "^0.1.1"
- "date-fns": "^3.6.0"
- "dayjs": "^1.11.12"
- "dotenv": "^16.4.5"
- "eslint": "^9.7.0"
- "express": "^4.19.2"
- "express-handlebars": "^7.1.3"
- "express-session": "^1.18.0"
- "faker": "^6.6.6"
- "fullcalendar": "^6.1.15"
- "handlebars-helper": "^0.0.12"
- "jsonwebtoken": "^9.0.2"
- "method-override": "^3.0.0"
- "multer": "^1.4.5-lts.1"
- "mysql2": "^3.10.3"
- "nodemon": "^3.1.0"
- "passport": "^0.7.0"
- "passport-jwt": "^4.0.1"
- "passport-local": "^1.0.0"
- "redis": "^4.7.0"
- "sequelize": "^6.37.3"
- "sequelize-cli": "^6.6.2"

## Screenshot
![signin](https://github.com/user-attachments/assets/ce8c06a8-80fb-4752-ad4c-172ce5b73603)
![admin-schedules-calendar](https://github.com/user-attachments/assets/7915cd88-511a-4e4c-9afd-bd61b1bfd9d8)
![feeds](https://github.com/user-attachments/assets/3f968c00-bddf-49d9-b851-8cb423d43668)
![admin-shifts](https://github.com/user-attachments/assets/02d927bd-a00e-4c21-8f17-08f3c7f0c8d8)
![admin-users](https://github.com/user-attachments/assets/36ee27a4-2e9a-4162-b722-1b79f99f3c20)
![applyLeaves](https://github.com/user-attachments/assets/b51a1f4d-0753-4ec5-99a9-2354f302ae8c)
![swap-schedules](https://github.com/user-attachments/assets/9133f7cf-7be9-41f5-b58b-0f56a1a40733)



