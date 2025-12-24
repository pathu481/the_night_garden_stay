const EmailService = {
  send(subject, message) {
    console.log("EMAIL SENT:", subject, message);

    // EmailJS integration later
    // emailjs.send(...)
  }
};
emailjs.send("service_id","template_id",{
  name: data.name,
  phone: data.phone,
  date: data.date
});
