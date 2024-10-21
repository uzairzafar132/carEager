
const webpush = require('web-push')
// Replace with your own VAPID keys
const vapidKeys = {
  publicKey: 'BPqUPQSft88RvK_UOwORj1g-GWkeGdkeZz-EST3unkdEI3Vmhuu53qp87fYVib7eRJqAbfKCHUV4szU5_YJ_2Hk',
  privateKey: 'OPPVMUc6k7ssP4jBpP0eghjh0PRhzFa5-1pQZ5n4FrA',
};

webpush.setVapidDetails(
  'mailto:your@email.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

    
exports.sendNotification = async (req, res) => {
  
    try {
    const {title, body } = req.body;

    const payload = JSON.stringify({
      title,
      body,
    });

    await webpush.sendNotification(  payload);
    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
