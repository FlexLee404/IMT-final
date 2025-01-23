const Application = require('../models/applicationModel');


exports.getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find().sort({ createdAt: -1 });
        res.status(200).json({ applications });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error });
    }
};

exports.createApplication = async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newApplication = new Application({ name, email, phone, message });
        await newApplication.save();
        res.status(201).json({ message: 'Application submitted successfully', application: newApplication });
    } catch (error) {
        res.status(500).json({ message: 'Error creating application', error });
    }
};


exports.approveApplication = async (req, res) => {
    const { id } = req.params;

    try {
        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = 'approved';
        await application.save();
        res.status(200).json({ message: 'Application approved successfully', application });
    } catch (error) {
        res.status(500).json({ message: 'Error approving application', error });
    }
};

exports.rejectApplication = async (req, res) => {
    const { id } = req.params;

    try {
        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = 'rejected';
        await application.save();
        res.status(200).json({ message: 'Application rejected successfully', application });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting application', error });
    }
};
