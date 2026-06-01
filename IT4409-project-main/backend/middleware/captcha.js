// Middleware verify captcha cho Google reCAPTCHA (v2 checkbox hoặc v3)
// Frontend cần gửi kèm body: { captchaToken: string }

export const verifyCaptcha = async (req, res, next) => {
  try {
    if (process.env.RECAPTCHA_SKIP_VERIFY === 'true') {
      return next();
    }

    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret && process.env.NODE_ENV !== "production") {
      return next();
    }

    const { captchaToken } = req.body || {};

    if (!captchaToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing captcha token',
      });
    }

    if (!secret) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error', 
      });
    }

    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', captchaToken);

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const data = await response.json();

    if (!data.success) {

      console.warn('reCAPTCHA verify failed:', data['error-codes']);
      return res.status(400).json({
        success: false,
        message: 'Invalid captcha',
      });
    }

    const minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE || '0.5');

    if (typeof data.score === 'number' && data.score < minScore) {
      return res.status(400).json({
        success: false,
        message: 'Captcha score too low',
      });
    }

    return next();
  } catch (error) {
    const isDev = process.env.NODE_ENV === 'development';
    
    return res.status(500).json({
      success: false,
      message: 'Captcha verification failed',
      error: isDev ? (error.message || error) : 'Internal Server Error',
    });
  }
};

export default verifyCaptcha;