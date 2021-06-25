// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

export const sendEmail = (message, { host, port, user, pass }) => {
  if (!host || !port || !user || !pass) {
    console.log('信箱配置不正確，無法發送郵件');
    return null;
  }

  const transport = nodemailer.createTransport({
    host,
    port,
    secureConnection: true,
    secure: true,
    auth: {
      user,
      pass,
    },
  });

  return new Promise((resolve, reject) => {
    transport.sendMail(message, function(err, info) {
      if (err) {
        console.log('發送郵件失敗', err);
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};
