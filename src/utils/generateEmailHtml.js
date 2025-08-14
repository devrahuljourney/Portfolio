export const generateEmailHTML = (name, email, message) => {
    return `
      <div style="background-color:#0a0a0a; padding:20px; font-family:Arial, sans-serif; color:white;">
        <div style="max-width:600px; margin:auto; border:1px solid rgba(255,255,255,0.2); border-radius:12px; background-color:rgba(255,255,255,0.05);">
          <div style="padding:20px; text-align:center; border-bottom:1px solid rgba(255,255,255,0.1);">
            <h1 style="color:#B9FD50; margin:0;">New Contact Form Submission</h1>
          </div>
          <div style="padding:20px;">
            <p style="margin-bottom:10px;"><strong style="color:#B9FD50;">Name:</strong> ${name}</p>
            <p style="margin-bottom:10px;"><strong style="color:#B9FD50;">Email:</strong> ${email}</p>
            <p style="margin-bottom:10px;"><strong style="color:#B9FD50;">Message:</strong></p>
            <p style="background:rgba(255,255,255,0.05); padding:15px; border-radius:8px;">${message}</p>
          </div>
          <div style="padding:15px; text-align:center; font-size:12px; color:gray; border-top:1px solid rgba(255,255,255,0.1);">
            <p>Portfolio Contact Form • ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    `;
  };
  