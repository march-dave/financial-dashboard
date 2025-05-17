CREATE TABLE IF NOT EXISTS timesheets (
    id SERIAL PRIMARY KEY,
    employee TEXT NOT NULL,
    project TEXT NOT NULL,
    total_hours NUMERIC NOT NULL,
    project_hours NUMERIC NOT NULL,
    sred_hours NUMERIC NOT NULL,
    t4_salary NUMERIC NOT NULL,
    daily_hours NUMERIC NOT NULL,
    weekly_description TEXT,
    employee_description TEXT
);
