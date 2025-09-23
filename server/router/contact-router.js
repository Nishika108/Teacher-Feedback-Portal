const express = require("express");
const router = express.Router();
const { contactForm, getTestimonials } = require("../controllers/contact-controller");

// Submit feedback/contact
router.route("/contact").post(contactForm);

// Get all testimonials for homepage
router.route("/contact/testimonials").get(getTestimonials);

module.exports = router;
