import { Message } from '../model/message-schema.js';

export async function getMessage(req, res) {
  try {
    const { senderId, receiverId } = req.params;

    const message = await Message.find({
      $or: [
        {senderId, receiverId},
        {senderId: receiverId, receiverId: senderId}
      ]
    }).sort({createdAt: 1 })

    return res.status(200).json(message)

  } catch (err){
    console.error('Error fetching the messages', err);
    return res.status(500).json({ message: 'Internal Server Error is messages'});
  }
}

export async function sendMessage(req, res) {
  try{
    const {senderId, receiverId, context, image} = req.body;

    if(!senderId || !receiverId){
      return res.status(400).json({ message: 'Sender and Receiver are required'});
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      context,
      image
    })

    await newMessage.save();
    return res.status(201).json(newMessage);

  } catch (err){
    console.error('Error fetching the data', err);
    return res.status(500).json({ message: 'Internal Server Error in sendMessage'});
  }
}