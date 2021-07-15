const request = require("supertest");
const app = require("../endpoints.js");

describe("Get shows", () => {
  it("should return list of shows", async () => {
    const res = await request(app).get("/get-shows");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("shows");
  });
});

describe("Post review", () => {
  it("should edit the given show", async () => {
    const res = await request(app).post("/post-review").send({
      showId: "s19",
      rating: "3",
      description: "My awesome description",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data");
  });

  it("should fail when showId is not provided", async () => {
    const res = await request(app).post("/post-review").send({
      rating: "3",
      description: "My awesome description",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual(
      "Show ID parameter must be provided [showId]"
    );
  });

  it("should fail when rating is not provided", async () => {
    const res = await request(app).post("/post-review").send({
      showId: "s19",
      description: "My awesome description",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual(
      "Rating parameter must be provided [rating]"
    );
  });

  it("should fail when rating is not within the given range", async () => {
    const res = await request(app).post("/post-review").send({
      showId: "s19",
      rating: "12",
      description: "My awesome description",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual(
      "Rating parameter should be a valid number between 0 and 5 [rating]"
    );
  });

  it("should fail when description is not provided", async () => {
    const res = await request(app).post("/post-review").send({
      showId: "s19",
      rating: "3",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual(
      "Description parameter must be a non empty string [description]"
    );
  });

  it("should fail when description is an empty string", async () => {
    const res = await request(app).post("/post-review").send({
      showId: "s19",
      rating: "3",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual(
      "Description parameter must be a non empty string [description]"
    );
  });
});
