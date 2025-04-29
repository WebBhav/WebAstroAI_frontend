import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Chatroom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [isDetailsSubmitted, setIsDetailsSubmitted] = useState(false);

  useEffect(() => {
    // Check if user details exist in sessionStorage
    const storedDetails = sessionStorage.getItem('userDetails');
    if (storedDetails) {
      setUserDetails(JSON.parse(storedDetails));
      setIsDetailsSubmitted(true);
      setMessages([
        {
          role: 'assistant',
          content:
            'Aap kya janna chahte hain? Apki job ke bare mein, pyar ke bare mein, ya kuch aur? 😊',
        },
      ]);
    } else {
      setMessages([
        {
          role: 'assistant',
          content:
            'Namaste! Apna naam, janm tithi, janm samay, janm sthan ka pin code, aur ling (male/female) batayein.',
        },
      ]);
    }
  }, []);

  const handleSubmitDetails = (e) => {
    e.preventDefault();
    const [name, dob, timeOfBirth, pinCode, gender] = input.split(',').map((item) => item.trim());
    if (name && dob && timeOfBirth && pinCode && gender) {
      const details = { name, dob, timeOfBirth, pinCode, gender };
      setUserDetails(details);
      sessionStorage.setItem('userDetails', JSON.stringify(details));
      setIsDetailsSubmitted(true);
      setMessages([
        ...messages,
        { role: 'user', content: input },
        {
          role: 'assistant',
          content:
            'Aap kya janna chahte hain? Apki job ke bare mein, pyar ke bare mein, ya kuch aur? 😊',
        },
      ]);
      setInput('');
    } else {
      alert('Kripya sari details sahi se bharein!');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/chat`,
        {
          message: input,
          userDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
          },
        }
      );

      setMessages([...newMessages, { role: 'assistant', content: response.data.reply }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Kuch galat ho gaya! Fir se try karein.' },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-purple-600 text-white py-4 text-center">
        <h1 className="text-2xl font-bold">WebAstro AI Chat</h1>
      </header>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-white text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={isDetailsSubmitted ? handleSendMessage : handleSubmitDetails}
        className="p-4 bg-white border-t"
      >
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isDetailsSubmitted
                ? 'Apna sawal yahan likhein...'
                : 'Naam, Janm Tithi, Janm Samay, Pin Code, Ling (alag-alag comma se)'
            }
            className="flex-1 p-2 border rounded-l-lg focus:outline-none"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700"
          >
            Bhejein
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chatroom;
