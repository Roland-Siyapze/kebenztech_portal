const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function createAdmin() {
  try {
    // Replace these values with the actual Clerk user ID and details
    const ADMIN_CLERK_USER_ID = "user_32h3VHRj5bIm8vxJlD4jmRrijYG"; // Get this from Clerk Dashboard
    const ADMIN_EMAIL = "rolanddave046@gmail.com";
    const ADMIN_FIRST_NAME = "Roland";
    const ADMIN_LAST_NAME = "Dave";
    const ADMIN_IMAGE_URL = ""; // Optional

    // Check if admin already exists
    const existingAdmin = await database.user.findUnique({
      where: { userId: ADMIN_CLERK_USER_ID },
    });

    if (existingAdmin) {
      // Update existing user to admin
      const updatedUser = await database.user.update({
        where: { userId: ADMIN_CLERK_USER_ID },
        data: { role: "ADMIN" },
      });
      console.log("User updated to admin:", updatedUser);
    } else {
      // Create new admin user
      const newAdmin = await database.user.create({
        data: {
          userId: ADMIN_CLERK_USER_ID,
          email: ADMIN_EMAIL,
          firstName: ADMIN_FIRST_NAME,
          lastName: ADMIN_LAST_NAME,
          imageUrl: ADMIN_IMAGE_URL,
          role: "ADMIN",
        },
      });
      console.log("Admin user created:", newAdmin);
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await database.$disconnect();
  }
}

createAdmin();