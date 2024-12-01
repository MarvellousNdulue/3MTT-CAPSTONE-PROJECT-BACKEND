const request = require("supertest");
const app = require("../app");
const UserModel = require("../models/user"); // Import in-memory user model or DB connection

describe("Auth Routes", () => {
    const testUser = {
        username: "testuser560",
        email: "testuser305@example.com",
        password: "passwor3d15234",
    };

    // Helper function to clean up the database
    const deleteUserIfExists = async () => {
        await UserModel.findOneAndDelete({ email: testUser.email })
    };

    beforeAll(() => {
        // Ensure the test user doesn't exist in the database
        deleteUserIfExists();
    });

    afterAll(() => {
        // Clean up after the test
        deleteUserIfExists();
    });

    it("should register a new user", async () => {
        const res = await request(app).post("/auth/register").send(testUser);

        console.log(res.body);
        expect(res.status).toEqual(201);
        expect(res.body.message).toEqual("User registered successfully");
    });
});
