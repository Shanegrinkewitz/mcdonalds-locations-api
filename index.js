const express = require('express');
const db = require('./db');
const port = process.env.PORT || 3000;

const app = express();

//const appName = 'mcdonalds';

const recordsPerPage = 10;

// Get all locations with pagination
app.get('/locations', async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    if (isNaN(page) || page < 1) {
        page = 1;
    }
    try {
        const offset = (page - 1) * recordsPerPage;
        const rows = await db.query(`SELECT * FROM locations LIMIT ?, ?`, [offset, recordsPerPage]);

        // Parse openHours and driveThroughHours with error handling
        const parsedRows = rows.map(row => {
            let openHours = {
                hoursMonday: 'Unknown',
                hoursTuesday: 'Unknown',
                hoursWednesday: 'Unknown',
                hoursThursday: 'Unknown',
                hoursFriday: 'Unknown',
                hoursSaturday: 'Unknown',
                hoursSunday: 'Unknown'
            };
            let driveThroughHours = {
                driveHoursMonday: 'Unknown',
                driveHoursTuesday: 'Unknown',
                driveHoursWednesday: 'Unknown',
                driveHoursThursday: 'Unknown',
                driveHoursFriday: 'Unknown',
                driveHoursSaturday: 'Unknown',
                driveHoursSunday: 'Unknown'
            };
            
            try {
                if (row.openHours) {
                    openHours = JSON.parse(row.openHours.replace(/'/g, '"'));
                }
            } catch (e) {
                console.error('Error parsing openHours:', e);
            }
            
            try {
                if (row.driveThroughHours) {
                    driveThroughHours = JSON.parse(row.driveThroughHours.replace(/'/g, '"'));
                }
            } catch (e) {
                console.error('Error parsing driveThroughHours:', e);
            }

            return {
                ...row,
                openHours,
                driveThroughHours
            };
        });

        res.json(parsedRows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/locations/bystate', async (req, res) => {
    const state = req.query.state;
    let page = parseInt(req.query.page);
    if (isNaN(page) || page < 1) {
        page = 1;
    }

    // Validate the state parameter
    if (!state || typeof state !== 'string' || state.length !== 2) {
        return res.status(400).json({ error: 'Invalid or missing state parameter' });
    }

    const offset = (page - 1) * recordsPerPage;
    try {
        const rows = await db.query(`SELECT * FROM locations WHERE stateCode = ? LIMIT ?, ?`, [state.toUpperCase(), offset, recordsPerPage]);

        // Parse openHours and driveThroughHours with error handling
        const parsedRows = rows.map(row => {
            let openHours = {
                hoursMonday: 'Unknown',
                hoursTuesday: 'Unknown',
                hoursWednesday: 'Unknown',
                hoursThursday: 'Unknown',
                hoursFriday: 'Unknown',
                hoursSaturday: 'Unknown',
                hoursSunday: 'Unknown'
            };
            let driveThroughHours = {
                driveHoursMonday: 'Unknown',
                driveHoursTuesday: 'Unknown',
                driveHoursWednesday: 'Unknown',
                driveHoursThursday: 'Unknown',
                driveHoursFriday: 'Unknown',
                driveHoursSaturday: 'Unknown',
                driveHoursSunday: 'Unknown'
            };
            
            try {
                if (row.openHours) {
                    openHours = JSON.parse(row.openHours.replace(/'/g, '"'));
                }
            } catch (e) {
                console.error('Error parsing openHours:', e);
            }
            
            try {
                if (row.driveThroughHours) {
                    driveThroughHours = JSON.parse(row.driveThroughHours.replace(/'/g, '"'));
                }
            } catch (e) {
                console.error('Error parsing driveThroughHours:', e);
            }

            return {
                ...row,
                openHours,
                driveThroughHours
            };
        });

        res.json(parsedRows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to get locations by city with pagination
app.get('/locations/bycity', async (req, res) => {
    const city = req.query.city;
    let page = parseInt(req.query.page);
    if (isNaN(page) || page < 1) {
        page = 1;
    }

    // Validate the city parameter
    if (!city || typeof city !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing city parameter' });
    }

    const offset = (page - 1) * recordsPerPage;
    try {
        const rows = await db.query(`SELECT * FROM locations WHERE LOWER(city) = LOWER(?) LIMIT ?, ?`, [city, offset, recordsPerPage]);

        // Parse openHours and driveThroughHours with error handling
        const parsedRows = rows.map(row => {
            let openHours = {
                hoursMonday: 'Unknown',
                hoursTuesday: 'Unknown',
                hoursWednesday: 'Unknown',
                hoursThursday: 'Unknown',
                hoursFriday: 'Unknown',
                hoursSaturday: 'Unknown',
                hoursSunday: 'Unknown'
            };
            let driveThroughHours = {
                driveHoursMonday: 'Unknown',
                driveHoursTuesday: 'Unknown',
                driveHoursWednesday: 'Unknown',
                driveHoursThursday: 'Unknown',
                driveHoursFriday: 'Unknown',
                driveHoursSaturday: 'Unknown',
                driveHoursSunday: 'Unknown'
            };
            
            try {
                if (row.openHours) {
                    openHours = JSON.parse(row.openHours.replace(/'/g, '"'));
                }
            } catch (e) {
                console.error('Error parsing openHours:', e);
            }
            
            try {
                if (row.driveThroughHours) {
                    driveThroughHours = JSON.parse(row.driveThroughHours.replace(/'/g, '"'));
                }
            } catch (e) {
                console.error('Error parsing driveThroughHours:', e);
            }

            return {
                ...row,
                openHours,
                driveThroughHours
            };
        });

        res.json(parsedRows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to get a location by storeId
app.get('/location/:storeId', async (req, res) => {
    const storeId = req.params.storeId;
    try {
        const rows = await db.query(`SELECT * FROM locations WHERE storeId = ?`, [storeId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: `Location not found. The location with storeId=${storeId} does not exist.` });
        }

        const row = rows[0];
        
        let openHours = {
            hoursMonday: 'Unknown',
            hoursTuesday: 'Unknown',
            hoursWednesday: 'Unknown',
            hoursThursday: 'Unknown',
            hoursFriday: 'Unknown',
            hoursSaturday: 'Unknown',
            hoursSunday: 'Unknown'
        };
        let driveThroughHours = {
            driveHoursMonday: 'Unknown',
            driveHoursTuesday: 'Unknown',
            driveHoursWednesday: 'Unknown',
            driveHoursThursday: 'Unknown',
            driveHoursFriday: 'Unknown',
            driveHoursSaturday: 'Unknown',
            driveHoursSunday: 'Unknown'
        };

        try {
            if (row.openHours) {
                openHours = JSON.parse(row.openHours.replace(/'/g, '"'));
            }
        } catch (e) {
            console.error('Error parsing openHours:', e);
        }

        try {
            if (row.driveThroughHours) {
                driveThroughHours = JSON.parse(row.driveThroughHours.replace(/'/g, '"'));
            }
        } catch (e) {
            console.error('Error parsing driveThroughHours:', e);
        }

        res.json({
            ...row,
            openHours,
            driveThroughHours
        });
    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to get unique state codes
app.get('/states', async (req, res) => {
    try {
        const rows = await db.query(`SELECT DISTINCT stateCode FROM locations ORDER BY stateCode`);

        const states = rows.map(row => row.stateCode);

        res.json(states);
    } catch (error) {
        console.error('Error fetching states:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to get unique city names
app.get('/cities', async (req, res) => {
    try {
        const rows = await db.query(`SELECT DISTINCT city FROM locations ORDER BY city`);

        const cities = rows.map(row => row.city);

        res.json(cities);
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const server = app.listen(port, () => {
    console.log(`API started on port ${port}`);
});

// Close the database connection when the application exits
const gracefulShutdown = () => {
    console.log('Closing database connection');
    db.close();
    console.log('Closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
