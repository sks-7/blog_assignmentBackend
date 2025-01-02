// making logger middleware

const checkPasswordorEmail = async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!password.includes('@') || password.length < 4 || password.length > 10) {
      return res.status(404).send({
        masg: 'Password must include @ and be between 4 and 8 characters long',
      });
    }
  
    if (!/^[A-Z]/.test(password)) {
      return res.status(404).send({
        masg: 'Password must start with an uppercase letter',
      });
    }
  

    if (!email.includes('@gmail') || !email.endsWith('.com')) {
      return res.status(404).send({
        masg: 'Invalid email format',
      });
    }
    next();
  };
  
  module.exports = checkPasswordorEmail;