const anchor = require('@project-serum/anchor');
const { PublicKey, SystemProgram } = anchor.web3;

const programId = new PublicKey("YourProgramIDWillBeHere");
const provider = anchor.Provider.local();
const program = new anchor.Program(idl, programId, provider);

async function sendMessage(sender, recipient, content) {
    try {
        const messageAccount = anchor.web3.Keypair.generate();
        await program.rpc.sendMessage(content, {
            accounts: {
                message: messageAccount.publicKey,
                sender: sender.publicKey,
                recipient: recipient,
                systemProgram: SystemProgram.programId,
            },
            signers: [messageAccount],
        });
        console.log("Message sent successfully!");
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

async function getMessages(recipient) {
    try {
        const messages = await program.account.message.all();
        const filteredMessages = messages.filter(msg => msg.account.recipient.equals(recipient));
        return filteredMessages;
    } catch (error) {
        console.error("Error retrieving messages:", error);
        return [];
    }
}

(async () => {
    const recipient = new PublicKey("RecipientSolanaAddress");
    try {
        await sendMessage(provider.wallet, recipient, "Hello, Solana!");
        const receivedMessages = await getMessages(recipient);
        console.log("Received Messages:", receivedMessages);
    } catch (error) {
        console.error("Error in example usage:", error);
    }
})();