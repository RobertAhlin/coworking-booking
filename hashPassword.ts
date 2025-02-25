import bcrypt from "bcrypt";

async function hashPasswords() {
  const hashedAdminPassword = await bcrypt.hash("adminpassword", 10);
  const hashedUserPassword = await bcrypt.hash("userpassword", 10);

  console.log("Admin Password Hash:", hashedAdminPassword);
  console.log("User Password Hash:", hashedUserPassword);
}

hashPasswords();
