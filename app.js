
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the Express app
const app = express();


app.use(express.urlencoded({ extended: true }));

// Serve static files like CSS and images from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set the port number for the server
const PORT = 3000;

// Array to store guestbook submissions in memory
const guestbookEntries = [];

// Home route which Show the guestbook form
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'views', 'guestbook.html'));
});

// Confirmation page 
app.get('/confirmation', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'views', 'confirmation.html'));
});

// Handle the form submission
app.post('/submit', (req, res) => {
    const entry = {
        firstName: req.body['first-name'],
        lastName: req.body['last-name'],
        jobTitle: req.body['job-title'],
        company: req.body['company'],
        linkedin: req.body['linkedin'],
        email: req.body['email'],
        meet: req.body['meet'],
        other: req.body['other'],
        message: req.body['message'],
        mailingList: req.body['mailing-list'] ? true : false,
        emailFormat: req.body['email-format'],
        timestamp: new Date().toLocaleString()
    };

    guestbookEntries.push(entry);
    console.log("New Guestbook Entry:", entry);

    // Redirect to confirmation page after submission
    res.redirect('/confirmation');
});

// Admin route to view all guestbook entries
app.get('/admin/guestbook', (req, res) => {
    let html = `
        <h1>All Guestbook Entries</h1>
        <table border="1" cellspacing="0" cellpadding="10">
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Job Title</th>
                <th>Company</th>
                <th>LinkedIn</th>
                <th>How We Met</th>
                <th>Message</th>
                <th>Mailing List</th>
                <th>Email Format</th>
                <th>Submitted On</th>
            </tr>
    `;

    guestbookEntries.forEach(entry => {
        html += `
            <tr>
                <td>${entry.firstName} ${entry.lastName}</td>
                <td>${entry.email}</td>
                <td>${entry.jobTitle || '-'}</td>
                <td>${entry.company || '-'}</td>
                <td>${entry.linkedin || '-'}</td>
                <td>${entry.meet !== '' ? entry.meet : entry.other}</td>
                <td>${entry.message || '-'}</td>
                <td>${entry.mailingList ? 'Yes' : 'No'}</td>
                <td>${entry.emailFormat || '-'}</td>
                <td>${entry.timestamp}</td>
            </tr>
        `;
    });
    html += '</table><br><a href="/">Back to Home</a>';
    res.send(html);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
