import * as chatModel from '../models/chatModel.js';

const QWEN_API_URL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1';

const SYSTEM_PROMPT = `You are a helpful assistant for Gateway Hotel, a modern hotel with easy access to Washington, DC. 

About the hotel:
- Located near Capitol Hill with easy access to DC attractions
- Room types: Two Double Beds ($120/night, up to 4 guests), One King Bed ($150/night, up to 2 guests), Accessible Room ($130/night, ADA-friendly)
- Amenities: Free WiFi, Complimentary breakfast, 24/7 Front Desk, Free parking, Fitness center, Business center
- Nearby attractions: Capitol Hill, National Arboretum, National Zoo, Smithsonian Museums

Your role:
- Help guests with reservations, room information, and local recommendations
- Be friendly, professional, and concise
- If asked about booking, collect: dates, room type, number of guests
- For specific reservation requests, suggest they call or use the booking form
- Respond in the same language the guest uses`;

async function callQwenAPI(messages) {
  const apiKey = process.env.QWEN_API_KEY;
  
  if (!apiKey) {
    throw new Error('QWEN_API_KEY not configured');
  }

  const response = await fetch(QWEN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'qwen-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Qwen API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function startSession(req, res) {
  try {
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const existingSession = await chatModel.getSessionByEmail(email);
    
    if (existingSession) {
      const messages = await chatModel.getMessages(existingSession.session_id);
      return res.json({
        sessionId: existingSession.session_id,
        name: existingSession.guest_name,
        email: existingSession.guest_email,
        messages,
        isReturning: true
      });
    }

    const session = await chatModel.createSession(name, email);
    
    const welcomeMessage = name 
      ? `Hello ${name}! Welcome to Gateway Hotel. How can I help you today?`
      : `Hello! Welcome to Gateway Hotel. How can I help you today?`;
    
    await chatModel.addMessage(session.sessionId, 'assistant', welcomeMessage);

    res.json({
      sessionId: session.sessionId,
      name: session.guestName,
      email: session.guestEmail,
      messages: [{ role: 'assistant', content: welcomeMessage }],
      isReturning: false
    });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({ error: 'Failed to start chat session' });
  }
}

export async function sendMessage(req, res) {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Session ID and message required' });
    }

    const session = await chatModel.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await chatModel.addMessage(sessionId, 'user', message);

    const history = await chatModel.getConversationHistory(sessionId, 10);
    
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map(m => ({ role: m.role, content: m.content }))
    ];

    let assistantResponse;
    
    try {
      assistantResponse = await callQwenAPI(messages);
    } catch (apiError) {
      console.error('Qwen API error:', apiError);
      assistantResponse = getFallbackResponse(message);
    }

    await chatModel.addMessage(sessionId, 'assistant', assistantResponse);

    res.json({
      message: assistantResponse,
      sessionId
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
}

function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('room') || lowerMessage.includes('habitacion')) {
    return 'We have three room types: Two Double Beds ($120/night), One King Bed ($150/night), and an Accessible Room ($130/night). Would you like more details about any of these?';
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('precio')) {
    return 'Our room rates start at $120/night for Two Double Beds, $150/night for One King Bed, and $130/night for our Accessible Room. These include complimentary breakfast and WiFi.';
  }
  
  if (lowerMessage.includes('amenity') || lowerMessage.includes('amenities') || lowerMessage.includes('wifi')) {
    return 'Gateway Hotel offers: Free WiFi, Complimentary breakfast, 24/7 Front Desk, Free parking, Fitness center, and a Business center.';
  }
  
  if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('direccion')) {
    return 'We are conveniently located near Capitol Hill with easy access to Washington DC attractions including the Smithsonian Museums, National Zoo, and National Arboretum.';
  }
  
  if (lowerMessage.includes('book') || lowerMessage.includes('reserv')) {
    return 'To make a reservation, please use our booking form on the website or call us directly. I can help you with information about available rooms and rates!';
  }
  
  return 'Thank you for your message! How can I assist you with your stay at Gateway Hotel? I can help with room information, amenities, nearby attractions, or booking inquiries.';
}

export async function getHistory(req, res) {
  try {
    const { sessionId } = req.params;
    
    const session = await chatModel.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const messages = await chatModel.getMessages(sessionId);
    
    res.json({
      session: {
        id: session.session_id,
        name: session.guest_name,
        email: session.guest_email,
        status: session.status
      },
      messages
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get chat history' });
  }
}

export async function endSession(req, res) {
  try {
    const { sessionId } = req.params;
    
    await chatModel.closeSession(sessionId);
    
    res.json({ success: true, message: 'Session closed' });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({ error: 'Failed to end session' });
  }
}

export async function getAllChats(req, res) {
  try {
    const sessions = await chatModel.getAllSessions();
    res.json(sessions);
  } catch (error) {
    console.error('Get all chats error:', error);
    res.status(500).json({ error: 'Failed to get chat sessions' });
  }
}
