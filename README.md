# UI-Health
A comprehensive healthcare management system built with Flask, MySQL, and React, designed to streamline hospital operations including nurse management, vaccine tracking, and patient care.

# Tech Stack
- Frontend: React.js
- Backend: Flask (Python)
- Database: MySQL
- Authentication: JWT (JSON Web Tokens)

# Features
- User Authentication and Authorization
- Nurse Management System
  - Registration and Profile Management
  - Nurse Information Tracking
- Vaccine Management
  - Inventory Tracking
  - Dose Management
  - Availability Status
- Patient Records System
  - Patient Demographics
  - Medical History
  - Contact Information
    
# Results
- Login Page : A clean login interface for UI Health system with username and password fields and signup option.

  ![316349033-968bb7d1-50b3-48a0-8b50-bd3473564512](https://github.com/user-attachments/assets/691e2bdb-ccfa-4396-96c1-aa692d39a260)

- Admin Dashboard : A centralized admin control panel with options to manage nurses, vaccines, and patient information.

  ![316349035-f5dd83b4-829d-4f13-90bf-62aef8e419a4](https://github.com/user-attachments/assets/b918e41b-c89f-4f51-9ec8-0c53574ed361)

- Register Nurse : A comprehensive nurse registration form collecting personal and professional details.

  ![316349036-0a81b34d-1ab9-48cc-9888-271c1aa3c9f8](https://github.com/user-attachments/assets/b8783269-7594-4d36-80ca-3db8ea012f1b)

- Nurse List View : A tabulated display of registered nurses with their details and options to update or delete records.

  ![316349045-a9c0d239-dc38-4b15-99a2-a7a8e0e74648](https://github.com/user-attachments/assets/37c84c3e-e191-44f5-b6a5-94620dcf240f)

- Add Vaccine Form :  A form to input new vaccine information including name, company, doses, and availability.

  ![316349047-c8d8c16c-9a15-4464-9119-850c96bb619a](https://github.com/user-attachments/assets/a548a2f1-874e-4531-ac62-08dbe0a206a1)

- Vaccine List : A detailed table showing vaccine inventory with information about doses, availability, and update options.

  ![316349054-dc430721-7bf2-4cc6-be91-5170d912f08d](https://github.com/user-attachments/assets/6146feaa-0c3e-4953-bb8b-b352b756cb72)

- Patient List : A comprehensive patient database displaying personal information, medical history, and demographic details.

  ![316349060-e97df98a-be3f-4b0e-8efb-779b27d3f5d7](https://github.com/user-attachments/assets/92785355-5327-4626-ac5b-5473346660b9)

 
## **Getting Started**

This guide will help you set up and run the **UI-Health** project on your local machine.

---

## **Prerequisites**

Before you begin, ensure you have the following installed:

- **Python 3.8+**
- **Node.js 14+**
- **MySQL 8.0+**

---

## **Installation**

### **1. Clone the Repository**

Clone the repository to your local machine:

```bash
git clone <repository-url>

```

Replace `<repository-url>` with the actual URL of your GitHub repository.

---

### **2. Install Python Dependencies**

Navigate to the project directory and install the required Python packages:

```bash
pip install -r requirements.txt

```

---

### **3. Install React Dependencies**

Move into the `UI-health-Visuals` directory and install the Node.js dependencies:

```bash
cd UI-health-Visuals
npm install

```

---

### **4. Set Up the Database**

Run the following command to set up and migrate the database:

```bash
flask db upgrade

```

---

### **5. Start the Application**

### **Backend (Flask)**

Start the Flask backend server:

```bash
flask run

```

### **Frontend (React)**

In a separate terminal, navigate to the `UI-health-Visuals` directory and start the React frontend:

```bash
cd UI-health-Visuals
npm start

```

## **Running the Application**
- The Flask backend will run at http://127.0.0.1:5000/.
- The React frontend will run at http://localhost:3000/.
---

# Thank You :) 
