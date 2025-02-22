import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.id;
        const { message } = req.body;
        console.log(message);

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        return res.status(201).json({
            Message: "Message sent.",
            success: true
        })

    } catch (error) {
        console.error("Error while sending message : ", error);
        return res.status(500).json({
            Message: "Message not sent.",
            success: false
        })
    }
}
export const getMessage = async (req, res) => {
    try {
        const senderId = req.user._id.toString();
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json({
                success: true,
                messages: []
            });
        }

        return res.status(200).json({
            success: true,
            messages: conversation.messages
        });
    } catch (error) {
        console.error("Error while getting message : ", error);
        return res.status(500).json({
            Message: "Cannot get message.",
            success: false
        })
    }
}