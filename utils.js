import bcrypt from "bcrypt";

// Function to hash a plain text password
// The function returns the hashed password, which can be stored securely in a database
export async function hashPassword(plainTextPassword) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainTextPassword, salt);
}
