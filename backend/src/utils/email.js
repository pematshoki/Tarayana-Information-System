const nodemailer = require("nodemailer");

const sendEmail = async (to,role, password) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Your Account Password",
    text: `Your account has been created.

Email: ${to}
Role:${role}
Password: ${password}

Please login and change your password.`
  });

};

// NEW: Project Appointment Email

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


const sendProjectAssignmentEmail = async (to, officerName, projectName) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "New Project Assignment - Tarayana Information System",
    text: `Dear ${officerName},

You have been appointed as the Field Officer for the project: "${projectName}".

Please log in to the system to view the project details and manage the beneficiaries.

Best regards,
Tarayana Admin Team`
  });
};



module.exports = {
  sendEmail,
  sendProjectAssignmentEmail
};