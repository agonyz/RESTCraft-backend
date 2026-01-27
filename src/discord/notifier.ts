import axios from 'axios';

export const notifyDiscord = async (webhookUrl: string, message: string) => {
  await axios.post(webhookUrl, {
    content: message,
  });
};
