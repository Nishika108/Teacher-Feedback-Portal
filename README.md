# Teacher Feedback & Rating System

A comprehensive web-based platform that allows students to rate teachers and provide feedback. Teachers can view their ratings and suggestions through an insightful dashboard, helping them identify strengths and areas for improvement. Administrators can manage the entire system, including adding teachers and monitoring overall performance.

## 🚀 Features

### 👨‍🎓 Student Features
- **User Registration & Authentication**: Secure login/register system
- **Teacher Directory**: Browse and search for teachers
- **Feedback Submission**: Rate teachers (1-5 stars) and provide written feedback
- **Feedback History**: View previously submitted feedback
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 👨‍🏫 Teacher Features
- **Teacher Dashboard**: Comprehensive overview of performance metrics
- **Feedback Viewing**: See all student feedback and ratings
- **Performance Analytics**: View rating distribution and trends
- **Profile Management**: Update personal information and courses taught
- **Real-time Statistics**: Track total feedback, average ratings, and recent activity

### 👨‍💼 Admin Features
- **Admin Dashboard**: System-wide statistics and overview
- **Teacher Management**: Add new teachers to the system
- **Teacher Directory**: View and manage all teachers
- **Feedback Monitoring**: Monitor all feedback across the platform
- **User Management**: Manage all system users (students, teachers, admins)
- **Analytics & Reports**: Generate detailed performance reports

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Axios**: HTTP client for API calls

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing

## 📁 Project Structure

```
├── client/                 # Next.js Frontend
│   ├── app/               # App Router pages
│   │   ├── Admin/         # Admin dashboard and management
│   │   ├── Teacher/       # Teacher dashboard and features
│   │   ├── Student/       # Student feedback system
│   │   ├── Login/         # Authentication pages
│   │   └── Register/      # User registration
│   ├── components/        # Reusable React components
│   └── Store/            # State management (Auth context)
│
├── server/                # Node.js Backend
│   ├── controllers/       # Route handlers
│   ├── models/           # Database models
│   ├── middlewares/      # Custom middleware
│   ├── router/           # API routes
│   ├── utils/            # Utility functions
│   └── validators/       # Input validation
│
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Teacher-Feedback-System
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/teacher-feedback-system
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5001
   ```

4. **Start the application**
   
   **Terminal 1 - Start the server:**
   ```bash
   cd server
   npm start
   ```
   
   **Terminal 2 - Start the client:**
   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## 🔐 User Roles & Permissions

### Student
- Register and login
- Browse teacher directory
- Submit feedback and ratings
- View feedback history
- Access: `/Student/*`

### Teacher
- Login with teacher credentials
- View personal dashboard
- See all received feedback
- Update profile information
- Access: `/Teacher/*`

### Admin
- Full system access
- Add/manage teachers
- Monitor all feedback
- Manage users
- Generate reports
- Access: `/Admin/*`

## 📊 Database Models

### User Model
```javascript
{
  userName: String (unique),
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  role: String (enum: ["admin", "teacher", "student"])
}
```

### Teacher Model
```javascript
{
  fullName: String,
  email: String (unique),
  phone: String,
  courses: String,
  department: String,
  employeeId: String (unique),
  role: String (enum: ["Teacher", "HOD", "Admin"]),
  joiningDate: Date,
  isActive: Boolean
}
```

### Feedback Model
```javascript
{
  studentId: ObjectId (ref: User),
  teacherId: ObjectId (ref: Teacher),
  rating: Number (1-5),
  comments: String,
  createdAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user

### Teacher Management
- `GET /api/teacher/all` - Get all teachers
- `POST /api/teacher/add` - Add new teacher
- `GET /api/teacher/:id` - Get teacher by ID

### Feedback System
- `POST /api/feedback/submit` - Submit feedback
- `GET /api/feedback/student/:studentId` - Get student's feedback
- `GET /api/feedback/teacher/:teacherId` - Get teacher's feedback

### Admin Dashboard
- `GET /api/admin-dashboard/stats` - Get dashboard statistics
- `GET /api/admin-dashboard/users` - Get all users
- `GET /api/admin-dashboard/feedbacks` - Get all feedback
- `POST /api/admin-dashboard/users` - Create user
- `PUT /api/admin-dashboard/users/:id` - Update user
- `DELETE /api/admin-dashboard/users/:id` - Delete user

### Teacher Dashboard
- `GET /api/teacher-dashboard/stats` - Get teacher statistics
- `GET /api/teacher-dashboard/feedbacks` - Get teacher's feedback
- `GET /api/teacher-dashboard/profile` - Get teacher profile
- `PUT /api/teacher-dashboard/profile` - Update teacher profile

## 🎨 UI Components

### Navigation
- Responsive navbar with role-based menu items
- Mobile-friendly dropdown menu
- Active page highlighting

### Dashboards
- **Admin Dashboard**: System overview with statistics cards
- **Teacher Dashboard**: Performance metrics and feedback overview
- **Student Dashboard**: Feedback submission interface

### Forms
- User registration and login forms
- Teacher addition form (admin)
- Feedback submission form (student)
- Profile update forms

### Data Tables
- Teacher directory with search and filtering
- Feedback lists with pagination
- User management tables

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Role-based Access Control**: Route protection based on user roles
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `npm run build`
2. Deploy to Vercel or Netlify
3. Set environment variables for API URL

### Backend (Heroku/Railway/DigitalOcean)
1. Set up MongoDB Atlas or use cloud MongoDB
2. Deploy server to cloud platform
3. Configure environment variables
4. Update frontend API URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Nishika** - Initial work and system design

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB team for the robust database solution
- All open-source contributors whose packages made this project possible

## 📞 Support

For support, email support@teacherfeedback.com or create an issue in the repository.

---

**Happy Teaching and Learning! 🎓**
