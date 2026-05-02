Bank Transaction System (Backend)<br>
🚀 **Live API Demo:** [https://bank-transaction-system-production.up.railway.app](https://bank-transaction-system-production.up.railway.app)<br>
Status: ✅ Online & Functional<br>

A high-performance Node.js backend designed to manage real-time financial transactions, ledger records, and automated balance tracking.

🚀 Key Features

Ledger Logic: Developed a robust system to track every credit and debit transaction with high precision.


Balance Management: Implemented automated logic to update and maintain user balances after each successful transaction.


Scalable Architecture: Followed industry-standard practices by separating app configuration (app.js) from the server entry point (server.js).


Database Integrity: Utilized MongoDB Atlas with Mongoose schemas to ensure data persistence and structured logging.



🛠️ Tech Stack

Runtime: Node.js 


Framework: Express.js 


Database: MongoDB (Mongoose ODM) 

Deployment: Railway.app

Tools: Postman (API Testing), Nodemon, Git

## 📂 Project Structure

```text
├── src/
│   ├── config/         # Database connection (db.js)
│   ├── controllers/    # Account, Auth, and Transaction logic
│   ├── middleware/     # Authentication middleware (auth.middleware.js)
│   ├── models/         # Mongoose schemas (Account, blacklist, Ledger, Transaction, User)
│   ├── routes/         # API endpoints (Account, Auth, Transaction)
│   ├── services/       # External services (email.service.js)
│   └── app.js          # Main app configuration
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── package.json        # Dependencies and scripts
├── README.md           # Project documentation
└── server.js           # Server entry point

🚀 Updated Features
Service-Oriented Architecture: Used a services layer (e.g., email.service.js) to separate external business logic from controllers.

Comprehensive Financial Models: Designed specific schemas for Account, Ledger, and Transaction to ensure detailed financial tracking.

Secure Authentication: Integrated dedicated auth.middleware.js to protect sensitive banking routes.

Modular Routing: Organized endpoints into clean, resource-specific files like account.routes.js and transaction.routes.js.

Production Ready: Includes .env configuration and a clean .gitignore for secure and professional deployment.

Deployment: API live hai aur Railway platform par successfully deploy ki gayi hai.

⚙️ Installation & Setup
1. Clone the repository:

Bash
git clone https://github.com/uzair-133/Bank-Transaction-System.git

2. Install dependencies:
 
Bash
npm install

3. Environment Variables: Create a .env file and add your MONGO_URl,JWT_SECRET,CLIENT_ID,CLIENT_SECRET,REFRESH_TOKEN and also EMAIL_USER.

4. Run the application:

Bash
npm start