# Employee Story Platform

A full-stack web application designed to empower employees to document their unique journeys, share achievements, and highlight their learnings. The platform makes these experiences part of the organization's shared knowledge base while enforcing a secure, role-based review workflow.

---

## 🎯 Goal of the Application
The primary goal of the Employee Story Platform is to foster a culture of knowledge sharing and recognition. 
It provides a structured environment where employees can:
- **Reflect** on their career journey and personal side.
- **Share** accomplishments, challenges, and insights about the organization's culture.
- **Discover** the experiences of their peers.

All stories go through a formal HR review process before being published to ensure content quality and alignment with company values.

---

## 🛠️ Implementation Details

### Tech Stack
**Frontend:**
- **Framework:** React 18 (built with Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Custom CSS variables for theme consistency
- **Routing:** React Router v6
- **Authentication:** `@azure/msal-react` (Microsoft Single Sign-On)

**Backend:**
- **Framework:** FastAPI (Python 3)
- **Database ORM:** SQLAlchemy (Async)
- **Database:** PostgreSQL
- **Security:** JWT Validation (PyJWKClient matching Azure AD tokens)

### Architecture
The platform follows a decoupled client-server architecture:
- The **Frontend** acts as a stateless Single Page Application (SPA).
- The **Backend** exposes RESTful APIs, securing them via HTTP Bearer tokens (JWT).
- **Authentication** is handled by Microsoft Entra ID (Azure AD), ensuring enterprise-grade security without storing passwords in the local database.

---

## 🚀 What We Have Built So Far

### 1. Robust Authentication & Dev Mode
- **Azure AD SSO Integration:** Secure login utilizing Microsoft's identity platform.
- **Developer Bypass Mode:** A custom-built local testing environment (`VITE_AUTH_BYPASS=true`) that allows developers to mock login as an Employee, HR, or Admin without needing real Microsoft accounts, instantly generating unique mock database profiles.

### 2. Role-Based Access Control (RBAC)
The application strictly segregates capabilities into three roles:
- **Employee:** Can draft, submit, and edit their own stories.
- **HR:** Can review pending stories and approve or reject them.
- **Admin:** Can manage all user roles and deactivate accounts.

### 3. Comprehensive Story Engine
Employees can build comprehensive stories across 7 structured categories:
1. Career Journey
2. Team & People
3. Achievements
4. Challenges
5. Organization & Culture
6. Personal Side
7. Suggestions

Stories maintain a state machine: `DRAFT` ➔ `PENDING_REVIEW` ➔ (`APPROVED` or `REJECTED`).

### 4. HR Review Workflow
- **Review Queue:** A dedicated dashboard for HR to monitor stories awaiting approval.
- **Feedback Loop:** If a story is rejected, HR is required to leave a feedback comment. The employee can then read the feedback, edit their story, and resubmit.

### 5. Admin User Management
- **Centralized Dashboard:** Admins have access to a "Manage Users" interface.
- **Dynamic Provisioning:** Admins can instantly promote employees to HR/Admin roles via a dropdown menu, or deactivate users from the system entirely.

### 6. Discovery & UI
- **Responsive Design:** A beautifully styled, mobile-responsive UI featuring a persistent sidebar and clean typography.
- **Discovery Portal:** A public "Home" feed where all `APPROVED` stories are visible to the company.

---

## 💻 Getting Started

### Clone the repository

```bash
git clone https://github.com/PavanKotesh03/Employee-stories-platform.git
cd Employee-stories-platform
```

### Local Development (Backend)
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate # On Windows Git Bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Local Development (Frontend)
```bash
cd frontend
npm install
npm run dev
```

*Note: Create a `.env` file in the frontend using `.env.example` as a template. Ensure `VITE_AUTH_BYPASS=true` is set for local testing without an active Azure tenant.*
