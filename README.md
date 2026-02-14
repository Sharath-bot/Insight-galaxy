# Insight Galaxy 🌌
A comprehensive space exploration database management system built with React and Python.

## 🚀 Role-Based Access Control
The system is divided into three distinct portals based on user permissions:

| Role | Access Level | Key Features |
| :--- | :--- | :--- |
| **Admin** | Level 1 | Full CRUD on all tables (Astronauts, Agencies, Missions, etc.) |
| **Researcher** | Level 2 | Read-only scientific telemetry, Registry Density Analytics, and Coordinate Views |
| **Explorer (User)** | Level 3 | Public mission tracking, Star Catalog, and personal Favorites list |

## 🛠️ Project Structure
- **/frontend**: React.js application using Tailwind CSS and Lucide-React
- **/backend**: Python API handling SQL database interactions

## 📥 Installation & Setup
1. **Clone the repository:**
   `git clone <your-repository-url>`

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm start