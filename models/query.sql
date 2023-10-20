CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    );

CREATE TABLE
    reflection (
        id SERIAL PRIMARY KEY,
        success TEXT NOT NULL,
        low_point TEXT NOT NULL,
        take_away TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        user_id INT REFERENCES users(id)
    );