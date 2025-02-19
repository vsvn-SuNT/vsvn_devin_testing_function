import { User } from "@prisma/client";
import profileViewer from "./profileViewer";

// Mock user data
const mockUser: User & { followedBy: User[] } = {
  username: "test-user",
  bio: "test bio",
  email: "test@example.com",
  image: "test.jpg",
  password: "password",
  followedBy: []
};

describe("Profile Viewer", () => {
  test("should return profile without following when no current user", () => {
    const result = profileViewer(mockUser);
    expect(result).toEqual({
      username: mockUser.username,
      bio: mockUser.bio,
      image: mockUser.image,
      following: false,
    });
  });

  test("should return profile with following=false when current user does not follow", () => {
    const currentUser = {
      ...mockUser,
      username: "current-user",
    };
    const user = {
      ...mockUser,
      followedBy: [],
    };
    const result = profileViewer(user, currentUser);
    expect(result).toEqual({
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: false,
    });
  });

  test("should return profile with following=true when current user follows", () => {
    const currentUser = {
      ...mockUser,
      username: "current-user",
    };
    const user = {
      ...mockUser,
      followedBy: [currentUser],
    };
    const result = profileViewer(user, currentUser);
    expect(result).toEqual({
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: true,
    });
  });

  test("should handle null bio and image", () => {
    const user = {
      ...mockUser,
      bio: null,
      image: null,
    };
    const result = profileViewer(user);
    expect(result).toEqual({
      username: user.username,
      bio: null,
      image: null,
      following: false,
    });
  });

  test("should handle multiple followers", () => {
    const currentUser = { ...mockUser, username: "current-user" };
    const otherUser = { ...mockUser, username: "other-user" };
    const user = {
      ...mockUser,
      followedBy: [otherUser, currentUser],
    };
    const result = profileViewer(user, currentUser);
    expect(result.following).toBe(true);
  });
});
