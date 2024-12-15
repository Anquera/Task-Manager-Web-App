-- Create the database
CREATE DATABASE FeedbackDB;

-- Use the database
USE FeedbackDB;

-- Create a table to store feedback information
CREATE TABLE Feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each feedback
    name VARCHAR(100) NOT NULL,                  -- Name of the reviewer
    email VARCHAR(100) NOT NULL,                 -- Email of the reviewer
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),  -- Rating from 1 to 5
    review TEXT NOT NULL,                        -- The review text
    date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp of when the feedback was submitted
);
