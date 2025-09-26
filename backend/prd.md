# Product Requirements Document (PRD)
## SkillLink Backend
### 1. Product Overview

**Product Name:** SkillLink Backend
**Version:** 1.0.0
**Product Type:** Backend API for Freelance Marketplace

SkillLink Backend is a RESTful API service designed to support a freelance marketplace platform. The system enables clients to post jobs, freelancers to bid or be directly selected, and secure transactions through an escrow system. The platform also supports messaging, recommendations, and role-based access control.

### 2. Target Users

- **Clients:** Post jobs, review bids, directly choose freelancers, manage contracts, and release payments
- **Freelancers:** Create profiles, showcase skills, search and bid on jobs, accept contracts, and get paid
- **Administrators:** Manage users, handle disputes, monitor escrow transactions, and oversee system integrity

### 3. Core Features
#### 3.1 User Authentication & Authorization

- **User Registration:** Account creation with email verification
- **User Login:** Secure authentication with JWT tokens
- **Password Management:** Change password, forgot/reset password functionality
- **Email Verification:** Account verification via email tokens
- **Token Management:** Access token refresh mechanism
- **Role-Based Access Control:** Client, Freelancer, and Admin roles

#### 3.2 Freelancer & Client Profiles

- **Freelancer Profiles:** Skills, portfolio, hourly rate, work history, ratings
- **Client Profiles:** Company details, project history, ratings by freelancers
- **Profile Editing:** Both roles can update profile information
- **Searchable Profiles:** Clients can search freelancers by skills and ratings

#### 3.3 Job Management

- **Job Creation:** Clients create jobs with title, description, skills, and budget
- **Job Listing:** Freelancers can browse and search jobs
- **Job Details:** Access individual job information
- **Job Updates:** Clients can modify or close jobs
- **Job Deletion:** Clients can remove jobs

#### 3.4 Hiring Flow

- **Bidding System:** Freelancers submit proposals with bid amount and timeline
- **Direct Hire:** Clients directly select freelancers from suggestions or profile search
- **Proposal Management:** Clients review, accept, or reject bids
- **Contract Initiation:** Starts once client hires a freelancer

#### 3.5 Contracts & Escrow

- **Contract Creation:** Define scope, timeline, and milestones
- **Escrow Deposit:** Client deposits funds before work begins
- **Milestone Tracking:** Split contracts into milestones for staged payments
- **Payment Release:** Funds released from escrow upon client approval
- **Dispute Resolution:** Admins intervene in case of disputes

#### 3.6 Messaging & Notifications

- **Real-Time Messaging:** Client–Freelancer chat using WebSockets/Socket.IO
- **Notifications:** Alerts for bids, hires, milestone updates, and payments
- **Read/Unread Tracking:** Manage communication history

#### 3.7 Recommendations

- **Freelancer Suggestions:** Based on client’s job requirements and past hires
- **Job Suggestions:** Based on freelancer’s skills and job search history
- **Algorithm Support:** Matching engine using skills, categories, and ratings

#### 3.8 System Health

- **Health Check:** API endpoint for system monitoring

### 4. Technical Specifications
#### 4.1 API Endpoints Structure

**Authentication Routes** (`/api/v1/auth/`)

- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout (secured)
- `GET /current-user` - Get current user info (secured)
- `POST /change-password` - Change password (secured)
- `POST /refresh-token` - Refresh access token
- `GET /verify-email/:verificationToken` - Verify email
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:resetToken` - Reset password
- `POST /resend-email-verification` - Resend verification email

**Profile Routes** (`/api/v1/profiles/`)

- `GET /freelancers` - List/search freelancers
- `GET /freelancers/:id` - Get freelancer profile
- `PUT /freelancers/:id` - Update freelancer profile (secured)
- `GET /clients/:id` - Get client profile
- `PUT /clients/:id` - Update client profile (secured)

**Job Routes** (`/api/v1/jobs/`)

- `GET /` - List jobs
- `POST /` - Create job (client only)
- `GET /:jobId` - Get job details
- `PUT /:jobId` - Update job (client only)
- `DELETE /:jobId` - Delete job (client only)

**Bid Routes** (`/api/v1/bids/`)

- `POST /:jobId` - Place bid (freelancer only)
- `GET /:jobId` - List bids on a job (client only)
- `PUT /:bidId` - Update bid (freelancer only)
- `DELETE /:bidId` - Delete bid (freelancer only)

**Hiring & Contracts** (`/api/v1/contracts/`)

- `POST /hire/:freelancerId` - Direct hire freelancer
- `POST /:jobId/accept/:bidId` - Accept freelancer bid
- `GET /:contractId` - Get contract details
- `PUT /:contractId` - Update contract terms
- `POST /:contractId/milestones` - Add milestone
- `PUT /:milestoneId/release` - Release payment

**Messaging Routes** (`/api/v1/messages/`)

- `POST /:contractId` - Send message
- `GET /:contractId` - Get messages

**Recommendation Routes** (`/api/v1/recommendations/`)

- `GET /freelancers` - Suggested freelancers for client
- `GET /jobs` - Suggested jobs for freelancer

**Health Check** (`/api/v1/healthcheck/`)

- `GET /` - System status

#### 4.2 Permission Matrix
| Feature	        | Client | Freelancer |	Admin |
| ----------------- | ------ | ---------- | ----- |
| Post Job	        | ✓      | ✗          |✗     |
| Delete Job	    | ✓	     | ✗          |✗     |
| Place Bid	        | ✗	     | ✓	      |✗     |
| Accept/Reject Bid	| ✓	     | ✗	      |✗     |
| Direct Hire	    | ✓	     | ✗	      |✗     |
| Create Contract	| ✓	     | ✗	      |✗     |
| Escrow Deposit	| ✓	     | ✗	      |✗     |
| Release Payment	| ✓	     | ✗	      |✗     |
| Messaging	        | ✓	     | ✓	      |✗     |
| Manage Disputes	| ✗	     | ✗	      |✓     |

#### 4.3 Data Models

**User Roles:**

- `client` - Can post jobs, hire, manage contracts
- `freelancer` - Can bid, accept contracts, receive payments
- `admin` - Can oversee disputes and platform integrity

**Contract Status:**

- `active` - Ongoing work
- `completed` - All milestones paid
- `disputed` - Under admin review

### 5. Security Features

- JWT-based authentication with refresh tokens
- Role-based authorization middleware
- Input validation on all endpoints
- Email verification for account security
- Secure password reset functionality
- File upload security with Multer middleware
- CORS configuration for cross-origin requests

### 6. File Management

- Support for multiple file attachments on tasks
- Files stored in public/images directory
- File metadata tracking (URL, MIME type, size)
- Secure file upload handling

### 7. Success Criteria

- Secure escrow system
- Support both bidding & direct hire flows
- Real-time messaging between clients and freelancers
- Recommendation engine improves matches
- Clear admin control for disputes
- Comprehensive API documentation