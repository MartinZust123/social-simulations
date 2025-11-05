-- Create interpretable_simulations table for Interpretable mode data
CREATE TABLE interpretable_simulations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    grid_size INT NOT NULL,
    step_time FLOAT NOT NULL,
    timestamp DATETIME DEFAULT GETDATE(),

    -- Results
    total_steps INT NOT NULL,
    unique_cultures INT NOT NULL,
    largest_domain_size INT NOT NULL,
    avg_cultural_distance FLOAT NOT NULL,

    -- Interpretable-specific data stored as JSON
    features NVARCHAR(MAX) NOT NULL,
    correlations NVARCHAR(MAX) NOT NULL,
    template_name VARCHAR(100) NULL
);

-- Add index on timestamp for efficient querying
CREATE INDEX idx_timestamp ON interpretable_simulations(timestamp);

-- Add index on template_name for analytics
CREATE INDEX idx_template_name ON interpretable_simulations(template_name);
