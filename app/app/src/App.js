import React, { useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
const { PublicKey } = anchor.web3;

function App() {
    const [recipient, setRecipient] = useState("");
    const [content, setContent] = useState("");
    const wallet = useWallet();

    const handleSend = async () => {
        try {
            if (!wallet.connected) {
                alert("Please connect your wallet.");
                return;
            }
            const recipientPubkey = new PublicKey(recipient);
            await sendMessage(wallet, recipientPubkey, content);
            alert("Message sent successfully!");
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message. Please try again.");
        }
    };

    return (
        <div>
            <h1>Solana Messaging</h1>
            <input
                type="text"
                placeholder="Recipient Address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
            />
            <textarea
                placeholder="Message"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}

export default App;