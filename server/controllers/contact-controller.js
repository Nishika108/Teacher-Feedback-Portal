const Contact = require("../models/contact-model");

// Submit contact/feedback
const contactForm = async (req, res, next) => {
  try {
    const { userName, email, message } = req.body;
    const contactCreated = await Contact.create({ userName, email, message });
    res.status(201).json({
      message: "Contact form submitted successfully",
      contactId: contactCreated._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};

// Get testimonials for homepage
const getTestimonials = async (req, res, next) => {
  try {
    // Only fetch userName and message fields
    const testimonials = await Contact.find({}, "userName message").sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    next(error);
  }
};

module.exports = { contactForm, getTestimonials };
