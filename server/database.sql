CREATE DATABASE final_year_project;

--get extension
CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
    );

--inserting a fake user to test
INSERT INTO users(user_name, user_email, user_password)
VALUES('Cian', 'cian@gmail.com', 'password');